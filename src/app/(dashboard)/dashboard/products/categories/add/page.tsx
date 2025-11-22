"use client";

import { useState, useRef } from "react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/ui/file-dropzone";
import Image from "next/image";

interface CategoryForm {
  name: string;
  image: File | null;
  seoTitle: string;
  seoDescription: string;
  seoImage: File | null;
  hideOnProductPages: boolean;
}

export default function AddCategoryPage() {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const seoImageInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryImage, setCategoryImage] = useState<string>("");
  const [seoImagePreview, setSeoImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    image: null,
    seoTitle: "",
    seoDescription: "",
    seoImage: null,
    hideOnProductPages: false
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Category created successfully!");
      router.push("/dashboard/products/categories");
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (files: FileList | null, type: 'category' | 'seo') => {
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 4 * 1024 * 1024) {
        toast.error('File size must be less than 4MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'category') {
          setCategoryImage(result);
          setFormData(prev => ({ ...prev, image: file }));
        } else {
          setSeoImagePreview(result);
          setFormData(prev => ({ ...prev, seoImage: file }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type: 'category' | 'seo') => {
    if (type === 'category') {
      setCategoryImage("");
      setFormData(prev => ({ ...prev, image: null }));
    } else {
      setSeoImagePreview("");
      setFormData(prev => ({ ...prev, seoImage: null }));
    }
  };

  return (
    <PageWrapper className="min-h-screen from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-semibold md:text-2xl">
              Add Category
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Create a new product category</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Category Information
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fill in the details for your new category
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="eg. Clothing"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Category Image */}
                <div className="space-y-2">
                  <Label>Category Image *</Label>
                  <p className="text-sm text-muted-foreground">Ratio depends on your store setting</p>
                  <FileDropzone
                    fileInputRef={imageInputRef}
                    handleBoxClick={() => imageInputRef.current?.click()}
                    handleDragOver={(e) => e.preventDefault()}
                    handleDrop={(e) => {
                      e.preventDefault();
                      handleImageSelect(e.dataTransfer.files, 'category');
                    }}
                    handleFileSelect={(files) => handleImageSelect(files, 'category')}
                  />
                  {categoryImage && (
                    <div className="relative inline-block mt-4">
                      <Image
                        src={categoryImage}
                        alt="Category"
                        width={200}
                        height={200}
                        className="w-48 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('category')}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* SEO Title */}
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <p className="text-sm text-muted-foreground">Shown in search engine results (40-60 characters).</p>
                  <Input
                    id="seoTitle"
                    placeholder="eg. Blanxer - Shop Clothing Online"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.seoTitle.length}/60 characters
                  </div>
                </div>

                {/* SEO Description */}
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <p className="text-sm text-muted-foreground">Summarized details (140-160 characters).</p>
                  <Textarea
                    id="seoDescription"
                    rows={3}
                    placeholder="eg. Shop the latest clothing trends with secure delivery."
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    {formData.seoDescription.length}/160 characters
                  </div>
                </div>

                {/* SEO Image */}
                <div className="space-y-2">
                  <Label>SEO Image</Label>
                  <p className="text-sm text-muted-foreground">
                    Displayed when your page link is shared on social platforms. Recommended dimensions: 1200 x 630
                  </p>
                  <FileDropzone
                    fileInputRef={seoImageInputRef}
                    handleBoxClick={() => seoImageInputRef.current?.click()}
                    handleDragOver={(e) => e.preventDefault()}
                    handleDrop={(e) => {
                      e.preventDefault();
                      handleImageSelect(e.dataTransfer.files, 'seo');
                    }}
                    handleFileSelect={(files) => handleImageSelect(files, 'seo')}
                  />
                  {seoImagePreview && (
                    <div className="relative inline-block mt-4">
                      <Image
                        src={seoImagePreview}
                        alt="SEO"
                        width={300}
                        height={157}
                        className="w-72 h-36 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('seo')}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Hide on Product Pages */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hideOnProductPages"
                    checked={formData.hideOnProductPages}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, hideOnProductPages: checked as boolean }))
                    }
                  />
                  <Label htmlFor="hideOnProductPages">Hide on product pages</Label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-slate-700/50 px-8 py-6 border-t">
              <div className="flex justify-between items-center max-w-2xl mx-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-6"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name.trim()}
                  className="px-6"
                >
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}