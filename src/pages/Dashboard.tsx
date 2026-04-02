import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, History } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DashboardData {
  totalStockValue: number;
  lowStockItems: any[];
  recentMovements: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const lowStockChartData = data?.lowStockItems?.map((item: any) => ({
    name: item.sku,
    value: item.totalQuantity,
  })) || [];

  const movementChartData = data?.recentMovements?.reduce((acc: any[], item: any) => {
    const type = item.movementType || "UNKNOWN";
    const existing = acc.find((row) => row.type === type);
    if (existing) existing.count += 1;
    else acc.push({ type, count: 1 });
    return acc;
  }, []) || [];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.get();
        setData(res.data);
      } catch (err: any) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.totalStockValue?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total units across all SKUs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{data?.lowStockItems?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Items below reorder level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Movements</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.recentMovements?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Latest stock transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockChartData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={lowStockChartData} dataKey="value" nameKey="name" outerRadius={80} fill="#2563eb" label>
                      {lowStockChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={["#3b82f6", "#ef4444", "#f59e0b", "#10b981"][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No low-stock data to chart.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movement Type Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {movementChartData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={movementChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No movement data to chart.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items */}
      {data?.lowStockItems && data.lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Qty</TableHead>
                  <TableHead>Reorder Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lowStockItems.map((item: any) => (
                  <TableRow key={item.sku}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{item.totalQuantity}</Badge>
                    </TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Movements */}
      {data?.recentMovements && data.recentMovements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentMovements.map((m: any, i: number) => (
                  <TableRow key={m._id || i}>
                    <TableCell>
                      <Badge
                        variant={
                          m.movementType === "RECEIVE" ? "default" :
                          m.movementType === "DISPATCH" ? "secondary" : "outline"
                        }
                      >
                        {m.movementType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{m.sku}</TableCell>
                    <TableCell>{m.quantity}</TableCell>
                    <TableCell>{m.user?.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
