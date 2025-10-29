// src/app/dashboard/products/product-form-dialog.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTenant } from "@/lib/tenant-context";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
}

// Simplified schema for the main product details
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
});
type ProductFormValues = z.infer<typeof productFormSchema>;

// ... (You'll need to define your variant and option types here)

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
}

interface ProductFormDialogProps {
  product?: Product; // Replace 'any' with your detailed product type
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: () => void;
}

export const ProductFormDialog = ({
  product,
  open,
  onOpenChange,
  onSaveSuccess,
}: ProductFormDialogProps) => {
  const { tenant } = useTenant();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    if (!tenant) {
      toast.error("No tenant selected. Cannot save product.");
      return;
    }

    const apiPath = product
      ? `/api/products?tenantId=${tenant.id}&productId=${product.id}`
      : `/api/products?tenantId=${tenant.id}`;
    const apiMethod = product ? "PUT" : "POST";

    try {
      await axios({
        method: apiMethod,
        url: apiPath,
        data: values,
      });
      toast.success(`Product ${product ? "updated" : "created"} successfully.`);
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Create Product"}</DialogTitle>
          <DialogDescription>
            Manage your product&apos;s details, variants, and inventory.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="mt-4">
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <Controller name="name" control={form.control} render={({ field }) => <Input {...field} />} />
                  <FieldError>{form.formState.errors.name?.message}</FieldError>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Controller name="description" control={form.control} render={({ field }) => <Textarea {...field} />} />
                  <FieldError>{form.formState.errors.description?.message}</FieldError>
                </FieldContent>
              </Field>
              {/* Add fields for image URL, tags, etc. here */}
            </form>
          </TabsContent>

          {/* Variants Tab */}
          <TabsContent value="variants" className="mt-4">
            {/* Placeholder for Variants UI */}
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
              <p>Product Variants Management UI</p>
              <p className="text-sm">This is where you&apos;ll add options (like Size, Color) and manage the resulting variants.</p>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="mt-4">
             {/* Placeholder for Inventory UI */}
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <p>Inventory Management UI</p>
                <p className="text-sm">This is where you&apos;ll track stock for each variant.</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="product-form">Save Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};