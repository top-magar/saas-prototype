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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, FileText, Mail } from "lucide-react";

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  issueDate: string;
  dueDate: string;
  pdfLink: string;
}

const allInvoices: Invoice[] = [
  { id: "INV001", customer: "Alice Smith", amount: 120.00, status: "Paid", issueDate: "2023-09-01", dueDate: "2023-10-01", pdfLink: "#" },
  { id: "INV002", customer: "Bob Johnson", amount: 75.50, status: "Pending", issueDate: "2023-10-05", dueDate: "2023-11-05", pdfLink: "#" },
  { id: "INV003", customer: "Charlie Brown", amount: 200.00, status: "Overdue", issueDate: "2023-08-10", dueDate: "2023-09-10", pdfLink: "#" },
  { id: "INV004", customer: "Diana Prince", amount: 50.00, status: "Paid", issueDate: "2023-10-15", dueDate: "2023-11-15", pdfLink: "#" },
  { id: "INV005", customer: "Eve Adams", amount: 150.25, status: "Pending", issueDate: "2023-10-20", dueDate: "2023-11-20", pdfLink: "#" },
  { id: "INV006", customer: "Frank White", amount: 30.00, status: "Paid", issueDate: "2023-09-25", dueDate: "2023-10-25", pdfLink: "#" },
  { id: "INV007", customer: "Grace Lee", amount: 99.99, status: "Pending", issueDate: "2023-10-26", dueDate: "2023-11-26", pdfLink: "#" },
];

const ITEMS_PER_PAGE = 5;

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState(""    
  );
  const [filterStatus, setFilterStatus] = useState("All"    
  );
  const [currentPage, setCurrentPage] = useState(1    
  );

  const filteredInvoices = allInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()    
  );
    const matchesStatus =
      filterStatus === "All" || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  }    
  );

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE    
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex    
  );

  const handleSendReminder = (invoiceId: string) => {
    console.log('Sending reminder for invoice');
    // API call to send reminder
  };

  return (
    
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>Manage and view all customer invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "default"
                          : invoice.status === "Overdue"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon-sm" asChild>
                        <a href={invoice.pdfLink} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                      {invoice.status !== "Paid" && (
                        <Button variant="outline" size="icon-sm" onClick={() => handleSendReminder(invoice.id)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationPrevious
                onClick={currentPage === 1 ? undefined : () => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={currentPage === totalPages ? undefined : () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
      
  );
}
