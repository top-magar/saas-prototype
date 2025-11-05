"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Star, Zap, ArrowUp, ArrowDown, Phone } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useTenant } from "@/lib/tenant-context";

const pricingTiers = [
  {
    name: "Free",
    price: "NPR 0",
    frequency: "/month",
    description: "Perfect for getting started with basic features.",
    features: ["Up to 10 products", "Basic dashboard", "Email support", "5GB storage"],
    tierId: "FREE",
    tier: 0,
  },
  {
    name: "Starter",
    price: "NPR 2,999",
    frequency: "/month",
    description: "Ideal for small businesses and startups.",
    features: [
      "Up to 100 products",
      "Advanced analytics",
      "Inventory management",
      "Priority email support",
      "50GB storage",
      "Basic automation",
    ],
    tierId: "STARTER",
    tier: 1,
  },
  {
    name: "Pro",
    price: "NPR 7,999",
    frequency: "/month",
    description: "Best for growing businesses that need advanced features.",
    features: [
      "Unlimited products",
      "Advanced analytics & reports",
      "Multi-location support",
      "Team collaboration (10 users)",
      "API access & integrations",
      "24/7 chat support",
      "500GB storage",
      "Advanced automation",
    ],
    highlight: true,
    tierId: "PRO",
    popular: true,
    tier: 2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    frequency: "",
    description: "Tailored solutions for large organizations.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment",
      "Custom SLA",
      "Advanced security",
      "Unlimited storage",
      "White-label options",
    ],
    tierId: "ENTERPRISE",
    tier: 3,
  },
];

export default function BillingPricingPage() {
  const { tenant } = useTenant(    
  );
  const router = useRouter(    
  );
  const currentTier = pricingTiers.find(p => p.tierId === tenant?.tier)?.tier ?? 0;

  const getButtonConfig = (tier: typeof pricingTiers[0]) => {
    if (tier.tierId === tenant?.tier) {
      return { text: "Current Plan", variant: "secondary" as const, disabled: true, icon: Check };
    }
    if (tier.tierId === "ENTERPRISE") {
      return { text: "Contact Sales", variant: "outline" as const, disabled: false, icon: Phone };
    }
    if (tier.tier > currentTier) {
      return { text: "Upgrade", variant: "default" as const, disabled: false, icon: ArrowUp };
    }
    return { text: "Downgrade", variant: "destructive" as const, disabled: false, icon: ArrowDown };
  };

  const handlePlanChange = async (tier: typeof pricingTiers[0]) => {
    if (tier.tierId === tenant?.tier) return;
    
    if (tier.tierId === "ENTERPRISE") {
      toast.info("Please contact sales to learn more about our Enterprise plan."    
  );
      return;
    }

    if (tier.tier < currentTier) {
      toast.warning(`Downgrading to ${tier.name} will reduce your features. Continue?`    
  );
    }

    router.push(`/payment-processing?plan=${tier.tierId}`    
  );
  };

  return (
    
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground">Choose the plan that best fits your business needs.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {pricingTiers.map((tier) => {
          const buttonConfig = getButtonConfig(tier    
  );
          const Icon = buttonConfig.icon;
          
          return (
    
            <Card
              key={tier.name}
              className={cn(
                "flex flex-col relative",
                tier.tierId === tenant?.tier && "ring-2 ring-primary",
                tier.highlight && tier.tierId !== tenant?.tier && "border-primary scale-105",
                tier.tier > currentTier && "border-green-200",
                tier.tier < currentTier && "border-orange-200"
              )}
            >
              <CardHeader className="relative pb-4">
                {tier.tierId === tenant?.tier && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">
                    <Check className="w-3 h-3 mr-1" />
                    Current
                  </Badge>
                )}
                {tier.popular && tier.tierId !== tenant?.tier && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                
                <CardTitle className="flex items-center gap-2">
                  {tier.name}
                  {tier.tierId === "PRO" && <Zap className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{tier.price}</span>
                    {tier.frequency && (
                      <span className="text-muted-foreground">{tier.frequency}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handlePlanChange(tier)}
                  disabled={buttonConfig.disabled}
                  variant={buttonConfig.variant}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {buttonConfig.text}
                </Button>
              </CardFooter>
            </Card>
              
  );
        })}
      </div>
    </div>
      
  );
}