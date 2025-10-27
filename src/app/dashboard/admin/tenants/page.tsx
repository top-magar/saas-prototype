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
import { SearchIcon, EyeIcon, BanIcon, CheckCircleIcon } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  status: "Active" | "Suspended" | "Pending";
  createdAt: string;
  plan: string;
}

const allTenants: Tenant[] = [
  { id: "tenant_001", name: "Acme Corp", status: "Active", createdAt: "2023-01-01", plan: "Enterprise" },
  { id: "tenant_002", name: "Globex Inc.", status: "Active", createdAt: "2023-02-15", plan: "Pro" },
  { id: "tenant_003", name: "Soylent Corp", status: "Suspended", createdAt: "2023-03-10", plan: "Basic" },
  { id: "tenant_004", name: "Umbrella Corp", status: "Active", createdAt: "2023-04-20", plan: "Pro" },
  { id: "tenant_005", name: "Weyland-Yutani", status: "Pending", createdAt: "2023-05-01", plan: "Enterprise" },
  { id: "tenant_006", name: "Cyberdyne Systems", status: "Active", createdAt: "2023-06-01", plan: "Basic" },
];

const ITEMS_PER_PAGE = 5;

export default function AllTenantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTenants = allTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || tenant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTenants = filteredTenants.slice(startIndex, endIndex);

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details for tenant ${id}`);
    // Navigate to tenant details page
  };

  const handleSuspendTenant = (id: string) => {
    console.log(`Suspending tenant ${id}`);
    // API call to suspend tenant
  };

  const handleActivateTenant = (id: string) => {
    console.log(`Activating tenant ${id}`);
    // API call to activate tenant
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">All Tenants</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>View and manage all registered tenants on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-mono text-xs">{tenant.id}</TableCell>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.plan}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tenant.status === "Active"
                          ? "default"
                          : tenant.status === "Suspended"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{tenant.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon-sm" onClick={() => handleViewDetails(tenant.id)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {tenant.status === "Active" ? (
                        <Button variant="destructive" size="icon-sm" onClick={() => handleSuspendTenant(tenant.id)}>
                          <BanIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="default" size="icon-sm" onClick={() => handleActivateTenant(tenant.id)}>
                          <CheckCircleIcon className="h-4 w-4" />
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
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
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
