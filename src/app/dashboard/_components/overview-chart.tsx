'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  totalSales: { label: 'Total Sales', color: 'hsl(var(--chart-2))' },
  totalRevenue: { label: 'Total Revenue', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

interface ChartData {
  month: string;
  totalSales: number;
  totalRevenue: number;
}

export function OverviewChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Profit Overview</CardTitle>
        <CardDescription>An overview of your monthly profit.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
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