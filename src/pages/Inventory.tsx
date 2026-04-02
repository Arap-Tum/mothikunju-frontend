import { useEffect, useMemo, useState } from "react";
import { inventoryApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Edit, Trash2 } from "lucide-react";

interface InventoryItem {
  _id: string;
  sku: string;
  productName: string;
  category: string;
  reorderLevel: number;
  totalQuantity: number;
  batches: string[];
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    sku: "",
    productName: "",
    category: "",
    reorderLevel: "0",
    batches: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getAll();
      setItems(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const resetForm = () => {
    setMode("create");
    setEditingId(null);
    setForm({ sku: "", productName: "", category: "", reorderLevel: "0", batches: "" });
    setErrors({});
  };

  const handleEdit = (item: InventoryItem) => {
    setMode("edit");
    setEditingId(item._id);
    setForm({
      sku: item.sku,
      productName: item.productName,
      category: item.category,
      reorderLevel: String(item.reorderLevel),
      batches: item.batches?.join(", ") ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: InventoryItem) => {
    if (!window.confirm(`Delete inventory SKU ${item.sku}?`)) return;
    try {
      await inventoryApi.delete(item.sku);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      toast.success("Inventory item deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const payload = {
      sku: form.sku.trim(),
      productName: form.productName.trim(),
      category: form.category.trim(),
      reorderLevel: Number(form.reorderLevel),
      batches: form.batches
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
    };

    try {
      if (!payload.sku || !payload.productName || !payload.category || payload.reorderLevel < 0) {
        throw { response: { data: { message: "Validation error", errors: { sku: "Required" } } } };
      }

      if (mode === "create") {
        const res = await inventoryApi.create(payload);
        setItems((prev) => [res.data, ...prev]);
        toast.success("Inventory item created");
      } else if (mode === "edit" && editingId) {
        await inventoryApi.update(payload.sku, payload);
        toast.success("Inventory item updated");
        await loadItems();
      }

      resetForm();
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        setErrors(apiErrors);
      }
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create Inventory Item" : "Edit Inventory Item"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  required
                  readOnly={mode === "edit"}
                />
                {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
              </div>
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  required
                />
                {errors.productName && <p className="text-xs text-destructive">{errors.productName}</p>}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>
              <div>
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  min={0}
                  value={form.reorderLevel}
                  onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
                  required
                />
                {errors.reorderLevel && <p className="text-xs text-destructive">{errors.reorderLevel}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="batches">Batches (comma-separated)</Label>
              <Input
                id="batches"
                value={form.batches}
                onChange={(e) => setForm({ ...form, batches: e.target.value })}
                placeholder="BatchA, BatchB"
              />
              {errors.batches && <p className="text-xs text-destructive">{errors.batches}</p>}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
              </Button>
              {mode === "edit" && (
                <Button type="button" variant="ghost" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by SKU, name, or category..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Qty</TableHead>
                <TableHead>Reorder</TableHead>
                <TableHead>Batches</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => {
                  const low = item.totalQuantity <= item.reorderLevel;
                  return (
                    <TableRow key={item._id}>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>{item.batches?.join(", ") || "—"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                        </Button>
                        <Badge variant={low ? "destructive" : "default"} className="whitespace-nowrap">
                          {low ? "Low" : "Okay"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
