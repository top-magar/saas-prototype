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
import { Banknote, Check, CreditCard, Wallet } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast } from "sonner";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    frequency: "/month",
    description: "Get started with our basic features.",
    features: ["1 User", "1 Project", "Basic Analytics", "Community Support"],
    buttonText: "Current Plan",
    tierId: "FREE",
  },
  {
    name: "Starter",
    price: "$29",
    frequency: "/month",
    description: "For new businesses getting started.",
    features: [
      "Up to 50 products",
      "Basic order management",
      "Standard analytics",
      "Email support",
    ],
    buttonText: "Upgrade to Starter",
    tierId: "STARTER",
  },
  {
    name: "Pro",
    price: "$79",
    frequency: "/month",
    description: "For growing businesses that need more power.",
    features: [
      "Up to 1,000 products",
      "Advanced analytics",
      "Automation & API access",
      "Team management (5 users)",
      "Priority chat support",
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
    tierId: "PRO",
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    frequency: "",
    description: "Tailored solutions for your enterprise needs.",
    features: [
      "Custom Solutions",
      "Dedicated Support",
      "On-premise Deployment",
      "SLA",
    ],
    buttonText: "Contact Sales",
    tierId: "ENTERPRISE",
  },
];

type PricingDialogProps = {
  trigger: React.ReactNode;
  currentPlan?: "FREE" | "STARTER" | "PRO" | "ENTERPRISE"; // Use enum values
  showPaymentMethods?: boolean;
};

export function PricingDialog({ trigger, currentPlan = "FREE", showPaymentMethods = false }: PricingDialogProps) {
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

          {showPaymentMethods && isSignedIn && ( // Only show payment methods if signed in and explicitly allowed
            <div className="mb-8 flex flex-col items-center gap-4">
              <h3 className="text-base font-semibold">Select Payment Method</h3>
              <RadioGroup
                defaultValue="esewa"
                onValueChange={setSelectedPaymentMethod}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md"
              >
                <PaymentMethodRadio id="esewa" value="esewa" icon={Wallet} label="eSewa" />
                <PaymentMethodRadio id="khalti" value="khalti" icon={CreditCard} label="Khalti" />
                <PaymentMethodRadio id="fonepay" value="fonepay" icon={Banknote} label="Fonepay" />
              </RadioGroup>
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

const PaymentMethodRadio = ({ id, value, icon: Icon, label }: { id: string, value: string, icon: React.ElementType, label: string }) => (
  <div>
    <RadioGroupItem value={value} id={id} className="peer sr-only" />
    <Label
      htmlFor={id}
      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
    >
      <Icon className="mb-2 h-6 w-6" />
      {label}
    </Label>
  </div>
);

const PricingCard = ({ tier, isCurrent, onSelect }: { tier: (typeof pricingTiers)[0], isCurrent: boolean, onSelect: () => void }) => (
  <Card
    className={cn(
      "flex flex-col",
      isCurrent && "ring-2 ring-primary",
      tier.highlight && !isCurrent && "border-primary"
    )}
  >
    <CardHeader className="relative">
      {isCurrent && (
        <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2">Current Plan</Badge>
      )}
      {tier.highlight && !isCurrent && (
        <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2">Recommended</Badge>
      )}
      <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
      <CardDescription>{tier.description}</CardDescription>
      <div className="mt-4 text-3xl font-bold">
        {tier.price}
        {tier.frequency && <span className="text-base font-normal text-muted-foreground">{tier.frequency}</span>}
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul role="list" className="space-y-3 text-sm">
        {tier.features.map((feature: string) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button
        className="w-full"
        onClick={onSelect}
        disabled={isCurrent || tier.tierId === "FREE" || tier.tierId === "ENTERPRISE"}
        variant={tier.highlight ? "default" : "outline"}
      >
        {isCurrent ? "Your Current Plan" : tier.buttonText}
      </Button>
    </CardFooter>
  </Card>
);