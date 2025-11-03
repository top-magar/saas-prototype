"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Upload, Plus, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  comparePrice: z.number().optional(),
  costPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  inventory: z.object({
    trackQuantity: z.boolean().default(true),
    quantity: z.number().min(0).default(0),
    lowStockThreshold: z.number().min(0).default(5),
  }),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = [
  { id: "1", name: "Electronics", slug: "electronics" },
  { id: "2", name: "Clothing", slug: "clothing" },
  { id: "3", name: "Home & Garden", slug: "home-garden" },
  { id: "4", name: "Books", slug: "books" },
  { id: "5", name: "Sports", slug: "sports" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      sku: "",
      price: 0,
      comparePrice: 0,
      costPrice: 0,
      category: "",
      tags: [],
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      inventory: {
        trackQuantity: true,
        quantity: 0,
        lowStockThreshold: 5,
      },
      status: "DRAFT",
      featured: false,
      seoTitle: "",
      seoDescription: "",
    },
  });

  const generateSKU = (name: string) => {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "")
      .slice(0, 8) + "-" + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!form.getValues("sku")) {
      form.setValue("sku", generateSKU(name));
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags");
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const calculateMargin = () => {
    const price = form.watch("price");
    const cost = form.watch("costPrice");
    if (price && cost) {
      return (((price - cost) / price) * 100).toFixed(1);
    }
    return "0";
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating product:", values);
      toast.success("Product created successfully!");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Button size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Product Name</FieldLabel>
                <FieldContent>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., Premium Wireless Headphones"
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    )}
                  />
                  <FieldError>{form.formState.errors.name?.message}</FieldError>
                </FieldContent>
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>SKU</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="sku"
                      control={form.control}
                      render={({ field }) => (
                        <Input {...field} placeholder="PROD-001" />
                      )}
                    />
                    <FieldError>{form.formState.errors.sku?.message}</FieldError>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <FieldError>{form.formState.errors.category?.message}</FieldError>
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>Short Description</FieldLabel>
                <FieldContent>
                  <Controller
                    name="shortDescription"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Brief product summary"
                        rows={2}
                      />
                    )}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Detailed product description"
                        rows={4}
                      />
                    )}
                  />
                </FieldContent>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>Set pricing and manage stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel>Price</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="price"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                    <FieldError>{form.formState.errors.price?.message}</FieldError>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Compare Price</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="comparePrice"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Cost Price</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="costPrice"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel>Quantity</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="inventory.quantity"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      )}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Low Stock Alert</FieldLabel>
                  <FieldContent>
                    <Controller
                      name="inventory.lowStockThreshold"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      )}
                    />
                  </FieldContent>
                </Field>

                <div className="flex items-center justify-center">
                  <Badge variant="secondary">
                    Margin: {calculateMargin()}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product photos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-lg font-medium mb-2">
                  <span className="text-primary cursor-pointer hover:underline">Click to upload</span> or drag and drop
                </div>
                <div className="text-sm text-muted-foreground">
                  PNG, JPG or WebP (Max 5MB each)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    )}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Featured Product</FieldLabel>
                <FieldContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Featured</span>
                    <Controller
                      name="featured"
                      control={form.control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Track Inventory</FieldLabel>
                <FieldContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Track Quantity</span>
                    <Controller
                      name="inventory.trackQuantity"
                      control={form.control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </FieldContent>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("tags").map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={form.watch("status") === "PUBLISHED" ? "default" : "secondary"}>
                    {form.watch("status")}
                  </Badge>
                  {form.watch("featured") && (
                    <Badge variant="outline">Featured</Badge>
                  )}
                </div>
                <div className="text-sm font-medium">
                  {form.watch("name") || "Product Name"}
                </div>
                <div className="text-lg font-bold">
                  ${form.watch("price") || "0.00"}
                  {form.watch("comparePrice") > 0 && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ${form.watch("comparePrice")}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  SKU: {form.watch("sku") || "AUTO-GENERATED"}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}