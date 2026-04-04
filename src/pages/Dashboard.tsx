import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { auditService, orderService } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Order } from "@/types";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface CriticalItems {
  summary?: {
    totalLowStock: number;
    totalExpired: number;
    totalExpiring: number;
  };
}

export default function Dashboard() {
  const { user, isWarehouseManager, isInventoryManager, isPicker, isPacker, isDispatchOfficer, isSalesStaff, isReceivingOfficer } = useAuth();
  const { toast } = useToast();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [criticalItems, setCriticalItems] = useState<CriticalItems | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Load common data
      if (isWarehouseManager || isInventoryManager) {
        const critical = await auditService.getCriticalItems();
        setCriticalItems(critical);
      }

      if (isSalesStaff) {
        const orders = await orderService.getMyOrders();
        setRecentOrders(orders.slice(0, 5));
      } else {
        const orders = await orderService.getAll();
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isWarehouseManager, isInventoryManager, isSalesStaff, toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-gray-600">
          You are logged in as <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      {/* Role-Specific Dashboard Content */}

      {/* Warehouse Manager Dashboard */}
      {isWarehouseManager && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  <Package className="w-4 h-4 inline mr-2" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{recentOrders.length}</p>
              </CardContent>
            </Card>

            {criticalItems && (
              <>
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-800">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Low Stock Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-900">
                      {criticalItems.summary?.totalLowStock || 0}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-800">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Expired Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-900">
                      {criticalItems.summary?.totalExpired || 0}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-800">
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Expiring Soon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-900">
                      {criticalItems.summary?.totalExpiring || 0}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Quick Links for Warehouse Manager */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">• Manage Users</p>
                <p className="text-sm">• View Reports</p>
                <p className="text-sm">• Assign Tasks</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Inventory Manager Dashboard */}
      {isInventoryManager && (
        <>
          {criticalItems && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{criticalItems.summary?.totalLowStock || 0}</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{criticalItems.summary?.totalExpired || 0}</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{criticalItems.summary?.totalExpiring || 0}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Inventory Management Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Conduct Physical Audits</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> View Stock Movement History</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Generate Accuracy Reports</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Monitor Inventory Levels</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* Picker Dashboard */}
      {isPicker && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Your Picking Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and update your assigned picking orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Picking Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Check the picklist</p>
              <p>2. Pick items from shelves</p>
              <p>3. Mark items as picked</p>
              <p>4. Items ready for packing</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Packer Dashboard */}
      {isPacker && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg">Your Packing Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and confirm your assigned packing orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Packing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Get picked items ready</p>
              <p>2. Verify items match order</p>
              <p>3. Pack into boxes/containers</p>
              <p>4. Mark as packed when complete</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dispatch Officer Dashboard */}
      {isDispatchOfficer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg">Dispatch Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage shipments and track deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispatch Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. View ready-to-ship orders</p>
              <p>2. Generate tracking numbers</p>
              <p>3. Confirm shipment</p>
              <p>4. Mark as delivered</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Receiving Officer Dashboard */}
      {isReceivingOfficer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-cyan-200 bg-cyan-50">
            <CardHeader>
              <CardTitle className="text-lg">Receiving Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage incoming goods and update inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receiving Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Create receiving document</p>
              <p>2. Update received quantities</p>
              <p>3. Inspect goods</p>
              <p>4. Accept or reject</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Staff Dashboard */}
      {isSalesStaff && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {recentOrders.filter(o => o.orderStatus === 'pending').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {recentOrders.filter(o => ['picking', 'packing', 'packed'].includes(o.orderStatus)).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {recentOrders.filter(o => ['shipped', 'delivered'].includes(o.orderStatus)).length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center py-4 text-gray-600">No orders found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
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
