"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import { Download, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

const orderStatusData = [
  { name: "Completed", value: 1245, color: "hsl(var(--chart-1))" },
  { name: "Processing", value: 234, color: "hsl(var(--chart-2))" },
  { name: "Shipped", value: 156, color: "hsl(var(--chart-3))" },
  { name: "Cancelled", value: 45, color: "hsl(var(--chart-4))" },
];

const monthlyOrdersData = [
  { month: "Jan", orders: 245 },
  { month: "Feb", orders: 312 },
  { month: "Mar", orders: 289 },
  { month: "Apr", orders: 356 },
  { month: "May", orders: 398 },
  { month: "Jun", orders: 445 },
];

const recentOrders = [
  { id: "ORD2024001", customer: "Rajesh Sharma", date: "2024-01-15", amount: 285000, status: "Completed" },
  { id: "ORD2024002", customer: "Priya Patel", date: "2024-01-15", amount: 165000, status: "Processing" },
  { id: "ORD2024003", customer: "Amit Kumar", date: "2024-01-14", amount: 125000, status: "Shipped" },
  { id: "ORD2024004", customer: "Sneha Thapa", date: "2024-01-14", amount: 195000, status: "Processing" },
  { id: "ORD2024005", customer: "Bikash Rai", date: "2024-01-13", amount: 35000, status: "Completed" },
];

export default function OrderReportsPage() {
  const [timeRange, setTimeRange] = useState("30d"    
  );
  const [startDate, setStartDate] = useState<Date>(    
  );
  const [endDate, setEndDate] = useState<Date>(    
  );

  const exportReport = (format: string) => {
    toast.success(`Order report exported as ${format.toUpperCase()}`    
  );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Completed: "default" as const,
      Processing: "secondary" as const,
      Shipped: "outline" as const,
      Cancelled: "destructive" as const,
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order Reports</h1>
          <p className="text-muted-foreground">Track and analyze order performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {timeRange === "custom" && (
            <div className="flex items-center gap-2">
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Start date"
              />
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder="End date"
              />
            </div>
          )}
          <Button variant="outline" onClick={() => exportReport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Order Volume</CardTitle>
            <CardDescription>Number of orders per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ orders: { label: "Orders", color: "hsl(var(--chart-1))" } }} className="h-[250px]">
              <AreaChart data={monthlyOrdersData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="orders" stroke="hsl(var(--chart-1))" strokeWidth={3} fill="url(#orderGradient)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer config={{}} className="h-[200px] w-full flex justify-center">
              <PieChart>
                <Pie 
                  data={orderStatusData} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={60} 
                  outerRadius={90}
                  paddingAngle={2}
                  cornerRadius={8}
                  cx="50%"
                  cy="50%"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm w-full">
              {orderStatusData.map((item) => (
                <div key={item.name} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest order transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>NPR {order.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" onClick={() => exportReport("csv")} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => exportReport("excel")} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export Excel
        </Button>
        <Button variant="outline" onClick={() => exportReport("pdf")} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Generate Report
        </Button>
      </div>
    </div>
      
  );
}