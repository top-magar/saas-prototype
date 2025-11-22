"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/ui/file-dropzone";
import Image from "next/image";
import { useCurrency } from "@/hooks/use-currency";

interface ProductForm {
  name: string;
  channel: string;
  brand: string;
  categories: string[];
  description: string;
  images: File[];
  sku: string;
  price: string;
  stock: string;
}

const brands = [
  { id: "1", name: "Nike" },
  { id: "2", name: "Adidas" },
  { id: "3", name: "Apple" },
  { id: "4", name: "Samsung" },
];

const categories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Home & Garden" },
  { id: "4", name: "Sports" },
];

export default function AddProductPage() {
  const router = useRouter();
  const { currency } = useCurrency();
  // Simple map for symbol display
  const getSymbol = (code: string) => {
    const symbols: Record<string, string> = {
      NPR: 'Rs', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$', CHF: 'Fr', CNY: '¥', INR: '₹', AED: 'د.إ', BRL: 'R$', KRW: '₩', MXN: '$', SGD: '$'
    };
    return symbols[code] || code;
  };
  const currencySymbol = getSymbol(currency);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    channel: "All",
    brand: "",
    categories: [],
    description: "",
    images: [],
    sku: "",
    price: "",
    stock: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Product created successfully!");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 4 * 1024 * 1024) {
          toast.error('File size must be less than 4MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-3 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">Add Product</h1>
            <p className="text-sm text-muted-foreground mt-1">Create a new product for your catalog</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-4 md:space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg">Basic Information</CardTitle>
              <CardDescription className="text-xs md:text-sm">Essential details about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Premium Cotton T-Shirt"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {/* Channel & Brand */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="channel">Sales Channel *</Label>
                  <Select value={formData.channel} onValueChange={(value) => setFormData(prev => ({ ...prev, channel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Channels</SelectItem>
                      <SelectItem value="Online">Online Only</SelectItem>
                      <SelectItem value="Store">In-Store Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the product features, benefits, and specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Include key features, materials, dimensions, and unique selling points
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg">Product Images</CardTitle>
              <CardDescription className="text-xs md:text-sm">Upload product photos (max 5 images, 4MB each)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileDropzone
                fileInputRef={fileInputRef}
                handleBoxClick={() => fileInputRef.current?.click()}
                handleDragOver={(e) => e.preventDefault()}
                handleDrop={(e) => {
                  e.preventDefault();
                  handleFileSelect(e.dataTransfer.files);
                }}
                handleFileSelect={handleFileSelect}
                multiple
              />

              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group aspect-square">
                      <Image
                        src={img}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg">Pricing & Inventory</CardTitle>
              <CardDescription className="text-xs md:text-sm">Set price and manage stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="e.g., TSH-001-BLK-M"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ({currencySymbol}) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky Footer Actions */}
          <div className="fixed md:sticky bottom-0 left-0 right-0 bg-background border-t p-4 md:border-0 md:p-0 z-40">
            <div className="flex gap-3 justify-end max-w-4xl mx-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}