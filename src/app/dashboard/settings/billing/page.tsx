"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { CreditCardIcon, CalendarIcon, LockIcon, FileTextIcon } from "lucide-react";

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
  const [currentPlan, setCurrentPlan] = useState("Pro Plan");
  const [paymentMethod, setPaymentMethod] = useState("Visa ending in 4242");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  const handleUpdatePaymentMethod = () => {
    console.log("Updating payment method:", { cardName, cardNumber, expiryDate, cvc });
    // In a real app, this would involve an API call to update payment method
    setPaymentMethod(`Visa ending in ${cardNumber.slice(-4)}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">Billing & Plans</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your current subscription details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-2xl font-bold">{currentPlan}</p>
            <p className="text-muted-foreground">Next billing date: November 1, 2023</p>
            <Button variant="outline">Change Plan</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your primary payment method.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">{paymentMethod}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Update Payment Method</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Payment Method</DialogTitle>
                  <DialogDescription>
                    Enter your new payment details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Field>
                    <FieldLabel>Cardholder Name</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Card Number</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </FieldContent>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Expiry Date</FieldLabel>
                      <FieldContent>
                        <Input
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>CVC</FieldLabel>
                      <FieldContent>
                        <Input
                          placeholder="XXX"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                        />
                      </FieldContent>
                    </Field>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleUpdatePaymentMethod}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
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
                        <FileTextIcon className="mr-2 h-4 w-4" /> PDF
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
