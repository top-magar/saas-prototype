"use client";

import { useCallback, useState } from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Plus, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTenant } from "@/lib/tenant-context";
import { deleteCategory, updateCategory, createCategory } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

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

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-xl font-semibold md:text-2xl">Product Categories</h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
            <CardDescription>Loading categories...</CardDescription>
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
      </PageWrapper>
    );
  }
  
  if (isError) {
    toast.error("Failed to load categories.");
  }

  if (!categories || categories.length === 0) {
    return (
      <PageWrapper>
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold md:text-2xl">Product Categories</h1>
            
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
              <Button onClick={() => router.push('/dashboard/products/categories/add')}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </Empty>
          </CardContent>
        </Card>

        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Product Categories</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>Organize your products into categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon-sm" onClick={() => handleOpenEditDialog(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </PageWrapper>
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