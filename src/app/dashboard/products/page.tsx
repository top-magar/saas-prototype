"use client";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchIcon, PlusIcon, EditIcon, Trash2Icon, MoreHorizontalIcon, Image as ImageIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useTenant } from "@/lib/tenant-context";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  createdAt: string;
}

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().min(0, "Stock must be a positive number"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const { tenant } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    if (!tenant?.id) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/products?tenantId=${tenant.id}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [tenant?.id]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(currentProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!tenant?.id) return;
    try {
      await axios.delete(`/api/products?tenantId=${tenant.id}&productId=${productId}`);
      toast.success("Product deleted successfully.");
      fetchProducts(); // Re-fetch products after deletion
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product.");
    }
  };

  const handleBulkDelete = async () => {
    if (!tenant?.id || selectedProducts.length === 0) return;
    try {
      await Promise.all(selectedProducts.map(productId =>
        axios.delete(`/api/products?tenantId=${tenant.id}&productId=${productId}`)
      ));
      toast.success(`${selectedProducts.length} products deleted successfully.`);
      setSelectedProducts([]);
      fetchProducts(); // Re-fetch products after bulk deletion
    } catch (error) {
      console.error("Failed to bulk delete products:", error);
      toast.error("Failed to bulk delete products.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>Loading products...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <ProductFormDialog
            product={editingProduct}
            onSaveSuccess={fetchProducts}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>Manage all your products and their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Home & Office">Home & Office</SelectItem>
                  <SelectItem value="Apparel">Apparel</SelectItem>
                </SelectContent>
              </Select>
              {selectedProducts.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions ({selectedProducts.length})
                      <MoreHorizontalIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={handleBulkDelete}>Delete Selected</DropdownMenuItem>
                    {/* Add more bulk actions here */}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  />
                </TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "IN_STOCK"
                          ? "default"
                          : product.status === "LOW_STOCK"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {product.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(product)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

interface ProductFormDialogProps {
  product: Product | null;
  onSaveSuccess: () => void;
  onClose: () => void;
}

const ProductFormDialog = ({ product, onSaveSuccess, onClose }: ProductFormDialogProps) => {
  const { tenant } = useTenant();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      category: product?.category || "Electronics",
      imageUrl: product?.imageUrl || "",
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    if (!tenant?.id) {
      toast.error("Tenant not found.");
      return;
    }

    try {
      if (product) {
        // Update existing product
        await axios.patch(`/api/products?tenantId=${tenant.id}&productId=${product.id}`, values);
        toast.success("Product updated successfully.");
      } else {
        // Create new product
        await axios.post(`/api/products?tenantId=${tenant.id}`, values);
        toast.success("Product added successfully.");
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product.");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogDescription>
          {product ? "Edit the details of your product." : "Add a new product to your catalog."}
        </DialogDescription>
      </DialogHeader>
      <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldContent>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => <Input {...field} />}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldContent>
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => <Textarea {...field} />}
            />
            <FieldError>{form.formState.errors.description?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Price</FieldLabel>
          <FieldContent>
            <Controller
              name="price"
              control={form.control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            <FieldError>{form.formState.errors.price?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Stock</FieldLabel>
          <FieldContent>
            <Controller
              name="stock"
              control={form.control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            <FieldError>{form.formState.errors.stock?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Category</FieldLabel>
          <FieldContent>
            <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Home & Office">Home & Office</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{form.formState.errors.category?.message}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Image URL</FieldLabel>
          <FieldContent>
            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field }) => <Input {...field} placeholder="https://example.com/image.jpg" />}
            />
            <FieldError>{form.formState.errors.imageUrl?.message}</FieldError>
          </FieldContent>
        </Field>
      </form>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" form="product-form" disabled={form.formState.isSubmitting}>Save Product</Button>
      </DialogFooter>
    </DialogContent>
  );
};

