import { useState, useEffect, useCallback } from "react";
import { receivingService } from "@/lib/services";
import { Receiving } from "@/types";
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
import { CreateReceivingForm } from "@/components/forms";
import { Plus, CheckCircle2, XCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ReceivingPage() {
  const { toast } = useToast();
  const [receivings, setReceivings] = useState<Receiving[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const loadReceivings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await receivingService.getAll();
      setReceivings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load receiving documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadReceivings();
  }, [loadReceivings]);

  const handleReceivingCreated = (receiving: Receiving) => {
    setReceivings([receiving, ...receivings]);
    setOpenDialog(false);
  };

  const handleAccept = async (id: string) => {
    try {
      await receivingService.accept(id);
      toast({
        title: "Success",
        description: "Receiving accepted and inventory updated",
      });
      loadReceivings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept receiving",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await receivingService.reject(id, {
        rejectionReason: "Quality check failed",
      });
      toast({
        title: "Success",
        description: "Receiving rejected",
      });
      loadReceivings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject receiving",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Receiving</h1>
          <p className="text-gray-600">Manage incoming goods and inventory</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Receiving Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Receiving Document</DialogTitle>
            </DialogHeader>
            <CreateReceivingForm onSuccess={handleReceivingCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receiving Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading receiving documents...</p>
          ) : receivings.length === 0 ? (
            <p className="text-center py-4 text-gray-600">No receiving documents</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receiving No.</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivings.map((receiving) => (
                  <TableRow key={receiving._id}>
                    <TableCell className="font-medium">{receiving.receivingNumber}</TableCell>
                    <TableCell>{receiving.purchaseOrder}</TableCell>
                    <TableCell>{receiving.supplier.name}</TableCell>
                    <TableCell>{receiving.items.length}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[receiving.receivingStatus] || "bg-gray-100 text-gray-800"}>
                        {receiving.receivingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(receiving.createdAt)}</TableCell>
                    <TableCell className="space-x-2">
                      {receiving.receivingStatus === "in_progress" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAccept(receiving._id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(receiving._id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
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
