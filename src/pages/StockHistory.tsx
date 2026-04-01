import { useEffect, useState } from "react";
import { stockApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search } from "lucide-react";

export default function StockHistory() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await stockApi.history();
        setMovements(res.data);
      } catch {
        toast.error("Failed to load stock history");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = movements.filter(
    (m) =>
      m.sku?.toLowerCase().includes(search.toLowerCase()) ||
      m.movementType?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Stock History</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter by SKU or type..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No movements found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m, i) => (
                  <TableRow key={m._id || i}>
                    <TableCell>
                      <Badge
                        variant={
                          m.movementType === "RECEIVE" ? "default" :
                          m.movementType === "DISPATCH" ? "secondary" : "outline"
                        }
                      >
                        {m.movementType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{m.sku}</TableCell>
                    <TableCell>{m.batchNumber || "—"}</TableCell>
                    <TableCell>{m.quantity}</TableCell>
                    <TableCell>{m.user?.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(m.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
