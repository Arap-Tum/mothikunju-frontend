import { useState } from "react";
import { stockApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PackagePlus } from "lucide-react";

export default function ReceiveStock() {
  const [form, setForm] = useState({
    sku: "",
    batchNumber: "",
    quantity: "",
    manufactureDate: "",
    expiryDate: "",
    storageLocationCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await stockApi.receive({
        ...form,
        quantity: Number(form.quantity),
      });
      toast.success("Stock received successfully!");
      setForm({ sku: "", batchNumber: "", quantity: "", manufactureDate: "", expiryDate: "", storageLocationCode: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to receive stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Receive Stock</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-primary" />
            Receive Goods
          </CardTitle>
          <CardDescription>
            Log incoming stock. The system will update inventory and create an audit trail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" placeholder="e.g. PNT-001" value={form.sku} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input id="batchNumber" name="batchNumber" placeholder="e.g. B-2024-001" value={form.batchNumber} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min="1" placeholder="Enter quantity" value={form.quantity} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufactureDate">Manufacture Date</Label>
                <Input id="manufactureDate" name="manufactureDate" type="date" value={form.manufactureDate} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageLocationCode">Storage Location Code</Label>
              <Input id="storageLocationCode" name="storageLocationCode" placeholder="e.g. A-1-01" value={form.storageLocationCode} onChange={handleChange} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Receive Stock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
