import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { stockApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function StockTransfer() {
  const [form, setForm] = useState({ sku: "", sourceBatch: "", destinationBatch: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.sourceBatch.trim() === form.destinationBatch.trim()) {
      toast.error("Source and destination batch must differ");
      return;
    }

    const qty = Number(form.quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Quantity must be > 0");
      return;
    }

    if (!window.confirm(`Transfer ${qty} units of ${form.sku} from ${form.sourceBatch} to ${form.destinationBatch}?`)) {
      return;
    }

    setLoading(true);
    try {
      await stockApi.transfer({
        sku: form.sku.trim(),
        sourceBatch: form.sourceBatch.trim(),
        destinationBatch: form.destinationBatch.trim(),
        quantity: qty,
      });
      toast.success("Stock transfer completed");
      setForm({ sku: "", sourceBatch: "", destinationBatch: "", quantity: "" });
      navigate("/history");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to transfer stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Stock Transfer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transfer stock between batches</CardTitle>
          <CardDescription>
            Use this flow to move quantity from one existing batch to another for a specific SKU.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sourceBatch">Source Batch</Label>
              <Input
                id="sourceBatch"
                value={form.sourceBatch}
                onChange={(e) => setForm({ ...form, sourceBatch: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="destinationBatch">Destination Batch</Label>
              <Input
                id="destinationBatch"
                value={form.destinationBatch}
                onChange={(e) => setForm({ ...form, destinationBatch: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Transferring..." : "Transfer Stock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
