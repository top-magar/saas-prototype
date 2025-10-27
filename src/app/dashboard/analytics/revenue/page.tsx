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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const revenueChartData = [
  { month: "Jan", total: 25000, subscriptions: 15000, oneTime: 10000 },
  { month: "Feb", total: 28000, subscriptions: 17000, oneTime: 11000 },
  { month: "Mar", total: 27000, subscriptions: 16000, oneTime: 11000 },
  { month: "Apr", total: 30000, subscriptions: 18000, oneTime: 12000 },
  { month: "May", total: 32000, subscriptions: 20000, oneTime: 12000 },
  { month: "Jun", total: 35000, subscriptions: 22000, oneTime: 13000 },
];

const revenueChartConfig = {
  total: {
    label: "Total Revenue",
    color: "hsl(var(--chart-1))",
  },
  subscriptions: {
    label: "Subscriptions",
    color: "hsl(var(--chart-2))",
  },
  oneTime: {
    label: "One-time Sales",
    color: "hsl(var(--chart-3))",
  },
};

const revenueSources = [
  { source: "Subscriptions", amount: "$22,000", percentage: "62.8%" },
  { source: "One-time Purchases", amount: "$13,000", percentage: "37.2%" },
  { source: "Consulting", amount: "$5,000", percentage: "N/A" },
];

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Revenue Analytics</h1>
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
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Total revenue and its breakdown over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[300px]">
              <AreaChart
                accessibilityLayer
                data={revenueChartData}
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
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />} 
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="subscriptions"
                  type="monotone"
                  fill="var(--color-subscriptions)"
                  stroke="var(--color-subscriptions)"
                  stackId="a"
                />
                <Area
                  dataKey="oneTime"
                  type="monotone"
                  fill="var(--color-oneTime)"
                  stroke="var(--color-oneTime)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Breakdown of revenue by source.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueSources.map((item) => (
                  <TableRow key={item.source}>
                    <TableCell>{item.source}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.percentage}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">Export Revenue Data</Button>
      </div>
    </div>
  );
}