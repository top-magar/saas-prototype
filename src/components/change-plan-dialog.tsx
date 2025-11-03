"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, ArrowUpRight, Phone } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const plans = [
  { name: "Free", price: "0", tierId: "FREE", tier: 0, description: "Perfect for getting started", features: ["10 products", "5GB storage", "Basic support"] },
  { name: "Starter", price: "2,999", tierId: "STARTER", tier: 1, description: "Most popular for small teams", features: ["100 products", "50GB storage", "Priority support"] },
  { name: "Pro", price: "7,999", tierId: "PRO", tier: 2, description: "Advanced features for growth", features: ["Unlimited products", "500GB storage", "24/7 support"] },
  { name: "Enterprise", price: "Custom", tierId: "ENTERPRISE", tier: 3, description: "Tailored for large organizations", features: ["Everything in Pro", "Custom integrations", "Dedicated manager"] },
];

export function ChangePlanDialog({ trigger, currentPlan }: { trigger: React.ReactNode, currentPlan: string }) {
  const router = useRouter();
  const currentTier = plans.find(p => p.tierId === currentPlan)?.tier ?? 0;

  const handleChange = (plan: typeof plans[0]) => {
    if (plan.tierId === currentPlan) return;
    
    if (plan.tierId === "ENTERPRISE") {
      toast.info("Contact sales for Enterprise plan.");
      return;
    }
    
    router.push(`/payment-processing?plan=${plan.tierId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Choose your plan</DialogTitle>
          <p className="text-muted-foreground mt-2">Select the plan that best fits your needs.</p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {plans.map((plan) => {
            const isCurrent = plan.tierId === currentPlan;
            const isUpgrade = plan.tier > currentTier;
            
            return (
              <div key={plan.tierId} className={cn(
                "flex items-center justify-between p-6 border rounded-xl transition-all hover:shadow-md",
                isCurrent && "bg-blue-50 border-blue-200 dark:bg-blue-950/20",
                isUpgrade && "border-green-200 bg-green-50/50 dark:bg-green-950/10"
              )}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    {isCurrent && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        <Check className="w-3 h-3 mr-1" />Current
                      </Badge>
                    )}
                    {plan.name === "Starter" && !isCurrent && (
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {plan.price === "Custom" ? "Custom" : `NPR ${plan.price}`}
                    </div>
                    {plan.price !== "Custom" && (
                      <div className="text-sm text-muted-foreground">per month</div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleChange(plan)}
                    disabled={isCurrent}
                    variant={isCurrent ? "secondary" : isUpgrade ? "default" : "outline"}
                    className={cn(
                      "min-w-[120px]",
                      isUpgrade && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    {isCurrent ? (
                      "Current plan"
                    ) : plan.tierId === "ENTERPRISE" ? (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Contact sales
                      </>
                    ) : (
                      <>
                        {isUpgrade ? "Upgrade" : "Switch"}
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}