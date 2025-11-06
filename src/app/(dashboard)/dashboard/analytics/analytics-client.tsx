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

interface AnalyticsData {
  overview: Array<{ month: string; totalSales: number; newCustomers: number; orders: number; avgOrderValue: number }>;
  revenue: {
    chartData: Array<{ month: string; total: number; subscriptions: number; oneTime: number; refunds: number }>;
    sources: Array<{ source: string; amount: string; percentage: string; growth: string }>;
    metrics: { mrr: number; arr: number; churnRate: number; ltv: number; cac: number };
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
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);
  
  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    console.log('Time range changed');
  };

  const activityIcons = {
    "Placed new order": ShoppingCart,
    "Signed up for newsletter": User,
    "Renewed subscription": RefreshCcw,
    "Viewed product page": User,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Analytics Dashboard</h1>
        <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
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
                <div className="text-2xl font-bold">${data.stats.avgOrderValue}</div>
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
                    <span className="text-lg font-bold">${data.revenue.metrics.mrr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Lifetime Value</span>
                    <span className="text-lg font-bold">${data.revenue.metrics.ltv}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer Acquisition Cost</span>
                    <span className="text-lg font-bold">${data.revenue.metrics.cac}</span>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Total revenue and its breakdown over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="h-[300px]">
                  <AreaChart data={data.revenue.chartData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area dataKey="subscriptions" type="monotone" fill="var(--color-subscriptions)" stroke="var(--color-subscriptions)" stackId="a" />
                    <Area dataKey="oneTime" type="monotone" fill="var(--color-oneTime)" stroke="var(--color-oneTime)" stackId="a" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Breakdown of revenue by source with growth metrics.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Share</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.revenue.sources.map((item) => (
                      <TableRow key={item.source}>
                        <TableCell className="font-medium">{item.source}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.percentage}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.growth.startsWith('+') ? 'default' : 'destructive'}>
                            {item.growth}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Breakdown of customer types with growth.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ChartContainer config={customerSegmentationConfig} className="h-[200px] w-full">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={data.customers.segmentation} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} strokeWidth={2}>
                      {data.customers.segmentation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
                <CardDescription>Customer age distribution.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.customers.demographics.ageGroups.map((group) => (
                    <div key={group.range} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{group.range}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={group.percentage} className="w-16" />
                        <span className="text-sm text-muted-foreground">{group.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest customer actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ItemGroup>
                  {data.customers.activities.slice(0, 4).map((activity) => {
                    const IconComponent = activityIcons[activity.activity as keyof typeof activityIcons] || User;
                    return (
                      <Item key={activity.id} className="flex items-center gap-3">
                        <ItemMedia variant="icon">
                          <IconComponent className="size-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="text-sm">{activity.customer}</ItemTitle>
                          <ItemDescription className="text-xs">{activity.activity}</ItemDescription>
                        </ItemContent>
                        <div className="text-right">
                          <div className="text-xs font-medium">{activity.value}</div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      </Item>
                    );
                  })}
                </ItemGroup>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Customer locations and market penetration.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {data.customers.demographics.locations.map((location) => (
                  <div key={location.country} className="text-center">
                    <div className="text-2xl font-bold">{location.count}</div>
                    <div className="text-sm font-medium">{location.country}</div>
                    <div className="text-xs text-muted-foreground">{location.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Over Time</CardTitle>
                <CardDescription>Sales and units sold monthly.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={productPerformanceConfig} className="h-[250px]">
                  <LineChart data={data.products.performance} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                    <YAxis />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line dataKey="sales" type="monotone" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
                    <Line dataKey="units" type="monotone" stroke="var(--color-units)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with the highest sales.</CardDescription>
              </CardHeader>
              <CardContent>
                <ItemGroup>
                  {data.products.topProducts.map((product) => (
                    <Item key={product.id} className="flex items-center gap-4">
                      <ItemContent>
                        <ItemTitle>{product.name}</ItemTitle>
                        <ItemDescription>Sales: ${product.sales}</ItemDescription>
                        <Progress value={product.progress} className="mt-2" />
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Performance by category with margins.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.products.categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.count} products</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${category.sales.toLocaleString()}</div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{category.margin}% margin</Badge>
                          <Badge variant={category.growth.startsWith('+') ? 'default' : 'destructive'}>
                            {category.growth}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Stock levels and alerts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{data.products.inventory.lowStock}</div>
                    <div className="text-sm font-medium">Low Stock</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{data.products.inventory.outOfStock}</div>
                    <div className="text-sm font-medium">Out of Stock</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{data.products.inventory.totalProducts}</div>
                    <div className="text-sm font-medium">Total Products</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{data.products.inventory.avgStockLevel}%</div>
                    <div className="text-sm font-medium">Avg Stock Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Channels</CardTitle>
                <CardDescription>Performance by acquisition channel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.marketing.channels.map((channel) => (
                    <div key={channel.channel} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{channel.channel}</div>
                        <div className="text-sm text-muted-foreground">{channel.visitors.toLocaleString()} visitors</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{channel.conversions} conversions</div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">ROAS: {channel.roas}</Badge>
                          {channel.cost > 0 && (
                            <Badge variant="outline">${channel.cost}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Current marketing campaign performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.marketing.campaigns.map((campaign) => (
                    <div key={campaign.name} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{campaign.name}</div>
                        <Badge variant={campaign.status === 'Active' ? 'default' : campaign.status === 'Completed' ? 'secondary' : 'outline'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Budget</div>
                          <div className="font-medium">${campaign.budget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Spent</div>
                          <div className="font-medium">${campaign.spent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Conversions</div>
                          <div className="font-medium">{campaign.conversions}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">ROAS</div>
                          <div className="font-medium">{campaign.roas}</div>
                        </div>
                      </div>
                      {campaign.status === 'Active' && (
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Builder</CardTitle>
                <CardDescription>Define parameters for your custom report.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Field>
                  <FieldLabel>Report Name</FieldLabel>
                  <FieldContent>
                    <Input placeholder="e.g., Q4 Marketing Performance" value={reportName} onChange={(e) => setReportName(e.target.value)} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Report Type</FieldLabel>
                  <FieldContent>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Include Charts</FieldLabel>
                  <FieldContent>
                    <Switch checked={includeCharts} onCheckedChange={setIncludeCharts} />
                    <FieldDescription>Toggle to include visual charts in your report.</FieldDescription>
                  </FieldContent>
                </Field>

                <Button className="mt-4">Generate Report Preview</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Manage your previously created reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.reports.saved.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">Last run: {report.lastRun}</div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === "Active" ? "default" : report.status === "Scheduled" ? "secondary" : "outline"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}