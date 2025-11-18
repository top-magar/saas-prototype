'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, DollarSign, Users } from "lucide-react";

interface EnhancedMarketingTabProps {
  data: {
    channels: Array<{ channel: string; visitors: number; conversions: number; cost: number; roas: string }>;
    campaigns: Array<{ name: string; status: string; budget: number; spent: number; conversions: number; roas: string }>;
  };
}

export function EnhancedMarketingTab({ data }: EnhancedMarketingTabProps) {
  const totalVisitors = data.channels.reduce((sum, channel) => sum + channel.visitors, 0);
  const totalConversions = data.channels.reduce((sum, channel) => sum + channel.conversions, 0);
  const totalCost = data.channels.reduce((sum, channel) => sum + channel.cost, 0);
  const conversionRate = ((totalConversions / totalVisitors) * 100).toFixed(1);

  return (
    <div className="grid gap-6">
      {/* Marketing Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total Visitors</div>
              <Badge variant="secondary" className="text-xs font-mono">+22%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{totalVisitors.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Website Traffic</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Conversions</div>
              <Badge variant="secondary" className="text-xs font-mono">+18%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{totalConversions.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Total Conversions</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Conversion Rate</div>
              <Badge variant="secondary" className="text-xs font-mono">+0.8%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{conversionRate}%</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Overall Rate</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Ad Spend</div>
              <Badge variant="destructive" className="text-xs font-mono">+15%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">${totalCost.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Total Cost</div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Channels */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
            <Target className="h-4 w-4" />
            MARKETING CHANNELS
          </CardTitle>
          <CardDescription>Performance by acquisition channel with ROAS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.channels.map((channel) => {
            const channelConversionRate = ((channel.conversions / channel.visitors) * 100).toFixed(1);
            
            return (
              <div key={channel.channel} className="space-y-3 p-4 border border-border/50 hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-mono font-medium">{channel.channel}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono">ROAS: {channel.roas}</Badge>
                    {channel.cost > 0 && (
                      <Badge variant="outline" className="text-xs font-mono">${channel.cost}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <div className="text-muted-foreground">Visitors</div>
                    <div className="font-bold">{channel.visitors.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversions</div>
                    <div className="font-bold">{channel.conversions}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conv. Rate</div>
                    <div className="font-bold">{channelConversionRate}%</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress value={parseFloat(channelConversionRate)} className="h-2" />
                  <div className="text-xs font-mono text-muted-foreground">
                    Performance: {parseFloat(channelConversionRate) > 5 ? 'Excellent' : parseFloat(channelConversionRate) > 3 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card className="bg-background border border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            CAMPAIGN PERFORMANCE
          </CardTitle>
          <CardDescription>Current marketing campaigns and their ROI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.campaigns.map((campaign) => {
            const spendPercentage = (campaign.spent / campaign.budget) * 100;
            const costPerConversion = campaign.conversions > 0 ? (campaign.spent / campaign.conversions).toFixed(0) : '0';
            
            return (
              <div key={campaign.name} className="space-y-3 p-4 border border-border/50 hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-mono font-medium">{campaign.name}</div>
                  <Badge 
                    variant={
                      campaign.status === 'Active' ? 'default' : 
                      campaign.status === 'Completed' ? 'secondary' : 
                      'outline'
                    } 
                    className="text-xs font-mono"
                  >
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-bold">${campaign.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Spent</div>
                    <div className="font-bold">${campaign.spent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Conversions</div>
                    <div className="font-bold">{campaign.conversions}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ROAS</div>
                    <div className="font-bold">{campaign.roas}</div>
                  </div>
                </div>
                
                {campaign.status === 'Active' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Budget Usage</span>
                      <span>{spendPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={spendPercentage} className="h-2" />
                    <div className="text-xs font-mono text-muted-foreground">
                      Cost per conversion: ${costPerConversion}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Marketing Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <div className="text-lg font-mono font-bold">85%</div>
            <div className="text-xs font-mono text-muted-foreground">Customer Acquisition</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">from organic channels</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <div className="text-lg font-mono font-bold">$85</div>
            <div className="text-xs font-mono text-muted-foreground">Avg CAC</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">customer acquisition cost</div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <div className="text-lg font-mono font-bold">4.2x</div>
            <div className="text-xs font-mono text-muted-foreground">Avg ROAS</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">return on ad spend</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}