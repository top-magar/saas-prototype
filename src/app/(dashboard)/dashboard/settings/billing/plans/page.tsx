"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Star, Zap } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTenant } from "@/lib/tenant-context";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: ["10 products", "5GB storage", "Basic support"],
    tierId: "FREE",
    tier: 0,
  },
  {
    name: "Starter",
    price: "2,999",
    description: "Most popular for small teams",
    features: ["100 products", "50GB storage", "Priority support"],
    tierId: "STARTER",
    tier: 1,
    popular: true,
  },
  {
    name: "Pro",
    price: "7,999",
    description: "Advanced features for growth",
    features: ["Unlimited products", "500GB storage", "24/7 support"],
    tierId: "PRO",
    tier: 2,
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for large organizations",
    features: ["Everything in Pro", "Dedicated manager", "Custom SLA"],
    tierId: "ENTERPRISE",
    tier: 3,
  },
];

export function PlansDialog({ trigger }: { trigger: React.ReactNode }) {
  const { tenant } = useTenant();
  const router = useRouter();
  const currentPlan = tenant?.tier || "FREE";
  const currentTier = plans.find(p => p.tierId === currentPlan)?.tier ?? 0;

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.tierId === currentPlan) return;
    
    if (plan.tierId === "ENTERPRISE") {
      return;
    }
    
    router.push(`/payment-processing?plan=${plan.tierId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[85vh] p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold">Choose Your Plan</DialogTitle>
        </DialogHeader>
        
        <div className="h-full overflow-y-auto">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Plan: {plans.find(p => p.tierId === currentPlan)?.name}</h3>
                  <p className="text-muted-foreground">
                    {plans.find(p => p.tierId === currentPlan)?.description}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Check className="w-4 h-4 mr-2" />
                  Active
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => {
                const isCurrent = plan.tierId === currentPlan;
                const isUpgrade = plan.tier > currentTier;
                const isDowngrade = plan.tier < currentTier;

                return (
                  <Card key={plan.tierId} className={cn(
                    "relative transition-all duration-200 flex flex-col h-full",
                    isCurrent && "ring-2 ring-blue-500",
                    plan.recommended && !isCurrent && "ring-2 ring-green-500",
                    plan.popular && !isCurrent && "border-orange-300"
                  )}>
                    {isCurrent && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                        <Check className="w-3 h-3 mr-1" />
                        Current
                      </Badge>
                    )}
                    {plan.popular && !isCurrent && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {plan.recommended && !isCurrent && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">
                        <Zap className="w-3 h-3 mr-1" />
                        Best
                      </Badge>
                    )}

                    <CardHeader className="text-center pb-4">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-3">
                        <span className="text-3xl font-bold">
                          {plan.price === "Custom" ? "Custom" : `NPR ${plan.price}`}
                        </span>
                        {plan.price !== "Custom" && (
                          <span className="text-sm text-muted-foreground ml-1">/month</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </CardHeader>

                    <CardContent className="pt-0 flex-grow">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={cn(
                          "w-full mt-auto",
                          isUpgrade && "bg-green-600 hover:bg-green-700",
                          isDowngrade && "bg-orange-600 hover:bg-orange-700"
                        )}
                        onClick={() => handleSelectPlan(plan)}
                        disabled={isCurrent}
                        variant={isCurrent ? "secondary" : "default"}
                      >
                        {isCurrent ? (
                          "Current Plan"
                        ) : plan.tierId === "ENTERPRISE" ? (
                          "Contact Sales"
                        ) : (
                          <>
                            {isUpgrade ? "Upgrade" : isDowngrade ? "Downgrade" : "Select"}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PlansPage() {
  return (
    <div className="p-6">
      <PlansDialog trigger={<Button>Open Plans Dialog</Button>} />
    </div>
  );
}