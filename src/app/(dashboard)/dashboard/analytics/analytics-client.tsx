'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface AnalyticsData {
  overview: Array<{ month: string; totalSales: number; newCustomers: number }>;
  trends: Array<{ category: string; sales: number; units: number }>;
  stats: {
    totalSales: string;
    newCustomers: string;
    conversionRate: number;
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

const trendsChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  units: { label: "Units Sold", color: "hsl(var(--chart-3))" },
};

export default function AnalyticsClient({ data, timeRange }: AnalyticsClientProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  
  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    // TODO: Implement Server Action for time range change
    console.log('Time range changed to:', value);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Analytics Overview</h1>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>+20.1% from last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{data.stats.totalSales}</div>
                <ChartContainer config={overviewChartConfig} className="mt-4 h-[150px]">
                  <LineChart data={data.overview} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Line dataKey="totalSales" type="monotone" stroke="var(--color-totalSales)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
                <CardDescription>+180.1% from last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{data.stats.newCustomers}</div>
                <ChartContainer config={overviewChartConfig} className="mt-4 h-[150px]">
                  <BarChart data={data.overview} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="newCustomers" fill="var(--color-newCustomers)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>+5% from last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{data.stats.conversionRate}%</div>
                <div className="mt-4">
                  <Progress value={data.stats.conversionRate * 15} />
                  <Badge variant="secondary" className="mt-2">Target: 6%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Category Trends</CardTitle>
              <CardDescription>Sales and units sold by category.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trendsChartConfig} className="h-[300px]">
                <BarChart data={data.trends}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                  <Bar dataKey="units" fill="var(--color-units)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}