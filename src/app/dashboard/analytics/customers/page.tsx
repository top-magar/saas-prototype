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
import { Item, ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Pie, PieChart, Cell } from "recharts";
import { UserIcon, ShoppingCartIcon, RefreshCcwIcon } from "lucide-react";

const customerSegmentationData = [
  { name: "New Customers", value: 400, color: "hsl(var(--chart-1))" },
  { name: "Returning Customers", value: 300, color: "hsl(var(--chart-2))" },
  { name: "High-Value Customers", value: 200, color: "hsl(var(--chart-3))" },
  { name: "Churned Customers", value: 100, color: "hsl(var(--chart-4))" },
];

const customerSegmentationConfig = {
  newCustomers: {
    label: "New Customers",
    color: "hsl(var(--chart-1))",
  },
  returningCustomers: {
    label: "Returning Customers",
    color: "hsl(var(--chart-2))",
  },
  highValueCustomers: {
    label: "High-Value Customers",
    color: "hsl(var(--chart-3))",
  },
  churnedCustomers: {
    label: "Churned Customers",
    color: "hsl(var(--chart-4))",
  },
};

const recentActivities = [
  { id: 1, customer: "Alice Smith", activity: "Placed new order", time: "2 hours ago", icon: ShoppingCartIcon },
  { id: 2, customer: "Bob Johnson", activity: "Signed up for newsletter", time: "1 day ago", icon: UserIcon },
  { id: 3, customer: "Charlie Brown", activity: "Renewed subscription", time: "3 days ago", icon: RefreshCcwIcon },
  { id: 4, customer: "Diana Prince", activity: "Viewed product page", time: "5 days ago", icon: UserIcon },
];

export default function CustomerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Customer Analytics</h1>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
            <CardDescription>Breakdown of customer types.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={customerSegmentationConfig} className="h-[250px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="name" />} 
                />
                <Pie
                  data={customerSegmentationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {customerSegmentationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="flex-wrap justify-center gap-2 pt-2"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Customer Activity</CardTitle>
            <CardDescription>Latest actions by your customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {recentActivities.map((activity) => (
                <Item key={activity.id} className="flex items-center gap-4">
                  <ItemMedia variant="icon">
                    <activity.icon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{activity.customer}</ItemTitle>
                    <ItemDescription>{activity.activity}</ItemDescription>
                  </ItemContent>
                  <Badge variant="secondary">{activity.time}</Badge>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">View All Customers</Button>
      </div>
    </div>
  );
}