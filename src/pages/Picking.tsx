import { useState, useEffect, useCallback } from "react";
import { pickingService } from "@/lib/services";
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
import { MarkPickedForm } from "@/components/forms";
import { CheckCircle2 } from "lucide-react";

export default function PickingPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const loadPickingList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pickingService.getPendingList();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load picking list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPickingList();
  }, [loadPickingList]);

  const handleMarkPicked = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleSuccess = () => {
    loadPickingList();
    setOpenDialog(false);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Picking</h1>
        <p className="text-gray-600">Pick items for pending orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Picking List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading picking list...</p>
          ) : orders.length === 0 ? (
            <p className="text-center py-4 text-gray-600">No orders to pick</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
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
                    <TableCell>
                      <Badge variant="outline">{order.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Dialog open={openDialog && selectedOrder?._id === order._id} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => handleMarkPicked(order)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Pick
                          </Button>
                        </DialogTrigger>
                        {selectedOrder && (
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Mark Items as Picked - {selectedOrder.orderNumber}</DialogTitle>
                            </DialogHeader>
                            <MarkPickedForm
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
