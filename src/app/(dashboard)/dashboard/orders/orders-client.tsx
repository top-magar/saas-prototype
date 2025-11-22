'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Line, LineChart, Bar, BarChart, Pie, PieChart, Cell, CartesianGrid, XAxis, YAxis } from "recharts";
import { Package, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, Download } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

interface OrdersData {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    fulfillmentRate: number;
    avgProcessingTime: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    product: string;
    date: string;
    amount: number;
    status: string;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  orderTrends: Array<{
    month: string;
    orders: number;
    revenue: number;
    avgValue: number;
  }>;
  topProducts: Array<{
    name: string;
    orders: number;
    revenue: number;
    avgValue: number;
  }>;
}

const orderTrendsConfig = {
  orders: { label: "Orders", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
};

export default function OrdersClient({ data }: { data: OrdersData }) {
  const { formatCurrency } = useCurrency();
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': case 'shipped': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'default';
      case 'processing': case 'shipped': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="font-mono">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Order Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total Orders</div>
              <Badge variant="secondary" className="text-xs font-mono">+18%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{data.stats.totalOrders.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">All Time</div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total Revenue</div>
              <Badge variant="secondary" className="text-xs font-mono">+22%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{formatCurrency(data.stats.totalRevenue)}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Order Revenue</div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Avg Order Value</div>
              <Badge variant="secondary" className="text-xs font-mono">+5%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{formatCurrency(data.stats.avgOrderValue)}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Per Order</div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Fulfillment Rate</div>
              <Badge variant="secondary" className="text-xs font-mono">+2.1%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{data.stats.fulfillmentRate}%</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Order Trends and Status Distribution */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              ORDER TRENDS
            </CardTitle>
            <CardDescription>Monthly order volume and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={orderTrendsConfig} className="h-[300px]">
              <LineChart data={data.orderTrends} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} className="text-xs font-mono" />
                <YAxis tickLine={false} axisLine={false} className="text-xs font-mono" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line dataKey="orders" type="monotone" stroke="var(--color-orders)" strokeWidth={2} dot={false} />
                <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">ORDER STATUS</CardTitle>
            <CardDescription>Distribution by order status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ChartContainer config={{}} className="h-[200px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="status" />} />
                  <Pie data={data.ordersByStatus} dataKey="count" nameKey="status" innerRadius={40} outerRadius={80} strokeWidth={2}>
                    {data.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="space-y-2">
                {data.ordersByStatus.map((status) => (
                  <div key={status.status} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border" style={{ backgroundColor: status.color }} />
                      <span>{status.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{status.count}</span>
                      <span className="text-muted-foreground">({status.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
            <Package className="h-4 w-4" />
            TOP PRODUCTS BY ORDERS
          </CardTitle>
          <CardDescription>Best selling products by order volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 border border-border/50 hover:border-border transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono font-bold text-muted-foreground w-6">#{index + 1}</div>
                  <div className="space-y-1">
                    <div className="text-sm font-mono font-medium">{product.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{product.orders} orders</div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-mono font-bold">{formatCurrency(product.revenue)}</div>
                  <div className="text-xs font-mono text-muted-foreground">Avg: {formatCurrency(product.avgValue)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">RECENT ORDERS</CardTitle>
          <CardDescription>Latest order activity and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-border/50 hover:border-border transition-all">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div className="space-y-1">
                    <div className="text-sm font-mono font-medium">{order.id}</div>
                    <div className="text-xs font-mono text-muted-foreground">{order.customer}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-mono">{order.product}</div>
                    <div className="text-xs font-mono text-muted-foreground">{order.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right space-y-1">
                    <div className="text-sm font-mono font-bold">{formatCurrency(order.amount)}</div>
                    <Badge variant={getStatusVariant(order.status)} className="text-xs font-mono">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <div>
                <div className="text-sm font-mono font-semibold uppercase tracking-wide">Processing Time</div>
                <div className="text-xs font-mono text-muted-foreground">Average order processing</div>
              </div>
            </div>
            <div className="text-2xl font-mono font-bold mb-2">{data.stats.avgProcessingTime} days</div>
            <Progress value={75} className="h-2" />
            <div className="text-xs font-mono text-muted-foreground mt-2">Target: 2.0 days</div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <div className="text-sm font-mono font-semibold uppercase tracking-wide">Success Rate</div>
                <div className="text-xs font-mono text-muted-foreground">Order completion rate</div>
              </div>
            </div>
            <div className="text-2xl font-mono font-bold mb-2">{data.stats.fulfillmentRate}%</div>
            <Progress value={data.stats.fulfillmentRate} className="h-2" />
            <div className="text-xs font-mono text-muted-foreground mt-2">Target: 95%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}