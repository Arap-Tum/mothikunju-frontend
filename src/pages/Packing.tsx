import { useState, useEffect, useCallback } from "react";
import { packingService } from "@/lib/services";
import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmPackedForm } from "@/components/forms";
import { Package } from "lucide-react";

export default function PackingPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const loadPackingList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await packingService.getReadyForPacking();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load packing list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPackingList();
  }, [loadPackingList]);

  const handleConfirmPacked = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleSuccess = () => {
    loadPackingList();
    setOpenDialog(false);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Packing</h1>
        <p className="text-gray-600">Confirm and pack picked items</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Packing List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading packing list...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-4 text-gray-600">No orders to pack</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>
                      <ul className="text-sm">
                        {order.items.map((item) => (
                          <li key={item.sku}>
                            {item.productName} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Dialog open={openDialog && selectedOrder?._id === order._id} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => handleConfirmPacked(order)}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Pack
                          </Button>
                        </DialogTrigger>
                        {selectedOrder && (
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Confirm Packed Items - {selectedOrder.orderNumber}</DialogTitle>
                            </DialogHeader>
                            <ConfirmPackedForm
                              orderId={selectedOrder._id}
                              orderItems={selectedOrder.items}
                              onSuccess={handleSuccess}
                            />
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
