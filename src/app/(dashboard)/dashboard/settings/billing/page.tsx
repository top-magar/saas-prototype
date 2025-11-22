"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, Calendar, AlertTriangle, CheckCircle, Crown, Zap, Users } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/use-currency";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Due" | "Failed";
  description: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand: string;
  isDefault: boolean;
  expiryDate?: string;
}

const invoices: Invoice[] = [
  { id: "INV-2024-001", date: "2024-01-01", amount: 2999, status: "Paid", description: "PRO Plan - January 2024" },
  { id: "INV-2023-012", date: "2023-12-01", amount: 2999, status: "Paid", description: "PRO Plan - December 2023" },
  { id: "INV-2023-011", date: "2023-11-01", amount: 2999, status: "Paid", description: "PRO Plan - November 2023" },
  { id: "INV-2023-010", date: "2023-10-01", amount: 999, status: "Failed", description: "BASIC Plan - October 2023" },
];

const paymentMethods: PaymentMethod[] = [
  { id: "1", type: "card", last4: "4242", brand: "Visa", isDefault: true, expiryDate: "12/25" },
  { id: "2", type: "bank", last4: "1234", brand: "NIC Asia Bank", isDefault: false },
];

const plans = [
  {
    name: "FREE",
    price: 0,
    description: "Perfect for getting started",
    features: ["5 Products", "1 User", "1GB Storage", "Basic Support"],
    current: false,
  },
  {
    name: "PRO",
    price: 2999,
    description: "Best for growing businesses",
    features: ["Unlimited Products", "5 Users", "50GB Storage", "Priority Support", "Advanced Analytics"],
    current: true,
  },
  {
    name: "ENTERPRISE",
    price: 9999,
    description: "For large organizations",
    features: ["Everything in PRO", "Unlimited Users", "500GB Storage", "24/7 Support", "Custom Integrations"],
    current: false,
  },
];

export default function BillingPage() {
  const { formatCurrency, convertPrice, currencySymbol } = useCurrency();
  const [currentPlan] = useState("PRO"
  );
  const [usage] = useState({
    products: { used: 247, limit: 1000 },
    users: { used: 3, limit: 5 },
    storage: { used: 12.4, limit: 50 },
    apiCalls: { used: 8450, limit: 10000 },
  }
  );

  const downloadInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} downloaded`
    );
  };

  const changePlan = (planName: string) => {
    toast.success(`Plan changed to ${planName}`
    );
  };

  const addPaymentMethod = () => {
    toast.success("Payment method added successfully"
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Paid: { variant: "default" as const, icon: CheckCircle },
      Due: { variant: "secondary" as const, icon: Calendar },
      Failed: { variant: "destructive" as const, icon: AlertTriangle },
    };
    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;
    return (

      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>

    );
  };

  const getPlanIcon = (planName: string) => {
    const icons = {
      FREE: Users,
      PRO: Zap,
      ENTERPRISE: Crown,
    };
    return icons[planName as keyof typeof icons] || Users;
  };

  return (

    <div className="flex flex-col gap-6 p-4 lg:p-6">


      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{currentPlan} Plan</h3>
                      <p className="text-muted-foreground">{formatCurrency(2999)}/month</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Next billing: February 1, 2024</p>
                    <p className="text-sm text-muted-foreground">Auto-renewal: Enabled</p>
                  </div>
                  <Button className="w-full">Manage Subscription</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Overview</CardTitle>
                <CardDescription>Current month usage across all features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Products</span>
                    <span>{usage.products.used}/{usage.products.limit}</span>
                  </div>
                  <Progress value={(usage.products.used / usage.products.limit) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Team Members</span>
                    <span>{usage.users.used}/{usage.users.limit}</span>
                  </div>
                  <Progress value={(usage.users.used / usage.users.limit) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span>{usage.storage.used}GB/{usage.storage.limit}GB</span>
                  </div>
                  <Progress value={(usage.storage.used / usage.storage.limit) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Calls</span>
                    <span>{usage.apiCalls.used.toLocaleString()}/{usage.apiCalls.limit.toLocaleString()}</span>
                  </div>
                  <Progress value={(usage.apiCalls.used / usage.apiCalls.limit) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* BASIC PLAN */}
            <Card className="relative flex flex-col overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-500 p-4 text-center">
                <h3 className="text-xl font-bold text-white tracking-wide">BASIC</h3>
              </div>
              <CardContent className="flex-1 p-6 flex flex-col">
                <div className="text-center mb-6 h-32 flex flex-col pt-4 gap-2">
                  <div className="flex items-baseline justify-center gap-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-muted-foreground">{currencySymbol}</span>
                    <span className="text-4xl font-bold">{convertPrice(24000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="text-sm text-muted-foreground">/yr</span>
                  </div>
                  <p className="text-sm font-bold tracking-wide text-muted-foreground mt-auto">FOR STARTERS</p>
                </div>

                <Button className="w-full mb-6 rounded-full border-blue-500 text-blue-600 hover:bg-blue-50" variant="outline">
                  Purchase Now
                </Button>

                <ul className="space-y-3 text-sm flex-1">
                  {[
                    "Up to 5 Staff Accounts",
                    "Up to 1000 Products",
                    "Up to 10k Orders / year",
                    "Website Customization",
                    "Online Payments",
                    "Online Payments",
                    "Inventory Management",
                    "Inventory Management",
                    "Order Management System",
                    "Custom Domain Integration",
                    "250 SMS Credit"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* PREMIUM PLAN */}
            <Card className="relative flex flex-col overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-pink-500 p-4 text-center">
                <h3 className="text-xl font-bold text-white tracking-wide">PREMIUM</h3>
              </div>
              <CardContent className="flex-1 p-6 flex flex-col">
                <div className="text-center mb-6 h-32 flex flex-col pt-4 gap-1">
                  <div className="flex items-baseline justify-center gap-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-muted-foreground">{currencySymbol}</span>
                    <span className="text-4xl font-bold">{convertPrice(28000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="text-sm text-muted-foreground">/yr</span>
                  </div>
                  <span className="text-sm text-muted-foreground line-through decoration-red-500/50">{convertPrice(35000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <p className="text-sm font-bold tracking-wide text-muted-foreground mt-auto">FOR GROWING BUSINESS</p>
                </div>

                <Button className="w-full mb-6 rounded-full border-pink-500 text-pink-600 hover:bg-pink-50" variant="outline">
                  Purchase Now
                </Button>

                <ul className="space-y-3 text-sm flex-1">
                  {[
                    "Everything from Basic",
                    "25 Staff Accounts",
                    "Up to 2500 Products",
                    "Up to 50k Orders / year",
                    "Product Reviews",
                    "Product Reviews",
                    "Blogs - Launching Soon",
                    "Blogs - Launching Soon",
                    "500 SMS Credit",
                    "Advance Analytics",
                    "Remote Training",
                    "Self Payment Gateway Integration"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* BUSINESS PLUS PLAN */}
            <Card className="relative flex flex-col overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-shadow ring-2 ring-pink-500/20">
              <div className="bg-pink-500 p-4 text-center">
                <h3 className="text-xl font-bold text-white tracking-wide">BUSINESS PLUS</h3>
              </div>
              <CardContent className="flex-1 p-6 flex flex-col">
                <div className="text-center mb-6 h-32 flex flex-col pt-4 gap-2">
                  <div className="flex items-baseline justify-center gap-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-muted-foreground">{currencySymbol}</span>
                    <span className="text-4xl font-bold">{convertPrice(38000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="text-sm text-muted-foreground">/yr</span>
                  </div>
                  <p className="text-sm font-bold tracking-wide text-muted-foreground mt-auto">MOST POPULAR CHOICE</p>
                </div>

                <Button className="w-full mb-6 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-md">
                  Purchase Now
                </Button>

                <ul className="space-y-3 text-sm flex-1">
                  {[
                    "Everything from Basic",
                    "25 Staff Accounts",
                    "Up to 3000 Products",
                    "Up to 75k Orders / year",
                    "Website Design- 5 to 6 Banners Included",
                    "Landing Page Setup",
                    "Product Reviews",
                    "Product Reviews",
                    "Blogs - Launching Soon",
                    "Blogs - Launching Soon",
                    "700 SMS Credit",
                    "Advance Analytics",
                    "Remote Training"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* PLATINUM PLAN */}
            <Card className="relative flex flex-col overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-yellow-500 p-4 text-center">
                <h3 className="text-xl font-bold text-white tracking-wide">PLATINUM</h3>
              </div>
              <CardContent className="flex-1 p-6 flex flex-col">
                <div className="text-center mb-6 h-32 flex flex-col pt-4 gap-2">
                  <div className="flex items-baseline justify-center gap-1 whitespace-nowrap">
                    <span className="text-sm font-medium text-muted-foreground">{currencySymbol}</span>
                    <span className="text-4xl font-bold">{convertPrice(48000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="text-sm text-muted-foreground">/yr</span>
                  </div>
                  <p className="text-sm font-bold tracking-wide text-muted-foreground mt-auto">FOR BIG D2C BRANDS</p>
                </div>

                <Button className="w-full mb-6 rounded-full border-yellow-500 text-yellow-600 hover:bg-yellow-50" variant="outline">
                  Purchase Now
                </Button>

                <ul className="space-y-3 text-sm flex-1">
                  {[
                    "Everything from Business Plus",
                    "50 Staff Accounts",
                    "Up to 5000 Products",
                    "Unlimited Orders",
                    "Custom Built Features (If any)",
                    "1000 SMS Credit",
                    "POS (Point of Sales)",
                    "Barcode for Inventory"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View and download your invoices</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
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
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </div>
                  <Button onClick={addPaymentMethod}>Add Method</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.expiryDate && (
                          <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && <Badge variant="secondary">Default</Badge>}
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Your billing address and tax information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">PASAAL.IO</p>
                  <p className="text-sm text-muted-foreground">
                    Kathmandu, Nepal<br />
                    VAT ID: NP123456789
                  </p>
                </div>
                <Button variant="outline" className="w-full">Update Billing Info</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>

  );
}