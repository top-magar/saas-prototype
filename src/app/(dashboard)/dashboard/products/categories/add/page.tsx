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
import { ArrowLeft, Save } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().default(true),
  parentCategory: z.string().optional(),
  sortOrder: z.number().min(0).default(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const existingCategories = [
  { id: "1", name: "Electronics", slug: "electronics" },
  { id: "2", name: "Clothing", slug: "clothing" },
  { id: "3", name: "Home & Garden", slug: "home-garden" },
  { id: "4", name: "Books", slug: "books" },
];

export default function AddCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      isActive: true,
      parentCategory: "",
      sortOrder: 0,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!form.getValues("slug")) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating category:", values);
      toast.success("Category created successfully!");
      router.push("/dashboard/products/categories");
    } catch (error) {
      toast.error("Failed to create category");
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
          <h1 className="text-xl font-semibold md:text-2xl">Add New Category</h1>
          <p className="text-sm text-muted-foreground">Create a new product category</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details for your category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Category Name</FieldLabel>
                <FieldContent>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., Electronics, Clothing"
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    )}
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
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Brief description of this category"
                        rows={3}
                      />
                    )}
                  />
                  <FieldError>{form.formState.errors.description?.message}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>URL Slug</FieldLabel>
                <FieldContent>
                  <Controller
                    name="slug"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="category-url-slug"
                      />
                    )}
                  />
                  <FieldError>{form.formState.errors.slug?.message}</FieldError>
                </FieldContent>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Meta Title</FieldLabel>
                <FieldContent>
                  <Controller
                    name="metaTitle"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="SEO title for this category"
                      />
                    )}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Meta Description</FieldLabel>
                <FieldContent>
                  <Controller
                    name="metaDescription"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="SEO description for this category"
                        rows={2}
                      />
                    )}
                  />
                </FieldContent>
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <Controller
                      name="isActive"
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
                <FieldLabel>Parent Category</FieldLabel>
                <FieldContent>
                  <Controller
                    name="parentCategory"
                    control={form.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="">None (Top Level)</option>
                        {existingCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Sort Order</FieldLabel>
                <FieldContent>
                  <Controller
                    name="sortOrder"
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={form.watch("isActive") ? "default" : "secondary"}>
                    {form.watch("isActive") ? "Active" : "Inactive"}
                  </Badge>
                  {form.watch("parentCategory") && (
                    <Badge variant="outline">Sub-category</Badge>
                  )}
                </div>
                <div className="text-sm font-medium">
                  {form.watch("name") || "Category Name"}
                </div>
                <div className="text-xs text-muted-foreground">
                  /{form.watch("slug") || "category-slug"}
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