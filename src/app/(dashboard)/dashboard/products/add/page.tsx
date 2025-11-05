"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { useRef } from "react";
import Image from "next/image";

interface ProductForm {
  // Step 1: General Information
  name: string;
  channel: string;
  brand: string;
  categories: string[];
  description: string;
  longDescription: string;
  images: File[];
  
  // Step 2: Variants & Inventory
  variants: Array<{
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }>;
  
  // Step 3: Custom Fields
  customFields: Array<{
    name: string;
    value: string;
    type: string;
  }>;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    channel: "All",
    brand: "",
    categories: [],
    description: "",
    longDescription: "",
    images: [],
    variants: [{ name: "Default", sku: "", price: 0, quantity: 0 }],
    customFields: []
  });

  const steps = [
    { number: 1, title: "General Information" },
    { number: 2, title: "Variants & Inventory" },
    { number: 3, title: "Custom Fields" }
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
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

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: "", sku: "", price: 0, quantity: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { name: "", value: "", type: "text" }]
    }));
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          placeholder="eg: Red Doko Styled T-shirt"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel">Product Channel *</Label>
        <Select value={formData.channel} onValueChange={(value) => setFormData(prev => ({ ...prev, channel: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Store">Store</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select product brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select product categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Product Description *</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
        {!formData.description && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">No description found</p>
            <p className="mt-1">Good & converting description contains:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Solutions to customer pain points.</li>
              <li>Simple language that highlights value.</li>
              <li>Clear and concise key features and benefits.</li>
              <li>Context to help customers imagine using the product.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description *</Label>
        <Textarea
          id="longDescription"
          rows={6}
          value={formData.longDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
        />
        {!formData.longDescription && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">No description found</p>
            <p className="mt-1">Good & converting description contains:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Solutions to customer pain points.</li>
              <li>Simple language that highlights value.</li>
              <li>Clear and concise key features and benefits.</li>
              <li>Context to help customers imagine using the product.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Product Images *</Label>
        <FileDropzone
          fileInputRef={fileInputRef}
          handleBoxClick={handleBoxClick}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleFileSelect={handleFileSelect}
        />
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Variants</h3>
        <Button type="button" onClick={addVariant} size="sm">
          Add Variant
        </Button>
      </div>
      
      {formData.variants.map((variant, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Variant Name</Label>
                <Input
                  placeholder="e.g., Red - Large"
                  value={variant.name}
                  onChange={(e) => {
                    const newVariants = [...formData.variants];
                    newVariants[index].name = e.target.value;
                    setFormData(prev => ({ ...prev, variants: newVariants }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  placeholder="PROD-001"
                  value={variant.sku}
                  onChange={(e) => {
                    const newVariants = [...formData.variants];
                    newVariants[index].sku = e.target.value;
                    setFormData(prev => ({ ...prev, variants: newVariants }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => {
                    const newVariants = [...formData.variants];
                    newVariants[index].price = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, variants: newVariants }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => {
                      const newVariants = [...formData.variants];
                      newVariants[index].quantity = parseInt(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, variants: newVariants }));
                    }}
                  />
                  {formData.variants.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeVariant(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Custom Fields</h3>
        <Button type="button" onClick={addCustomField} size="sm">
          Add Field
        </Button>
      </div>
      
      {formData.customFields.map((field, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Field Name</Label>
                <Input
                  placeholder="e.g., Material"
                  value={field.name}
                  onChange={(e) => {
                    const newFields = [...formData.customFields];
                    newFields[index].name = e.target.value;
                    setFormData(prev => ({ ...prev, customFields: newFields }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Field Value</Label>
                <Input
                  placeholder="e.g., Cotton"
                  value={field.value}
                  onChange={(e) => {
                    const newFields = [...formData.customFields];
                    newFields[index].value = e.target.value;
                    setFormData(prev => ({ ...prev, customFields: newFields }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Field Type</Label>
                <div className="flex gap-2">
                  <Select
                    value={field.type}
                    onValueChange={(value) => {
                      const newFields = [...formData.customFields];
                      newFields[index].type = value;
                      setFormData(prev => ({ ...prev, customFields: newFields }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newFields = formData.customFields.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, customFields: newFields }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {formData.customFields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No custom fields added yet.</p>
          <p className="text-sm">Click "Add Field" to create custom product attributes.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Product
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Follow the steps below to add your product</p>
          </div>
        </div>

        {/* Sidebar + Content Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Step Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border">
                <h3 className="font-semibold mb-6 text-center">Progress</h3>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.number} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                        currentStep === step.number
                          ? 'bg-blue-500 text-white shadow-lg scale-110'
                          : currentStep > step.number
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {currentStep > step.number ? '✓' : step.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Step {step.number} of {steps.length}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border overflow-hidden">
              {/* Step Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-8 py-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {steps[currentStep - 1].title}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Step {currentStep} of {steps.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Completion</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((currentStep / steps.length) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="max-w-2xl mx-auto">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </div>
              </div>

              {/* Footer Navigation */}
              <div className="bg-gray-50 dark:bg-slate-700/50 px-8 py-6 border-t">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="px-6"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {currentStep < 3 ? (
                    <Button type="button" onClick={handleNext} className="px-6">
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Product'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}