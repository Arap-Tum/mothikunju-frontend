import { useState, useEffect, useCallback } from "react";
import { dispatchService } from "@/lib/services";
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
import { ConfirmShipmentForm } from "@/components/forms";
import { Truck, CheckCircle2 } from "lucide-react";

export default function DispatchPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const loadDispatchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dispatchService.getReadyForDispatch();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dispatch list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDispatchList();
  }, [loadDispatchList]);

  const handleConfirmShipment = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleSuccess = () => {
    loadDispatchList();
    setOpenDialog(false);
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await dispatchService.markDelivered(orderId);
      toast({
        title: "Success",
        description: "Order marked as delivered",
      });
      loadDispatchList();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark order as delivered",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dispatch</h1>
        <p className="text-gray-600">Manage shipments and deliveries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dispatch List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading dispatch list...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-4 text-gray-600">No orders to dispatch</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.trackingNumber || "Not assigned"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="space-x-2">
                      {!order.trackingNumber ? (
                        <Dialog open={openDialog && selectedOrder?._id === order._id} onOpenChange={setOpenDialog}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => handleConfirmShipment(order)}
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Ship
                            </Button>
                          </DialogTrigger>
                          {selectedOrder && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Shipment</DialogTitle>
                              </DialogHeader>
                              <ConfirmShipmentForm
                                orderId={selectedOrder._id}
                                orderNumber={selectedOrder.orderNumber}
                                onSuccess={handleSuccess}
                              />
                            </DialogContent>
                          )}
                        </Dialog>
                      ) : order.orderStatus !== 'delivered' ? (
                        <Button
                          size="sm"
                          onClick={() => handleMarkDelivered(order._id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Delivered
                        </Button>
                      ) : null}
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
