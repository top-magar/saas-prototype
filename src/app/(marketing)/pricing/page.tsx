"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Check, Star, Zap, ArrowRight, Shield, Users, Headphones, Globe } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const pricingTiers = [
  {
    name: "Free",
    price: "NPR 0",
    frequency: "/month",
    description: "Perfect for getting started with basic features.",
    features: ["Up to 10 products", "Basic dashboard", "Email support", "5GB storage"],
    buttonText: "Get Started",
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

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with 256-bit SSL encryption and SOC 2 compliance."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work seamlessly with your team using role-based permissions and real-time updates."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Get help when you need it with our dedicated support team available around the clock."
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Built to scale with your business, from startup to enterprise with 99.9% uptime."
  }
];

export default function PricingPage() {
  const { status } = useSession();
  const isSignedIn = status === 'authenticated';
  const router = useRouter();

  const handleAction = async (tier: (typeof pricingTiers)[0]) => {
    if (tier.tierId === "FREE") {
      if (!isSignedIn) {
        router.push("/sign-up");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    if (tier.tierId === "ENTERPRISE") {
      toast.info("Please contact sales to learn more about our Enterprise plan.");
      return;
    }

    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    router.push(`/payment-processing?plan=${tier.tierId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4">
          Pricing Plans
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose the Perfect Plan for Your Business
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free and scale as you grow. All plans include a 14-day free trial with no credit card required.
        </p>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              onSelect={() => handleAction(tier)}
            />
          ))}
        </div>
      </div>

      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Pasaal.io?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for modern businesses with enterprise-grade features and startup-friendly pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
            <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">All paid plans come with a 14-day free trial. No credit card required to start.</p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">We accept eSewa, Khalti, and FonePay for convenient local payments in Nepal.</p>
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of businesses already using Pasaal.io to grow their operations.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push(isSignedIn ? "/dashboard" : "/sign-up")}
            className="bg-background text-foreground hover:bg-background/90"
          >
            {isSignedIn ? "Go to Dashboard" : "Start Free Trial"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const PricingCard = ({ tier, onSelect }: { tier: (typeof pricingTiers)[0], onSelect: () => void }) => (
  <Card
    className={cn(
      "flex flex-col relative transition-all duration-200 hover:shadow-lg",
      tier.highlight && "border-primary shadow-md scale-105",
      tier.popular && "border-2 border-primary"
    )}
  >
    <CardHeader className="relative pb-4">
      {tier.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      {tier.highlight && !tier.popular && (
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
        variant={tier.highlight ? "default" : "outline"}
        size="lg"
      >
        {tier.buttonText}
      </Button>

      {tier.tierId !== "FREE" && tier.tierId !== "ENTERPRISE" && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          14-day free trial • Cancel anytime
        </p>
      )}
    </CardFooter>
  </Card>
);