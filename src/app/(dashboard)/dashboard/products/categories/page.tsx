"use client";

import { useCallback, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash, FolderOpen, Package, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTenant } from "@/lib/tenant-context";
import { deleteCategory, updateCategory, createCategory } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

// Sanitize user input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>"'&]/g, (match) => {
    const entities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[match] || match;
  });
};

interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function CategoriesPage() {
  const router = useRouter();
  const { tenant } = useTenant();
  const { data: categories, isLoading, isError, mutate } = useApi(tenant ? `/products/categories?tenantId=${tenant.id}` : null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDeleteCategory = async (categoryId: string) => {
    if (!tenant?.id) return;
    try {
      await deleteCategory(tenant.id, categoryId);
      toast.success("Category deleted successfully.");
      mutate(); // Re-fetch categories after deletion
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category.");
    }
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (!categories || !Array.isArray(categories)) {
      return { total: 0, largest: null, empty: 0 };
    }

    const total = categories.length;
    const largest = categories.reduce((max: Category | null, cat: Category) => {
      if (!max || cat.productCount > max.productCount) return cat;
      return max;
    }, null);
    const empty = categories.filter((cat: Category) => cat.productCount === 0).length;

    return { total, largest, empty };
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">Product Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize your catalog</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
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

  if (isError) {
    toast.error("Failed to load categories.");
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">Product Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize your catalog</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No Categories Found</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t added any categories yet. Get started by adding your first one.
                </EmptyDescription>
              </EmptyHeader>
              <Button onClick={handleOpenAddDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </Empty>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <CategoryFormDialog
            category={editingCategory}
            onSaveSuccess={() => {
              setIsDialogOpen(false);
              mutate();
            }}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Product Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your catalog</p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Category</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 md:p-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Largest Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-base sm:text-lg font-bold truncate">
              {stats.largest?.name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.largest?.productCount || 0} products
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Empty Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-warning">
              {stats.empty}
            </div>
            <p className="text-xs text-muted-foreground">Need products</p>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Table View */}
      <Card className="hidden md:block">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{sanitizeInput(category.name)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description ? sanitizeInput(category.description) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{category.productCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(category)}>
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile: Card View */}
      <div className="grid gap-3 md:hidden">
        {categories?.map((category: Category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{sanitizeInput(category.name)}</CardTitle>
                  <CardDescription className="text-xs mt-1 line-clamp-2">
                    {category.description ? sanitizeInput(category.description) : 'No description'}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  {category.productCount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleOpenEditDialog(category)}
                >
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <CategoryFormDialog
          category={editingCategory}
          onSaveSuccess={() => {
            setIsDialogOpen(false);
            mutate();
          }}
          onClose={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}

interface CategoryFormDialogProps {
  category: Category | null;
  onSaveSuccess: () => void;
  onClose: () => void;
}

const CategoryFormDialog = ({ category, onSaveSuccess, onClose }: CategoryFormDialogProps) => {
  const { tenant } = useTenant();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    if (!tenant?.id) {
      toast.error("Tenant not found.");
      return;
    }

    try {
      if (category) {
        // Update existing category
        await updateCategory(tenant.id, category.id, values);
        toast.success("Category updated successfully.");
      } else {
        // Create new category
        await createCategory(tenant.id, values);
        toast.success("Category added successfully.");
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Failed to save category.");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogDescription>
          {category ? "Edit the details of your category." : "Add a new category to your catalog."}
        </DialogDescription>
      </DialogHeader>
      <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="category-form" disabled={form.formState.isSubmitting}>Save Category</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};