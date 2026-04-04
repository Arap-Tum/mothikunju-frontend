import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { pickingService } from "@/lib/services";
import { PickedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const pickingItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  batchNumber: z.string().min(1, "Batch number is required"),
});

const markPickedSchema = z.object({
  items: z.array(pickingItemSchema).min(1, "At least one item must be picked"),
});

type MarkPickedFormValues = z.infer<typeof markPickedSchema>;

interface Props {
  orderId: string;
  orderItems: Array<{ sku: string; productName: string; quantity: number }>;
  onSuccess?: () => void;
}

export default function MarkPickedForm({ orderId, orderItems, onSuccess }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pickedItems, setPickedItems] = useState<PickedItem[]>(
    orderItems.map((item) => ({
      sku: item.sku,
      quantity: item.quantity,
      batchNumber: "",
    }))
  );

  const form = useForm<MarkPickedFormValues>({
    resolver: zodResolver(markPickedSchema),
    defaultValues: {
      items: pickedItems,
    },
  });

  const updateItem = (index: number, field: keyof PickedItem, value: string | number) => {
    const newItems = [...pickedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setPickedItems(newItems);
  };

  async function onSubmit() {
    setIsLoading(true);
    try {
      await pickingService.markItemsAsPicked(orderId, pickedItems);
      toast({
        title: "Success",
        description: "Items marked as picked successfully",
      });
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to mark items as picked",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Picked Items</h3>

        <div className="space-y-2">
          {pickedItems.map((item, index) => {
            const orderItem = orderItems.find((oi) => oi.sku === item.sku);
            return (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium">SKU</label>
                      <Input value={item.sku} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Product</label>
                      <Input value={orderItem?.productName || ""} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Qty to Pick</label>
                      <Input
                        type="number"
                        min="1"
                        max={orderItem?.quantity || 1}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Batch Number</label>
                      <Input
                        placeholder="BATCH-001"
                        value={item.batchNumber}
                        onChange={(e) => updateItem(index, "batchNumber", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Marking as Picked..." : "Mark as Picked"}
      </Button>
    </form>
  );
}
