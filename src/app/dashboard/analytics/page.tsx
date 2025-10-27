"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const overviewChartData = [
  { month: "Jan", totalSales: 4000, newCustomers: 240 },
  { month: "Feb", totalSales: 3000, newCustomers: 139 },
  { month: "Mar", totalSales: 2000, newCustomers: 980 },
  { month: "Apr", totalSales: 2780, newCustomers: 390 },
  { month: "May", totalSales: 1890, newCustomers: 480 },
  { month: "Jun", totalSales: 2390, newCustomers: 380 },
  { month: "Jul", totalSales: 3490, newCustomers: 430 },
];

const overviewChartConfig = {
  totalSales: {
    label: "Total Sales",
    color: "hsl(var(--chart-1))",
  },
  newCustomers: {
    label: "New Customers",
    color: "hsl(var(--chart-2))",
  },
};

const trendsChartData = [
  { category: "Electronics", sales: 1500, units: 120 },
  { category: "Clothing", sales: 1200, units: 150 },
  { category: "Books", sales: 800, units: 200 },
  { category: "Home Goods", sales: 1000, units: 90 },
];

const trendsChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  units: {
    label: "Units Sold",
    color: "hsl(var(--chart-3))",
  },
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics Overview</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
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
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-muted-foreground text-xs">
                  +20.1% from last month
                </p>
                <ChartContainer config={overviewChartConfig} className="mt-4 h-[150px]">
                  <LineChart
                    accessibilityLayer
                    data={overviewChartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />} 
                    />
                    <Line
                      dataKey="totalSales"
                      type="monotone"
                      stroke="var(--color-totalSales)"
                      strokeWidth={2}
                      dot={false}
                    />
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
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-muted-foreground text-xs">
                  +180.1% from last month
                </p>
                <ChartContainer config={overviewChartConfig} className="mt-4 h-[150px]">
                  <BarChart
                    accessibilityLayer
                    data={overviewChartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />} 
                    />
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
                <div className="text-2xl font-bold">4.8%</div>
                <p className="text-muted-foreground text-xs">
                  +5% from last month
                </p>
                <div className="mt-4">
                  <Progress value={75} aria-label="75% progress" />
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
                <BarChart accessibilityLayer data={trendsChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />} 
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                  <Bar dataKey="units" fill="var(--color-units)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline">View All Reports</Button>
      </div>
    </div>
  );
}