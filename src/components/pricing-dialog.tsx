"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Banknote, Check, CreditCard, DollarSign, Star, Zap, Shield } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast } from "sonner";
import { TenantTier } from "@/lib/types";

const pricingTiers = [
  {
    name: "Free",
    price: "NPR 0",
    frequency: "/month",
    description: "Perfect for getting started with basic features.",
    features: ["Up to 10 products", "Basic dashboard", "Email support", "5GB storage"],
    buttonText: "Current Plan",
    tierId: "FREE",
    savings: null,
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
    buttonText: "Start Free Trial",
    tierId: "STARTER",
    savings: "Save 20% annually",
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
    buttonText: "Start Free Trial",
    highlight: true,
    tierId: "PRO",
    savings: "Save 25% annually",
    popular: true,
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
    buttonText: "Contact Sales",
    tierId: "ENTERPRISE",
    savings: null,
  },
];

type PricingDialogProps = {
  trigger: React.ReactNode;
  currentPlan?: TenantTier; // Use enum values
  showPaymentMethods?: boolean;
};

export function PricingDialog({ trigger, currentPlan = TenantTier.FREE, showPaymentMethods = false }: PricingDialogProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("esewa");
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleAction = async (tier: (typeof pricingTiers)[0]) => {
    if (tier.tierId === "FREE" || tier.tierId === currentPlan) return;
    
    if (tier.tierId === "ENTERPRISE") {
      toast.info("Please contact sales to learn more about our Enterprise plan.");
      return;
    }

    if (!isSignedIn && !showPaymentMethods) { // If not signed in and payment methods are not shown (i.e., landing page context)
      router.push("/sign-up");
      return;
    }

    // Initiate payment
    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.tierId, paymentMethod: selectedPaymentMethod }),
      });

      const data = await response.json();

      if (response.ok && data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        toast.error(data.error || "Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Error during payment initiation:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl p-0">
        <div className="p-8">
          <DialogHeader className="text-center mb-8">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Choose Your Plan
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Select the perfect plan to power your business growth.
            </DialogDescription>
          </DialogHeader>

          {showPaymentMethods && isSignedIn && (
            <div className="mb-8">
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="text-base font-semibold">Secure Payment Methods</h3>
                </div>
                <RadioGroup
                  defaultValue="esewa"
                  onValueChange={setSelectedPaymentMethod}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <PaymentMethodRadio 
                    id="esewa" 
                    value="esewa" 
                    icon={DollarSign} 
                    label="eSewa" 
                    description="Digital wallet"
                  />
                  <PaymentMethodRadio 
                    id="khalti" 
                    value="khalti" 
                    icon={CreditCard} 
                    label="Khalti" 
                    description="Mobile payment"
                  />
                  <PaymentMethodRadio 
                    id="fonepay" 
                    value="fonepay" 
                    icon={Banknote} 
                    label="FonePay" 
                    description="Bank transfer"
                  />
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  All payments are secured with 256-bit SSL encryption
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                isCurrent={tier.tierId === currentPlan}
                onSelect={() => handleAction(tier)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Helper Components for Cleaner Code ---

const PaymentMethodRadio = ({ 
  id, 
  value, 
  icon: Icon, 
  label, 
  description 
}: { 
  id: string, 
  value: string, 
  icon: React.ElementType, 
  label: string,
  description?: string 
}) => (
  <div>
    <RadioGroupItem value={value} id={id} className="peer sr-only" />
    <Label
      htmlFor={id}
      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
    >
      <Icon className="mb-2 h-8 w-8 text-primary" />
      <span className="font-medium">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground mt-1">{description}</span>
      )}
    </Label>
  </div>
);

const PricingCard = ({ tier, isCurrent, onSelect }: { tier: (typeof pricingTiers)[0], isCurrent: boolean, onSelect: () => void }) => (
  <Card
    className={cn(
      "flex flex-col relative transition-all duration-200 hover:shadow-lg",
      isCurrent && "ring-2 ring-primary shadow-lg",
      tier.highlight && !isCurrent && "border-primary shadow-md scale-105",
      tier.popular && "border-2 border-primary"
    )}
  >
    <CardHeader className="relative pb-4">
      {isCurrent && (
        <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">
          <Check className="w-3 h-3 mr-1" />
          Current Plan
        </Badge>
      )}
      {tier.popular && !isCurrent && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      {tier.highlight && !isCurrent && !tier.popular && (
        <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Zap className="w-3 h-3 mr-1" />
          Recommended
        </Badge>
      )}
      
      <CardTitle className="text-xl font-bold flex items-center gap-2">
        {tier.name}
        {tier.tierId === "PRO" && <Zap className="h-5 w-5 text-primary" />}
      </CardTitle>
      <CardDescription className="text-sm">{tier.description}</CardDescription>
      
      <div className="mt-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{tier.price}</span>
          {tier.frequency && (
            <span className="text-base font-normal text-muted-foreground">{tier.frequency}</span>
          )}
        </div>
        {tier.savings && (
          <p className="text-sm text-green-600 font-medium mt-1">{tier.savings}</p>
        )}
      </div>
    </CardHeader>
    
    <CardContent className="flex-grow">
      <ul role="list" className="space-y-3 text-sm">
        {tier.features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    
    <CardFooter className="pt-6">
      <Button
        className={cn(
          "w-full h-11 font-medium",
          tier.highlight && "bg-primary hover:bg-primary/90"
        )}
        onClick={onSelect}
        disabled={isCurrent}
        variant={tier.highlight ? "default" : "outline"}
        size="lg"
      >
        {isCurrent ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Current Plan
          </>
        ) : (
          tier.buttonText
        )}
      </Button>
      
      {tier.tierId !== "FREE" && tier.tierId !== "ENTERPRISE" && !isCurrent && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          14-day free trial • Cancel anytime
        </p>
      )}
    </CardFooter>
  </Card>
);