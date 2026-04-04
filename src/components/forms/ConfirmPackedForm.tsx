import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { packingService } from "@/lib/services";
import { PackedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  orderId: string;
  orderItems: Array<{ sku: string; productName: string; quantity: number }>;
  onSuccess?: () => void;
}

export default function ConfirmPackedForm({ orderId, orderItems, onSuccess }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [packedItems, setPackedItems] = useState<Set<string>>(new Set());

  const togglePacked = (sku: string) => {
    const newPacked = new Set(packedItems);
    if (newPacked.has(sku)) {
      newPacked.delete(sku);
    } else {
      newPacked.add(sku);
    }
    setPackedItems(newPacked);
  };

  async function onSubmit() {
    if (packedItems.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to pack",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const items: PackedItem[] = Array.from(packedItems).map((sku) => ({ sku }));
      await packingService.confirmPacked(orderId, items);
      toast({
        title: "Success",
        description: "Items packed successfully",
      });
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to confirm packed items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Confirm Packed Items</h3>

        <div className="space-y-2">
          {orderItems.map((item) => (
            <Card key={item.sku}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      SKU: {item.sku} | Qty: {item.quantity}
                    </p>
                  </div>
                  <Checkbox
                    checked={packedItems.has(item.sku)}
                    onCheckedChange={() => togglePacked(item.sku)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Confirming Packed..." : "Confirm Packed"}
      </Button>
    </form>
  );
}
