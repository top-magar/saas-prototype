"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTenant } from "@/lib/tenant-context";
import { 
  CreditCard, 
  Download, 
  TrendingUp, 
  Users, 
  HardDrive, 
  Zap,
  Check,
  Star,
  ArrowUpRight,
  Settings,
  AlertCircle,
  X
} from "lucide-react";
import { useRouter } from 'next/navigation';

const plans = [
  { name: "Free", price: "0", tierId: "FREE", tier: 0, features: ["10 products", "5GB storage", "Basic support"] },
  { name: "Starter", price: "2,999", tierId: "STARTER", tier: 1, popular: true, features: ["100 products", "50GB storage", "Priority support"] },
  { name: "Pro", price: "7,999", tierId: "PRO", tier: 2, recommended: true, features: ["Unlimited products", "500GB storage", "24/7 support"] },
  { name: "Enterprise", price: "Custom", tierId: "ENTERPRISE", tier: 3, features: ["Everything in Pro", "Dedicated manager", "Custom SLA"] },
];

function PlanSidebar({ currentPlan, onPlanChange }: { currentPlan: string, onPlanChange: (planId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>Change Plan</Button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[400px] bg-background border-l z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Choose Your Plan</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                {plans.map((plan) => {
                  const isCurrent = plan.tierId === currentPlan;
                  return (
                    <div key={plan.tierId} className={cn(
                      "p-4 border rounded-lg",
                      isCurrent && "bg-blue-50 border-blue-200"
                    )}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{plan.name}</h3>
                            {plan.popular && !isCurrent && (
                              <Badge className="bg-orange-500 text-xs">
                                <Star className="w-3 h-3 mr-1" />Popular
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge className="bg-blue-600 text-xs">
                                <Check className="w-3 h-3 mr-1" />Current
                              </Badge>
                            )}
                          </div>
                          <div className="text-xl font-bold">
                            {plan.price === "Custom" ? "Custom" : `NPR ${plan.price}`}
                            {plan.price !== "Custom" && <span className="text-sm text-muted-foreground ml-1">/month</span>}
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            onPlanChange(plan.tierId);
                            setIsOpen(false);
                          }}
                          disabled={isCurrent}
                          variant={isCurrent ? "secondary" : "default"}
                        >
                          {isCurrent ? "Current" : plan.tierId === "ENTERPRISE" ? "Contact" : "Select"}
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const invoices = [
  { id: "INV-001", date: "2024-01-01", amount: 2999, status: "Paid", plan: "Starter" },
  { id: "INV-002", date: "2023-12-01", amount: 2999, status: "Paid", plan: "Starter" },
  { id: "INV-003", date: "2023-11-01", amount: 2999, status: "Paid", plan: "Starter" },
];

const usageData = {
  products: { current: 45, limit: 100, percentage: 45 },
  storage: { current: 12, limit: 50, percentage: 24 },
  users: { current: 3, limit: 5, percentage: 60 },
  apiCalls: { current: 2500, limit: 10000, percentage: 25 },
};

export default function ProfessionalBillingPage() {
  const { tenant } = useTenant();
  const router = useRouter();
  const currentPlan = tenant?.tier || "FREE";
  const currentPlanData = plans.find(p => p.tierId === currentPlan);

  const handlePlanChange = (planId: string) => {
    if (planId === "ENTERPRISE") return;
    router.push(`/payment-processing?plan=${planId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">Manage your subscription, usage, and billing history</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Billing Settings
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Current Plan
                      <Badge className="bg-blue-100 text-blue-700">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </CardTitle>
                    <CardDescription>Your current subscription details</CardDescription>
                  </div>
                  <PlanSidebar currentPlan={currentPlan} onPlanChange={handlePlanChange} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{currentPlanData?.name} Plan</h3>
                      <p className="text-muted-foreground">
                        {currentPlanData?.price === "Custom" ? "Custom pricing" : `NPR ${currentPlanData?.price}/month`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Next billing</p>
                      <p className="font-medium">February 1, 2024</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Billing Cycle</p>
                      <p className="text-sm text-muted-foreground">Monthly</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">eSewa (****1234)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount Due</span>
                    <span className="font-bold">NPR 2,999</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <span className="text-sm">Feb 1, 2024</span>
                  </div>
                  <Button className="w-full" size="sm">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Usage Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Storage at 80%</p>
                      <p className="text-xs text-muted-foreground">Consider upgrading to avoid limits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.tierId === currentPlan;
              return (
                <Card key={plan.tierId} className={cn(
                  "relative transition-all hover:shadow-lg",
                  isCurrent && "ring-2 ring-blue-500",
                  plan.recommended && !isCurrent && "ring-2 ring-green-500 scale-105"
                )}>
                  {isCurrent && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                      <Check className="w-3 h-3 mr-1" />Current
                    </Badge>
                  )}
                  {plan.popular && !isCurrent && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">
                      <Star className="w-3 h-3 mr-1" />Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price === "Custom" ? "Custom" : `NPR ${plan.price}`}
                    </div>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      onClick={() => handlePlanChange(plan.tierId)}
                      disabled={isCurrent}
                      variant={isCurrent ? "secondary" : "default"}
                    >
                      {isCurrent ? "Current Plan" : plan.tierId === "ENTERPRISE" ? "Contact Sales" : "Upgrade"}
                      {!isCurrent && plan.tierId !== "ENTERPRISE" && <ArrowUpRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(usageData).map(([key, data]) => {
              const icons = { products: TrendingUp, storage: HardDrive, users: Users, apiCalls: Zap };
              const Icon = icons[key as keyof typeof icons];
              return (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base capitalize">
                      <Icon className="w-4 h-4" />
                      {key === "apiCalls" ? "API Calls" : key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>{data.current.toLocaleString()} used</span>
                        <span>{data.limit.toLocaleString()} limit</span>
                      </div>
                      <Progress value={data.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {data.percentage}% of your {key} limit used
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Download invoices and view payment history</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.plan}</TableCell>
                      <TableCell>NPR {invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}