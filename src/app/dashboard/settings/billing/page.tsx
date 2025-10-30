"use client";

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
import { FileText } from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { Dialog } from "@/components/ui/dialog";
import { PricingDialog } from "@/components/pricing-dialog";
import { TenantTier } from "@/lib/types";

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
            <Dialog>
              <PricingDialog
                trigger={<Button variant="outline">Change Plan</Button>}
                currentPlan={tenant?.tier || TenantTier.FREE}
                showPaymentMethods={true}
              />
            </Dialog>
          </CardContent>
        </Card>
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
