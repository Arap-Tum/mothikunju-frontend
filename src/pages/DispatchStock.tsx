import { useState } from "react";
import { stockApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PackageMinus } from "lucide-react";

export default function DispatchStock() {
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // FIFO dispatch — backend selects oldest batch first
      await stockApi.dispatch({ sku, quantity: Number(quantity) });
      toast.success("Stock dispatched successfully (FIFO applied)!");
      setSku("");
      setQuantity("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to dispatch stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dispatch Stock</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageMinus className="h-5 w-5 text-primary" />
            Dispatch Goods
          </CardTitle>
          <CardDescription>
            FIFO enforced — the oldest batch is always dispatched first for chemical product safety.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="e.g. PNT-001" value={sku} onChange={(e) => setSku(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" min="1" placeholder="Enter quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Dispatch Stock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
