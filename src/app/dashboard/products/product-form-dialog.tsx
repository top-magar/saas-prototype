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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTenant } from "@/lib/tenant-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategories, createProduct, updateProduct } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface ProductMedia {
  id?: string;
  url: string;
  altText?: string;
  order?: number;
}

interface ProductOptionValue {
  id?: string;
  value: string;
}

interface ProductOption {
  id?: string;
  name: string;
  values: ProductOptionValue[];
}

interface ProductVariant {
  id?: string;
  sku?: string;
  price: number;
  stock: number;
  optionValues: { optionName: string; value: string }[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryIds: string[];
  media: ProductMedia[];
  options: ProductOption[];
  variants: ProductVariant[];
}

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryIds: z.array(z.string()).optional(),
  media: z.array(z.object({
    url: z.string().url("Invalid image URL"),
    altText: z.string().optional(),
    order: z.number().int().optional(),
  })).optional(),
  options: z.array(z.object({
    name: z.string().min(1, "Option name is required"),
    values: z.array(z.object({
      value: z.string().min(1, "Option value is required"),
    })).min(1, "At least one option value is required"),
  })).optional(),
  variants: z.array(z.object({
    sku: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    optionValues: z.array(z.object({
      optionName: z.string(),
      value: z.string(),
    })),
  })).optional(),
});
type ProductFormValues = z.infer<typeof productFormSchema>;

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
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!tenant?.id) return;
    const fetchCategories = async () => {
      try {
        const response = await getCategories(tenant.id);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, [tenant?.id]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      status: product?.status || "DRAFT",
      categoryIds: product?.categoryIds || [],
      media: product?.media || [],
      options: product?.options || [],
      variants: product?.variants || [],
    },
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control: form.control,
    name: "media",
  });

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = async (values: ProductFormValues) => {
    if (!tenant) {
      toast.error("No tenant selected. Cannot save product.");
      return;
    }

    try {
      if (product) {
        await updateProduct(tenant.id, product.id, values);
      } else {
        await createProduct(tenant.id, values);
      }
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="variants-options">Variants & Options</TabsTrigger>
            <TabsTrigger value="pricing-inventory">Pricing & Inventory</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="mt-4">
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <Controller name="name" control={form.control} render={({ field }) => <Input {...field} onChange={(e) => { field.onChange(e); form.setValue("slug", generateSlug(e.target.value)); }} />} />
                  <FieldError>{form.formState.errors.name?.message}</FieldError>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>URL Slug</FieldLabel>
                <FieldContent>
                  <Controller name="slug" control={form.control} render={({ field }) => <Input {...field} />} />
                  <FieldError>{form.formState.errors.slug?.message}</FieldError>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Controller name="description" control={form.control} render={({ field }) => <Textarea {...field} />} />
                  <FieldError>{form.formState.errors.description?.message}</FieldError>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>{form.formState.errors.status?.message}</FieldError>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Categories</FieldLabel>
                <FieldContent>
                  <Controller
                    name="categoryIds"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          const currentCategories = field.value || [];
                          if (currentCategories.includes(value)) {
                            field.onChange(currentCategories.filter((id) => id !== value));
                          } else {
                            field.onChange([...currentCategories, value]);
                          }
                        }}
                        value={field.value && field.value.length > 0 ? "selected" : ""} // Dummy value to show something is selected
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                <Checkbox
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    const currentCategories = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentCategories, category.id]);
                                    } else {
                                      field.onChange(currentCategories.filter((id) => id !== category.id));
                                    }
                                  }}
                                  className="mr-2"
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>{form.formState.errors.categoryIds?.message}</FieldError>
                </FieldContent>
              </Field>
            </form>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="mt-4">
            <div className="space-y-4">
              {mediaFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Field className="flex-grow">
                    <FieldLabel>Image URL</FieldLabel>
                    <FieldContent>
                      <Controller name={`media.${index}.url`} control={form.control} render={({ field }) => <Input {...field} />} />
                      <FieldError>{form.formState.errors.media?.[index]?.url?.message}</FieldError>
                    </FieldContent>
                  </Field>
                  <Field className="flex-grow">
                    <FieldLabel>Alt Text</FieldLabel>
                    <FieldContent>
                      <Controller name={`media.${index}.altText`} control={form.control} render={({ field }) => <Input {...field} />} />
                      <FieldError>{form.formState.errors.media?.[index]?.altText?.message}</FieldError>
                    </FieldContent>
                  </Field>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeMedia(index)} className="mt-6">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendMedia({ url: "", altText: "" })}>
                <Plus className="mr-2 h-4 w-4" /> Add Media
              </Button>
            </div>
          </TabsContent>

          {/* Variants & Options Tab */}
          <TabsContent value="variants-options" className="mt-4">
            <div className="space-y-4">
              {optionFields.map((optionField, optionIndex) => (
                <div key={optionField.id} className="border p-4 rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <Field className="flex-grow">
                      <FieldLabel>Option Name</FieldLabel>
                      <FieldContent>
                        <Controller name={`options.${optionIndex}.name`} control={form.control} render={({ field }) => <Input {...field} />} />
                        <FieldError>{form.formState.errors.options?.[optionIndex]?.name?.message}</FieldError>
                      </FieldContent>
                    </Field>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeOption(optionIndex)} className="ml-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 pl-4">
                    <FieldLabel>Option Values</FieldLabel>
                    <Controller
                      name={`options.${optionIndex}.values`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((valueField: any, valueIndex: number) => (
                            <div key={valueIndex} className="flex items-center space-x-1">
                              <Input
                                value={valueField.value}
                                onChange={(e) => {
                                  const newValues = [...field.value];
                                  newValues[valueIndex].value = e.target.value;
                                  field.onChange(newValues);
                                }}
                                className="w-auto"
                              />
                              <Button type="button" variant="ghost" size="icon" onClick={() => {
                                const newValues = [...field.value];
                                newValues.splice(valueIndex, 1);
                                field.onChange(newValues);
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={() => {
                            field.onChange([...field.value, { value: "" }]);
                          }}>
                            <Plus className="mr-1 h-3 w-3" /> Add Value
                          </Button>
                        </div>
                      )}
                    />
                    <FieldError>{form.formState.errors.options?.[optionIndex]?.values?.message}</FieldError>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendOption({ name: "", values: [{ value: "" }] })}>
                <Plus className="mr-2 h-4 w-4" /> Add Option
              </Button>
              <Button type="button" onClick={() => {
                const currentOptions = form.getValues("options");
                if (!currentOptions || currentOptions.length === 0) {
                  toast.error("Please define at least one option to generate variants.");
                  return;
                }

                let generatedVariants: ProductVariant[] = [];

                // Function to generate combinations recursively
                const generateCombinations = (optionIndex: number, currentCombination: { optionName: string; value: string }[]) => {
                  if (optionIndex === currentOptions.length) {
                    generatedVariants.push({
                      price: 0, // Default price
                      stock: 0, // Default stock
                      optionValues: currentCombination,
                    });
                    return;
                  }

                  const currentOption = currentOptions[optionIndex];
                  currentOption.values.forEach(optionValue => {
                    generateCombinations(optionIndex + 1, [...currentCombination, { optionName: currentOption.name, value: optionValue.value }]);
                  });
                };

                generateCombinations(0, []);
                form.setValue("variants", generatedVariants);
                toast.success(`${generatedVariants.length} variants generated.`);
              }}>
                Generate Variants
              </Button>
            </div>
          </TabsContent>

          {/* Pricing & Inventory Tab */}
          <TabsContent value="pricing-inventory" className="mt-4">
            <div className="space-y-4">
              {variantFields.length === 0 ? (
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                  <p>No variants generated yet.</p>
                  <p className="text-sm">Go to the "Variants & Options" tab to define options and generate variants.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {variantFields.map((variantField, index) => (
                        <tr key={variantField.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {variantField.optionValues.map(ov => ov.value).join(' / ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Controller name={`variants.${index}.sku`} control={form.control} render={({ field }) => <Input {...field} className="w-24" />} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Controller name={`variants.${index}.price`} control={form.control} render={({ field }) => <Input type="number" {...field} className="w-24" />} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Controller name={`variants.${index}.stock`} control={form.control} render={({ field }) => <Input type="number" {...field} className="w-24" />} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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