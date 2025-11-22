"use client";

import { useState, useMemo, useEffect } from "react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MoreVertical, Download, Trash2, Edit2, Eye } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatedDropdownContent } from "@/components/ui/animated-dropdown";

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: "New" | "Active" | "Churned" | "VIP";
  lastActive: string;
  phone?: string;
  joinDate?: string;
}



const ITEMS_PER_PAGE = 5;

const getStatusColor = (status: string) => {
  switch (status) {
    case "VIP": return "bg-purple-100 text-purple-800";
    case "Active": return "bg-green-100 text-green-800";
    case "New": return "bg-blue-100 text-blue-800";
    case "Churned": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

function CustomerDetailsModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { formatCurrency } = useCurrency();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{customer.name}</h3>
              <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
            </div>
            <span className="text-sm text-muted-foreground">{customer.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-lg font-bold">{customer.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-lg font-bold">{formatCurrency(customer.totalSpent)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm"><strong>Email:</strong> {customer.email}</p>
            {customer.phone && <p className="text-sm"><strong>Phone:</strong> {customer.phone}</p>}
            {customer.joinDate && <p className="text-sm"><strong>Joined:</strong> {customer.joinDate}</p>}
            <p className="text-sm"><strong>Last Active:</strong> {customer.lastActive}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CustomerEditModal({ customer, onClose, onSave }: { customer: Customer; onClose: () => void; onSave: (customer: Customer) => void }) {
  const [formData, setFormData] = useState(customer);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={formData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CustomersPage() {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || customer.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "spent": return b.totalSpent - a.totalSpent;
        case "orders": return b.totalOrders - a.totalOrders;
        default: return 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, filterStatus, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCustomers = filteredAndSortedCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleSelectAll = () => {
    setSelectedCustomers(selectedCustomers.length === currentCustomers.length ? [] : currentCustomers.map(c => c.id));
  };

  const toggleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => prev.includes(customerId) ? prev.filter(id => id !== customerId) : [...prev, customerId]);
  };

  const handleBulkDelete = () => {
    setCustomers(prev => prev.filter(c => !selectedCustomers.includes(c.id)));
    setSelectedCustomers([]);
  };

  const handleExportData = () => {
    try {
      const csv = [
        "ID,Name,Email,Phone,Status,Total Orders,Total Spent,Last Active",
        ...customers.map(c => `${c.id},${c.name},${c.email},${c.phone || ""},${c.status},${c.totalOrders},${formatCurrency(c.totalSpent).replace(/,/g, "")},${c.lastActive}`)
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export customer data:', error);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setEditingCustomer(null);
  };



  return (
    <PageTransition>
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex justify-end">
          <div className="text-sm text-muted-foreground">
            Customers are automatically created when they make purchases
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>{filteredAndSortedCustomers.length} customers found</CardDescription>
              </div>
              {selectedCustomers.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-muted-foreground">{selectedCustomers.length} selected</span>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <Select value={filterStatus} onValueChange={(value) => { setFilterStatus(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="spent">Highest Spent</SelectItem>
                    <SelectItem value="orders">Most Orders</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={currentCustomers.length > 0 && selectedCustomers.length === currentCustomers.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading customers...
                      </TableCell>
                    </TableRow>
                  ) : currentCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : currentCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={() => toggleSelectCustomer(customer.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                      <TableCell className="text-right">{customer.totalOrders}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{customer.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </DropdownMenuTrigger>
                          <AnimatedDropdownContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedCustomerDetail(customer)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingCustomer(customer)}>
                              <Edit2 className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </AnimatedDropdownContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                  />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                  />
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>

        {selectedCustomerDetail && (
          <CustomerDetailsModal customer={selectedCustomerDetail} onClose={() => setSelectedCustomerDetail(null)} />
        )}
        {editingCustomer && (
          <CustomerEditModal
            customer={editingCustomer}
            onClose={() => setEditingCustomer(null)}
            onSave={handleUpdateCustomer}
          />
        )}
      </div>
    </PageTransition>
  );
}
