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
import { Receiving, ReceivingItem } from "@/types";
import * as z from "zod";
import { receivingService } from "@/lib/services";
import { Card, CardContent } from "@/components/ui/card";

const receivingItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  productName: z.string().min(1, "Product name is required"),
  expectedQuantity: z.number().min(1, "Expected quantity must be at least 1"),
  batchNumber: z.string().min(1, "Batch number is required"),
  manufactureDate: z.string(),
  expiryDate: z.string(),
  storageLocationCode: z.string().min(1, "Storage location is required"),
});

const createReceivingSchema = z.object({
  receivingNumber: z.string().min(1, "Receiving number is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  supplierContact: z.string().min(1, "Supplier contact is required"),
  supplierEmail: z.string().email("Invalid email"),
  purchaseOrder: z.string().min(1, "PO number is required"),
  items: z.array(receivingItemSchema).min(1, "At least one item is required"),
});

type CreateReceivingFormValues = z.infer<typeof createReceivingSchema>;

interface Props {
  onSuccess?: (receiving: Receiving) => void;
}

export default function CreateReceivingForm({ onSuccess }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ReceivingItem[]>([
    {
      sku: "",
      productName: "",
      expectedQuantity: 1,
      batchNumber: "",
      manufactureDate: new Date(),
      expiryDate: new Date(),
      storageLocationCode: "",
    },
  ]);

  const form = useForm<CreateReceivingFormValues>({
    resolver: zodResolver(createReceivingSchema),
    defaultValues: {
      receivingNumber: `RCV-${Date.now()}`,
      supplierName: "",
      supplierContact: "",
      supplierEmail: "",
      purchaseOrder: "",
      items: [],
    },
  });

  const addItem = () => {
    setItems([
      ...items,
      {
        sku: "",
        productName: "",
        expectedQuantity: 1,
        batchNumber: "",
        manufactureDate: new Date(),
        expiryDate: new Date(),
        storageLocationCode: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ReceivingItem, value: string | number | Date) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  async function onSubmit(values: CreateReceivingFormValues) {
    setIsLoading(true);
    try {
      const receiving = await receivingService.create({
        receivingNumber: values.receivingNumber,
        supplier: {
          name: values.supplierName,
          contact: values.supplierContact,
          email: values.supplierEmail,
        },
        purchaseOrder: values.purchaseOrder,
        items,
      });
      toast({
        title: "Success",
        description: "Receiving document created successfully",
      });
      onSuccess?.(receiving);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create receiving",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="receivingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiving Number</FormLabel>
                <FormControl>
                  <Input placeholder="RCV-001" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Order</FormLabel>
                <FormControl>
                  <Input placeholder="PO-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Supplier Information */}
        <div className="space-y-4">
          <h3 className="font-semibold">Supplier Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Supplier Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="supplier@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="0700000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Receiving Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Receiving Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              Add Item
            </Button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">SKU</label>
                      <Input
                        placeholder="SKU-001"
                        value={item.sku}
                        onChange={(e) => updateItem(index, "sku", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Product Name</label>
                      <Input
                        placeholder="Product"
                        value={item.productName}
                        onChange={(e) => updateItem(index, "productName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expected Qty</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.expectedQuantity}
                        onChange={(e) => updateItem(index, "expectedQuantity", parseInt(e.target.value))}
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
                    <div>
                      <label className="text-sm font-medium">Manufacture Date</label>
                      <Input
                        type="date"
                        value={item.manufactureDate?.toString().split('T')[0] || ''}
                        onChange={(e) => updateItem(index, "manufactureDate", new Date(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expiry Date</label>
                      <Input
                        type="date"
                        value={item.expiryDate?.toString().split('T')[0] || ''}
                        onChange={(e) => updateItem(index, "expiryDate", new Date(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Storage Location</label>
                      <Input
                        placeholder="LOC-001"
                        value={item.storageLocationCode}
                        onChange={(e) => updateItem(index, "storageLocationCode", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    Remove Item
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Receiving..." : "Create Receiving Document"}
        </Button>
      </form>
    </Form>
  );
}
