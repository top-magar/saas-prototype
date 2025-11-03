'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  totalSales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  totalRevenue: {
    label: 'Revenue (NPR)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface ChartData {
  month: string;
  totalSales: number;
  totalRevenue: number;
}

export function OverviewChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="min-h-[300px] w-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
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
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="totalRevenue"
          type="natural"
          fill="var(--color-totalRevenue)"
          fillOpacity={0.4}
          stroke="var(--color-totalRevenue)"
          stackId="a"
        />
        <Area
          dataKey="totalSales"
          type="natural"
          fill="var(--color-totalSales)"
          fillOpacity={0.4}
          stroke="var(--color-totalSales)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}