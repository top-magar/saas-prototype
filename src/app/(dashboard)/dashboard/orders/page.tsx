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
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  customer: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  amount: number;
  date: string;
}

const allOrders: Order[] = [
  { id: "ORD001", customer: "Alice Smith", status: "Delivered", amount: 14400.00, date: "2023-10-20" },
  { id: "ORD002", customer: "Bob Johnson", status: "Processing", amount: 9060.00, date: "2023-10-22" },
  { id: "ORD003", customer: "Charlie Brown", status: "Shipped", amount: 24000.00, date: "2023-10-21" },
  { id: "ORD004", customer: "Diana Prince", status: "Pending", amount: 6000.00, date: "2023-10-23" },
  { id: "ORD005", customer: "Eve Adams", status: "Delivered", amount: 18030.00, date: "2023-10-19" },
  { id: "ORD006", customer: "Frank White", status: "Cancelled", amount: 3600.00, date: "2023-10-18" },
  { id: "ORD007", customer: "Grace Lee", status: "Processing", amount: 11999.00, date: "2023-10-24" },
  { id: "ORD008", customer: "Harry Kim", status: "Shipped", amount: 21600.00, date: "2023-10-23" },
  { id: "ORD009", customer: "Ivy Wang", status: "Pending", amount: 7800.00, date: "2023-10-25" },
  { id: "ORD010", customer: "Jack Black", status: "Delivered", amount: 36000.00, date: "2023-10-17" },
];

const ITEMS_PER_PAGE = 5;

export default function OrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""    
  );
  const [filterStatus, setFilterStatus] = useState("All"    
  );
  const [currentPage, setCurrentPage] = useState(1    
  );

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()    
  );
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  }    
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE    
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex    
  );

  return (
    
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Orders & Sales</h1>
        <Button onClick={() => router.push('/dashboard/orders/add')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>Manage and view all customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
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
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>NPR {order.amount.toFixed(2)}</TableCell>
                  <TableCell>{order.date}</TableCell>
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
