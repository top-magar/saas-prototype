'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface EnhancedRevenueTabProps {
  data: {
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
}

const revenueChartConfig = {
  total: { label: "Total Revenue", color: "hsl(var(--chart-1))" },
  subscriptions: { label: "Subscriptions", color: "hsl(var(--chart-2))" },
  oneTime: { label: "One-time Sales", color: "hsl(var(--chart-3))" },
  upgrades: { label: "Upgrades", color: "hsl(var(--chart-4))" },
};

export function EnhancedRevenueTab({ data }: EnhancedRevenueTabProps) {
  return (
    <div className="grid gap-6">
      {/* Revenue Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">MRR</div>
              <Badge variant="secondary" className="text-xs font-mono">+12%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">${data.metrics.mrr.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Monthly Recurring</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">ARR</div>
              <Badge variant="secondary" className="text-xs font-mono">+15%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">${data.metrics.arr.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Annual Recurring</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">LTV:CAC</div>
              <Badge variant="secondary" className="text-xs font-mono">{(data.metrics.ltv / data.metrics.cac).toFixed(1)}:1</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">${data.metrics.ltv}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Lifetime Value</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Gross Margin</div>
              <Badge variant="secondary" className="text-xs font-mono">+2.1%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{data.metrics.grossMargin}%</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Profit Margin</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend and Sources */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">REVENUE BREAKDOWN</CardTitle>
            <CardDescription>Monthly revenue composition and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[300px]">
              <AreaChart data={data.chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} className="text-xs font-mono" />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} className="text-xs font-mono" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area dataKey="subscriptions" type="monotone" fill="var(--color-subscriptions)" stroke="var(--color-subscriptions)" stackId="a" fillOpacity={0.8} />
                <Area dataKey="oneTime" type="monotone" fill="var(--color-oneTime)" stroke="var(--color-oneTime)" stackId="a" fillOpacity={0.6} />
                <Area dataKey="upgrades" type="monotone" fill="hsl(var(--chart-4))" stroke="hsl(var(--chart-4))" stackId="a" fillOpacity={0.4} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">REVENUE SOURCES</CardTitle>
            <CardDescription>Performance by revenue stream</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.sources.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-mono">{source.source}</div>
                  <Badge variant={source.growth.startsWith('+') ? 'default' : 'destructive'} className="text-xs font-mono">
                    {source.growth}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold">{source.amount}</span>
                  <span className="text-muted-foreground">{source.percentage}</span>
                </div>
                {source.trend && (
                  <div className="flex items-center gap-1 h-4">
                    {source.trend.map((point, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-muted transition-all duration-300 hover:bg-primary/20"
                        style={{ height: `${Math.max(2, (point / Math.max(...source.trend!)) * 16)}px` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecasting */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">REVENUE FORECASTING</CardTitle>
          <CardDescription>Predictive analytics and confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">NEXT MONTH</div>
              <div className="text-xl font-mono font-bold">${data.forecasting.nextMonth.predicted.toLocaleString()}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Confidence</span>
                  <span>{data.forecasting.nextMonth.confidence}%</span>
                </div>
                <Progress value={data.forecasting.nextMonth.confidence} className="h-1" />
                <div className="text-xs font-mono text-muted-foreground">
                  Range: ${data.forecasting.nextMonth.range[0].toLocaleString()} - ${data.forecasting.nextMonth.range[1].toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">NEXT QUARTER</div>
              <div className="text-xl font-mono font-bold">${data.forecasting.nextQuarter.predicted.toLocaleString()}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Confidence</span>
                  <span>{data.forecasting.nextQuarter.confidence}%</span>
                </div>
                <Progress value={data.forecasting.nextQuarter.confidence} className="h-1" />
                <div className="text-xs font-mono text-muted-foreground">
                  Range: ${data.forecasting.nextQuarter.range[0].toLocaleString()} - ${data.forecasting.nextQuarter.range[1].toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">YEAR END</div>
              <div className="text-xl font-mono font-bold">${data.forecasting.yearEnd.predicted.toLocaleString()}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>Confidence</span>
                  <span>{data.forecasting.yearEnd.confidence}%</span>
                </div>
                <Progress value={data.forecasting.yearEnd.confidence} className="h-1" />
                <div className="text-xs font-mono text-muted-foreground">
                  Range: ${data.forecasting.yearEnd.range[0].toLocaleString()} - ${data.forecasting.yearEnd.range[1].toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Analysis */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">COHORT RETENTION</CardTitle>
          <CardDescription>Customer retention by acquisition month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-xs font-mono text-muted-foreground">
              <div>COHORT</div>
              <div>M0</div>
              <div>M1</div>
              <div>M2</div>
              <div>M3</div>
              <div>M4</div>
              <div>M5</div>
            </div>
            {data.cohorts.map((cohort) => (
              <div key={cohort.month} className="grid grid-cols-7 gap-2 text-xs font-mono">
                <div className="font-medium">{cohort.month}</div>
                {cohort.retention.map((rate, index) => (
                  <div
                    key={index}
                    className={`text-center p-1 border ${
                      rate >= 90 ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400' :
                      rate >= 80 ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-400' :
                      rate >= 70 ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/20 dark:border-orange-800 dark:text-orange-400' :
                      'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400'
                    }`}
                  >
                    {rate}%
                  </div>
                ))}
                {Array.from({ length: 6 - cohort.retention.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="text-center p-1 border border-muted bg-muted/20 text-muted-foreground">-</div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}