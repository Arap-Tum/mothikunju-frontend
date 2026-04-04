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
import { dispatchService } from "@/lib/services";

const confirmShipmentSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
});

type ConfirmShipmentFormValues = z.infer<typeof confirmShipmentSchema>;

interface Props {
  orderId: string;
  orderNumber: string;
  onSuccess?: () => void;
}

export default function ConfirmShipmentForm({ orderId, orderNumber, onSuccess }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConfirmShipmentFormValues>({
    resolver: zodResolver(confirmShipmentSchema),
    defaultValues: {
      trackingNumber: `TRK-${Date.now()}`,
    },
  });

  async function onSubmit(values: ConfirmShipmentFormValues) {
    setIsLoading(true);
    try {
      await dispatchService.confirmShipment(orderId, {
        trackingNumber: values.trackingNumber,
      });
      toast({
        title: "Success",
        description: "Shipment confirmed successfully",
      });
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to confirm shipment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-lg font-semibold">{orderNumber}</p>
        </div>

        <FormField
          control={form.control}
          name="trackingNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracking Number</FormLabel>
              <FormControl>
                <Input placeholder="TRK-20260404-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Confirming Shipment..." : "Confirm Shipment"}
        </Button>
      </form>
    </Form>
  );
}
