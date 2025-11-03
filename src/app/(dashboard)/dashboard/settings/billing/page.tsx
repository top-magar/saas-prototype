"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, AlertCircle } from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { PlansDialog } from "./plans/page";
import { SubscriptionUsage } from "@/components/subscription-usage";
import { TenantTier } from "@/lib/types";
import { safeApiCall } from "@/lib/utils";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Due" | "Failed";
  pdfLink: string;
}

const billingHistory: Invoice[] = [
  { id: "INV001", date: "2023-10-01", amount: 49.99, status: "Paid", pdfLink: "#" },
  { id: "INV002", date: "2023-09-01", amount: 49.99, status: "Paid", pdfLink: "#" },
  { id: "INV003", date: "2023-08-01", amount: 49.99, status: "Paid", pdfLink: "#" },
  { id: "INV004", date: "2023-07-01", amount: 49.99, status: "Due", pdfLink: "#" },
];

export default function BillingAndPlansPage() {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState({
    products: 0,
    users: 0,
    storage: 0,
    apiCalls: 0,
  });

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const result = await safeApiCall(() => 
          fetch('/api/billing/usage')
        );
        
        if (result.success && result.data) {
          setUsage(result.data);
        } else {
          // Fallback to mock data
          setUsage({
            products: 7,
            users: 2,
            storage: 12,
            apiCalls: 450,
          });
        }
      } catch (err) {
        setError('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48 lg:col-span-2" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-xl font-semibold md:text-2xl">Billing & Plans</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your current subscription details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-xl font-bold">{tenant?.tier || "FREE"} Plan</p>
            <p className="text-muted-foreground">Next billing date: N/A (Mock Data)</p>
            <PlansDialog trigger={<Button variant="outline">View & Change Plan</Button>} />
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <SubscriptionUsage usage={usage} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "default" : "destructive"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <a href={invoice.pdfLink} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" /> PDF
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
