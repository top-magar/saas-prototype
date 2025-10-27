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
import { Item, ItemGroup, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PackageIcon } from "lucide-react";

const productPerformanceData = [
  { month: "Jan", sales: 1200, units: 80 },
  { month: "Feb", sales: 1500, units: 100 },
  { month: "Mar", sales: 1300, units: 90 },
  { month: "Apr", sales: 1700, units: 110 },
  { month: "May", sales: 1600, units: 105 },
  { month: "Jun", sales: 1900, units: 130 },
];

const productPerformanceConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  units: {
    label: "Units Sold",
    color: "hsl(var(--chart-2))",
  },
};

const topProducts = [
  { id: 1, name: "Premium Widget", sales: 2500, progress: 80 },
  { id: 2, name: "Deluxe Gadget", sales: 1800, progress: 60 },
  { id: 3, name: "Basic Tool", sales: 1500, progress: 50 },
  { id: 4, name: "Advanced Kit", sales: 1000, progress: 30 },
];

const productCategories = [
  { id: 1, name: "Electronics", sales: 5000, count: 120 },
  { id: 2, name: "Home & Garden", sales: 3000, count: 80 },
  { id: 3, name: "Books & Media", sales: 2000, count: 150 },
];

export default function ProductAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Product Analytics</h1>
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

      <Tabs defaultValue="top-products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="top-products">Top Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="top-products" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Over Time</CardTitle>
                <CardDescription>Sales and units sold monthly.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={productPerformanceConfig} className="h-[250px]">
                  <LineChart
                    accessibilityLayer
                    data={productPerformanceData}
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
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />} 
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      dataKey="sales"
                      type="monotone"
                      stroke="var(--color-sales)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey="units"
                      type="monotone"
                      stroke="var(--color-units)"
                      strokeWidth={2}
                      dot={false}
                    />
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
                  {topProducts.map((product) => (
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
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories Overview</CardTitle>
              <CardDescription>Sales and product count by category.</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemGroup>
                {productCategories.map((category) => (
                  <Item key={category.id} className="flex items-center gap-4">
                    <ItemContent>
                      <ItemTitle>{category.name}</ItemTitle>
                      <ItemDescription>Sales: ${category.sales} | Products: {category.count}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline">Manage Products</Button>
      </div>
    </div>
  );
}