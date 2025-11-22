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
import { Search, Pencil, Eye, Plus } from "lucide-react";
import { AddProductSheet } from "../_components/add-product-sheet";

interface ProductInventory {
  id: string;
  name: string;
  sku: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const allProductsInventory: ProductInventory[] = [
  { id: "PROD001", name: "Laptop Pro X", sku: "LPX-001", stock: 150, status: "In Stock" },
  { id: "PROD002", name: "Wireless Mouse", sku: "WM-002", stock: 20, status: "Low Stock" },
  { id: "PROD003", name: "Mechanical Keyboard", sku: "MK-003", stock: 0, status: "Out of Stock" },
  { id: "PROD004", name: "USB-C Hub", sku: "UCH-004", stock: 300, status: "In Stock" },
  { id: "PROD005", name: "External SSD 1TB", sku: "SSD-1TB", stock: 5, status: "Low Stock" },
  { id: "PROD006", name: "Monitor 27-inch", sku: "MON-27", stock: 75, status: "In Stock" },
  { id: "PROD007", name: "Webcam HD", sku: "WC-HD", stock: 0, status: "Out of Stock" },
];

const ITEMS_PER_PAGE = 5;

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState(""
  );
  const [filterStatus, setFilterStatus] = useState("All"
  );
  const [currentPage, setCurrentPage] = useState(1
  );
  const [inventory, setInventory] = useState<ProductInventory[]>(allProductsInventory
  );
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const filteredProducts = inventory.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()
      );
    const matchesStatus =
      filterStatus === "All" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  }
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex
  );

  const handleStockChange = (id: string, newStock: number) => {
    setInventory(
      inventory.map((product) =>
        product.id === id
          ? {
            ...product,
            stock: newStock,
            status:
              newStock === 0
                ? "Out of Stock"
                : newStock <= 10
                  ? "Low Stock"
                  : "In Stock",
          }
          : product
      )

    );
    console.log('Stock updated successfully');
    // In a real app, this would involve an API call to update stock
  };

  return (

    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddProductOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>Manage stock levels for your products.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.stock}
                      onChange={(e) => handleStockChange(product.id, parseInt(e.target.value))}
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "In Stock"
                          ? "default"
                          : product.status === "Low Stock"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon-sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
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

      {/* Add Product Sheet */}
      <AddProductSheet
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        onSuccess={() => {
          // Optionally refresh inventory
        }}
      />
    </div>

  );
}
