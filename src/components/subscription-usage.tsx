"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/lib/tenant-context";
import { SUBSCRIPTION_LIMITS, getUsagePercentage } from "@/lib/subscription";
import { Package, Users, HardDrive, Zap } from "lucide-react";

interface UsageData {
  products: number;
  users: number;
  storage: number;
  apiCalls: number;
}

export function SubscriptionUsage({ usage }: { usage: UsageData }) {
  const { tenant } = useTenant();
  const tier = tenant?.tier || "FREE";
  const limits = SUBSCRIPTION_LIMITS[tier as keyof typeof SUBSCRIPTION_LIMITS];

  const usageItems = [
    {
      label: "Products",
      current: usage.products,
      limit: limits.products,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Team Members",
      current: usage.users,
      limit: limits.users,
      icon: Users,
      color: "text-green-600",
    },
    {
      label: "Storage (GB)",
      current: usage.storage,
      limit: limits.storage,
      icon: HardDrive,
      color: "text-purple-600",
    },
    {
      label: "API Calls",
      current: usage.apiCalls,
      limit: limits.apiCalls,
      icon: Zap,
      color: "text-orange-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Usage & Limits
          <Badge variant="secondary">{tier}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageItems.map((item) => {
          const Icon = item.icon;
          const percentage = getUsagePercentage(tier as any, item.label.toLowerCase().replace(" ", "") as any, item.current);
          const isUnlimited = item.limit === -1;

          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.current} / {isUnlimited ? "∞" : item.limit}
                </span>
              </div>
              {!isUnlimited && (
                <Progress
                  value={percentage}
                  className="h-2"
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}