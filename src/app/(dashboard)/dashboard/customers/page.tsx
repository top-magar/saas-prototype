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
import { Search, UserPlus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: "New" | "Active" | "Churned" | "VIP";
  lastActive: string;
}

const allCustomers: Customer[] = [
  { id: "CUST001", name: "Alice Smith", email: "alice@example.com", totalOrders: 5, totalSpent: 500.00, status: "Active", lastActive: "2023-10-25" },
  { id: "CUST002", name: "Bob Johnson", email: "bob@example.com", totalOrders: 1, totalSpent: 75.50, status: "New", lastActive: "2023-10-22" },
  { id: "CUST003", name: "Charlie Brown", email: "charlie@example.com", totalOrders: 10, totalSpent: 1200.00, status: "VIP", lastActive: "2023-10-26" },
  { id: "CUST004", name: "Diana Prince", email: "diana@example.com", totalOrders: 2, totalSpent: 150.00, status: "Active", lastActive: "2023-10-20" },
  { id: "CUST005", name: "Eve Adams", email: "eve@example.com", totalOrders: 0, totalSpent: 0.00, status: "Churned", lastActive: "2023-08-01" },
  { id: "CUST006", name: "Frank White", email: "frank@example.com", totalOrders: 3, totalSpent: 250.00, status: "Active", lastActive: "2023-10-18" },
  { id: "CUST007", name: "Grace Lee", email: "grace@example.com", totalOrders: 7, totalSpent: 800.00, status: "VIP", lastActive: "2023-10-24" },
  { id: "CUST008", name: "Harry Kim", email: "harry@example.com", totalOrders: 1, totalSpent: 45.00, status: "New", lastActive: "2023-10-23" },
];

const ITEMS_PER_PAGE = 5;

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Customers</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage and view all your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
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
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Churned">Churned</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "VIP"
                          ? "default"
                          : customer.status === "Churned"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.lastActive}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
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
