'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription, ItemMedia } from "@/components/ui/item";
import { Line, LineChart, Bar, BarChart, Area, AreaChart, Pie, PieChart, Cell, CartesianGrid, XAxis, YAxis } from "recharts";
import { User, ShoppingCart, RefreshCcw, Plus, Pencil, Trash } from "lucide-react";
import { EnhancedRevenueTab } from "./enhanced-revenue-tab";
import { EnhancedCustomersTab } from "./enhanced-customers-tab";
import { EnhancedProductsTab } from "./enhanced-products-tab";
import { EnhancedMarketingTab } from "./enhanced-marketing-tab";
import { EnhancedReportsTab } from "./enhanced-reports-tab";
import { CurrencyDisplay } from "@/components/currency-selector";


interface AnalyticsData {
  overview: Array<{ month: string; totalSales: number; newCustomers: number; orders: number; avgOrderValue: number }>;
  revenue: {
    chartData: Array<{ month: string; total: number; subscriptions: number; oneTime: number; refunds: number; upgrades: number; addons: number }>;
    sources: Array<{ source: string; amount: string; percentage: string; growth: string; trend?: number[] }>;
    metrics: { mrr: number; arr: number; churnRate: number; ltv: number; cac: number; paybackPeriod: number; grossMargin: number; netRevenue: number; recurringRevenue: number };
    cohorts: Array<{ month: string; customers: number; retention: number[] }>;
    forecasting: {
      nextMonth: { predicted: number; confidence: number; range: number[] };
      nextQuarter: { predicted: number; confidence: number; range: number[] };
      yearEnd: { predicted: number; confidence: number; range: number[] };
    };
  };
  customers: {
    segmentation: Array<{ name: string; value: number; color: string; growth: string }>;
    activities: Array<{ id: number; customer: string; activity: string; time: string; value: string }>;
    demographics: {
      ageGroups: Array<{ range: string; count: number; percentage: number }>;
      locations: Array<{ country: string; count: number; percentage: number }>;
    };
  };
  products: {
    performance: Array<{ month: string; sales: number; units: number; profit: number; returns: number }>;
    topProducts: Array<{ id: number; name: string; sales: number; units: number; progress: number; margin: number }>;
    categories: Array<{ id: number; name: string; sales: number; count: number; growth: string; margin: number }>;
    inventory: { lowStock: number; outOfStock: number; totalProducts: number; avgStockLevel: number };
  };
  marketing: {
    channels: Array<{ channel: string; visitors: number; conversions: number; cost: number; roas: string }>;
    campaigns: Array<{ name: string; status: string; budget: number; spent: number; conversions: number; roas: string }>;
  };
  reports: {
    saved: Array<{ id: number; name: string; type: string; created: string; status: string; lastRun: string }>;
  };
  stats: {
    totalSales: string;
    newCustomers: string;
    conversionRate: number;
    avgOrderValue: number;
    totalOrders: number;
    activeSubscriptions: number;
    churnRate: number;
    customerSatisfaction: number;
  };
}

interface AnalyticsClientProps {
  data: AnalyticsData;
  timeRange: string;
}

const overviewChartConfig = {
  totalSales: { label: "Total Sales", color: "hsl(var(--chart-1))" },
  newCustomers: { label: "New Customers", color: "hsl(var(--chart-2))" },
};

const revenueChartConfig = {
  total: { label: "Total Revenue", color: "hsl(var(--chart-1))" },
  subscriptions: { label: "Subscriptions", color: "hsl(var(--chart-2))" },
  oneTime: { label: "One-time Sales", color: "hsl(var(--chart-3))" },
};

const customerSegmentationConfig = {
  newCustomers: { label: "New Customers", color: "hsl(var(--chart-1))" },
  returningCustomers: { label: "Returning Customers", color: "hsl(var(--chart-2))" },
  highValueCustomers: { label: "High-Value Customers", color: "hsl(var(--chart-3))" },
  churnedCustomers: { label: "Churned Customers", color: "hsl(var(--chart-4))" },
};

const productPerformanceConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  units: { label: "Units Sold", color: "hsl(var(--chart-2))" },
};

export default function AnalyticsClient({ data, timeRange }: AnalyticsClientProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedView, setSelectedView] = useState("overview");




  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Mobile: Dropdown */}
        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-full sm:w-[200px] md:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="products">Products</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="reports">Reports</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        {/* Desktop: Tabs */}
        <TabsList className="hidden md:grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>+20.1% from last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.totalSales}</div>
                <div className="text-sm text-muted-foreground mt-1">{data.stats.totalOrders} orders</div>
                <ChartContainer config={overviewChartConfig} className="mt-4 h-[100px]">
                  <LineChart data={data.overview} margin={{ left: 12, right: 12 }}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Line dataKey="totalSales" type="monotone" stroke="var(--color-totalSales)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
                <CardDescription>+25% from last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.newCustomers}</div>
                <div className="text-sm text-muted-foreground mt-1">Active: {data.stats.activeSubscriptions}</div>
                <ChartContainer config={overviewChartConfig} className="mt-4 h-[100px]">
                  <BarChart data={data.overview} margin={{ left: 12, right: 12 }}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Bar dataKey="newCustomers" fill="var(--color-newCustomers)" radius={2} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg Order Value</CardTitle>
                <CardDescription>+8% from last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"><CurrencyDisplay amount={data.stats.avgOrderValue} /></div>
                <div className="text-sm text-muted-foreground mt-1">Conversion: {data.stats.conversionRate}%</div>
                <div className="mt-4">
                  <Progress value={data.stats.conversionRate * 12} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Churn: {data.stats.churnRate}%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.stats.customerSatisfaction}/5.0</div>
                <div className="text-sm text-muted-foreground mt-1">Based on 1,240 reviews</div>
                <div className="mt-4">
                  <Progress value={data.stats.customerSatisfaction * 20} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="h-[300px]">
                  <AreaChart data={data.revenue.chartData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="total" type="monotone" fill="var(--color-total)" stroke="var(--color-total)" fillOpacity={0.3} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Business health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Recurring Revenue</span>
                    <span className="text-lg font-bold"><CurrencyDisplay amount={data.revenue.metrics.mrr} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Lifetime Value</span>
                    <span className="text-lg font-bold"><CurrencyDisplay amount={data.revenue.metrics.ltv} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Acquisition Cost</span>
                    <span className="text-lg font-bold"><CurrencyDisplay amount={data.revenue.metrics.cac} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">LTV:CAC Ratio</span>
                    <Badge variant="secondary">{(data.revenue.metrics.ltv / data.revenue.metrics.cac).toFixed(1)}:1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <EnhancedRevenueTab data={data.revenue} />
        </TabsContent>

        <TabsContent value="customers" className="mt-4">
          <EnhancedCustomersTab data={data.customers} />
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <EnhancedProductsTab data={data.products} />
        </TabsContent>

        <TabsContent value="marketing" className="mt-4">
          <EnhancedMarketingTab data={data.marketing} />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <EnhancedReportsTab data={data.reports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}