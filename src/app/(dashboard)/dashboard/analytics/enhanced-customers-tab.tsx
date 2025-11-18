'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Pie, PieChart, Cell } from "recharts";
import { User, TrendingUp, Globe } from "lucide-react";

interface EnhancedCustomersTabProps {
  data: {
    segmentation: Array<{ name: string; value: number; color: string; growth: string }>;
    activities: Array<{ id: number; customer: string; activity: string; time: string; value: string }>;
    demographics: {
      ageGroups: Array<{ range: string; count: number; percentage: number }>;
      locations: Array<{ country: string; count: number; percentage: number }>;
    };
  };
}

export function EnhancedCustomersTab({ data }: EnhancedCustomersTabProps) {
  const totalCustomers = data.segmentation.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <div className="grid gap-6">
      {/* Customer Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total Customers</div>
              <Badge variant="secondary" className="text-xs font-mono">+15%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{totalCustomers.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Active Users</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Churn Rate</div>
              <Badge variant="destructive" className="text-xs font-mono">2.3%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">2.3%</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Monthly Churn</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Avg CLV</div>
              <Badge variant="secondary" className="text-xs font-mono">+8%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">$1,250</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Customer Lifetime</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">NPS Score</div>
              <Badge variant="secondary" className="text-xs font-mono">+12</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">67</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Net Promoter</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segmentation and Demographics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">CUSTOMER SEGMENTS</CardTitle>
            <CardDescription>Distribution by customer type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ChartContainer config={{}} className="h-[200px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={data.segmentation} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} strokeWidth={2}>
                    {data.segmentation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              
              <div className="space-y-2">
                {data.segmentation.map((segment) => (
                  <div key={segment.name} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border" style={{ backgroundColor: segment.color }} />
                      <span>{segment.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{segment.value}</span>
                      <Badge variant={segment.growth.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                        {segment.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
              <User className="h-4 w-4" />
              AGE DEMOGRAPHICS
            </CardTitle>
            <CardDescription>Customer age distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.demographics.ageGroups.map((group) => (
              <div key={group.range} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>{group.range}</span>
                  <span className="font-bold">{group.count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={group.percentage} className="flex-1 h-2" />
                  <span className="text-xs font-mono text-muted-foreground w-8">{group.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
              <Globe className="h-4 w-4" />
              GEOGRAPHIC DISTRIBUTION
            </CardTitle>
            <CardDescription>Customer locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.demographics.locations.map((location) => (
              <div key={location.country} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>{location.country}</span>
                  <span className="font-bold">{location.count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={location.percentage} className="flex-1 h-2" />
                  <span className="text-xs font-mono text-muted-foreground w-8">{location.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Customer Activities */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            RECENT ACTIVITIES
          </CardTitle>
          <CardDescription>Latest customer interactions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border border-border/50 hover:border-border transition-all">
                <div className="space-y-1">
                  <div className="text-sm font-mono font-medium">{activity.customer}</div>
                  <div className="text-xs font-mono text-muted-foreground">{activity.activity}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-mono font-bold">{activity.value}</div>
                  <div className="text-xs font-mono text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}