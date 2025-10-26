'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { totalProfitData } from '@/lib/mock-data';

const chartConfig = {
  totalSales: { label: 'Total Sales', color: 'hsl(var(--chart-2))' },
  totalRevenue: { label: 'Total Revenue', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Profit Overview</CardTitle>
        <CardDescription>An overview of your monthly profit.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={totalProfitData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="totalSales" fill="var(--color-totalSales)" radius={4} />
            <Bar dataKey="totalRevenue" fill="var(--color-totalRevenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}