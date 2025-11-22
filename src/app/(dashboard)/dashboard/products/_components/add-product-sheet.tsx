"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/hooks/use-currency";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Upload, Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FileDropzone } from "@/components/ui/file-dropzone";
import Image from "next/image";

interface AddProductSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface ProductForm {
    name: string;
    brand: string;
    brandCustom: string;
    channel: string;
    category: string;
    description: string;
    sku: string;
    price: string;
    compareAtPrice: string;
    cost: string;
    stock: string;
    barcode: string;
    weight: string;
    vendor: string;
    seoTitle: string;
    seoDescription: string;
}

interface Variant {
    name: string;
    value: string;
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

export function AddProductSheet({ open, onOpenChange, onSuccess }: AddProductSheetProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { currency } = useCurrency();

    const getSymbol = (code: string) => {
        const symbols: Record<string, string> = {
            NPR: 'Rs', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$', CHF: 'Fr', CNY: '¥', INR: '₹', AED: 'د.إ', BRL: 'R$', KRW: '₩', MXN: '$', SGD: '$'
        };
        return symbols[code] || code;
    };
    const currencySymbol = getSymbol(currency);

    const [activeTab, setActiveTab] = useState("general");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [variants, setVariants] = useState<Variant[]>([{ name: "", value: "" }]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<ProductForm>({
        name: "",
        brand: "",
        brandCustom: "",
        channel: "All",
        category: "",
        description: "",
        sku: "",
        price: "",
        compareAtPrice: "",
        cost: "",
        stock: "",
        barcode: "",
        weight: "",
        vendor: "",
        seoTitle: "",
        seoDescription: "",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            brand: "",
            brandCustom: "",
            channel: "All",
            category: "",
            description: "",
            sku: "",
            price: "",
            compareAtPrice: "",
            cost: "",
            stock: "",
            barcode: "",
            weight: "",
            vendor: "",
            seoTitle: "",
            seoDescription: "",
        });
        setUploadedImages([]);
        setImageUrls([""]);
        setVariants([{ name: "", value: "" }]);
        setErrors({});
        setActiveTab("general");
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid price is required";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Product created successfully!");
            resetForm();
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof ProductForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
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

    const removeUploadedImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrlField = () => {
        setImageUrls(prev => [...prev, ""]);
    };

    const removeImageUrlField = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: 'name' | 'value', value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants(prev => [...prev, { name: "", value: "" }]);
    };

    const removeVariant = (index: number) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const tabs = [
        { id: "general", label: "General" },
        { id: "pricing", label: "Pricing & Inventory" },
        { id: "media", label: "Media" },
        { id: "seo", label: "SEO" },
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                    <SheetTitle className="text-2xl font-bold">Add Product</SheetTitle>
                    <SheetDescription className="text-sm mt-1">
                        Create and configure a new product listing
                    </SheetDescription>
                </SheetHeader>

                {/* Tabs */}
                <div className="flex gap-1 px-6 pt-4 border-b border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* General Tab */}
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <Label className="block text-sm font-semibold mb-2">Product Name *</Label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="e.g., Premium Wireless Headphones"
                                    className={`text-base ${errors.name ? "border-red-500" : ""}`}
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="block text-sm font-semibold mb-2">Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Describe your product details, features, and benefits..."
                                    rows={5}
                                    maxLength={500}
                                    className="resize-none"
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formData.description.length}/500 characters
                                </p>
                            </div>

                            {/* Category and Vendor */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-sm font-semibold mb-2">Category *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleChange("category", value)}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                                    )}
                                </div>

                                <div>
                                    <Label className="block text-sm font-semibold mb-2">Vendor</Label>
                                    <Input
                                        type="text"
                                        value={formData.vendor}
                                        onChange={(e) => handleChange("vendor", e.target.value)}
                                        placeholder="Brand or vendor name"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Brand and Channel */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-sm font-semibold mb-2">Brand</Label>
                                    <Select
                                        value={formData.brand}
                                        onValueChange={(value) => handleChange("brand", value)}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="block text-sm font-semibold mb-2">Sales Channel *</Label>
                                    <Select
                                        value={formData.channel}
                                        onValueChange={(value) => handleChange("channel", value)}
                                        disabled={isSubmitting}
                                    >
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
                            </div>
                        </div>
                    )}

                    {/* Pricing & Inventory Tab */}
                    {activeTab === "pricing" && (
                        <div className="space-y-6">
                            <Card className="p-4 bg-muted/30 border-border">
                                <h3 className="text-sm font-semibold mb-4">Pricing</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label className="block text-xs font-medium mb-2">
                                            Price ({currencySymbol}) *
                                        </Label>
                                        <div className="flex items-center">
                                            <span className="text-muted-foreground mr-2">{currencySymbol}</span>
                                            <Input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => handleChange("price", e.target.value)}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                className={`flex-1 ${errors.price ? "border-red-500" : ""}`}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        {errors.price && (
                                            <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="block text-xs font-medium mb-2">Compare at Price</Label>
                                        <div className="flex items-center">
                                            <span className="text-muted-foreground mr-2">{currencySymbol}</span>
                                            <Input
                                                type="number"
                                                value={formData.compareAtPrice}
                                                onChange={(e) => handleChange("compareAtPrice", e.target.value)}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="block text-xs font-medium mb-2">Cost per Item</Label>
                                        <div className="flex items-center">
                                            <span className="text-muted-foreground mr-2">{currencySymbol}</span>
                                            <Input
                                                type="number"
                                                value={formData.cost}
                                                onChange={(e) => handleChange("cost", e.target.value)}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 bg-muted/30 border-border">
                                <h3 className="text-sm font-semibold mb-4">Inventory</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label className="block text-xs font-medium mb-2">SKU</Label>
                                        <Input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => handleChange("sku", e.target.value)}
                                            placeholder="e.g., PROD-001"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <Label className="block text-xs font-medium mb-2">Barcode</Label>
                                        <Input
                                            type="text"
                                            value={formData.barcode}
                                            onChange={(e) => handleChange("barcode", e.target.value)}
                                            placeholder="UPC/Barcode"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <Label className="block text-xs font-medium mb-2">Stock Quantity</Label>
                                        <Input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => handleChange("stock", e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </Card>

                            <div>
                                <Label className="block text-sm font-semibold mb-2">Weight (kg)</Label>
                                <Input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => handleChange("weight", e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === "media" && (
                        <div className="space-y-6">
                            <div>
                                <Label className="block text-sm font-semibold mb-4">Upload Images</Label>
                                <FileDropzone
                                    fileInputRef={fileInputRef}
                                    handleBoxClick={() => fileInputRef.current?.click()}
                                    handleDragOver={(e) => e.preventDefault()}
                                    handleDrop={(e) => {
                                        e.preventDefault();
                                        handleFileSelect(e.dataTransfer.files);
                                    }}
                                    handleFileSelect={handleFileSelect}
                                />

                                {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-4">
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
                                                    onClick={() => removeUploadedImage(index)}
                                                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="block text-sm font-semibold mb-4">Or Add Image URLs</Label>
                                <div className="space-y-3">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="flex gap-2">
                                            <div className="flex-1 flex items-center gap-2 p-3 border border-dashed border-border rounded-lg bg-muted/50">
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="border-0 bg-transparent"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            {imageUrls.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageUrlField(index)}
                                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addImageUrlField}
                                    className="mt-3 w-full py-2 px-3 border border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                    disabled={isSubmitting}
                                >
                                    <Plus className="h-4 w-4" /> Add Image URL
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === "seo" && (
                        <div className="space-y-6">
                            <div>
                                <Label className="block text-sm font-semibold mb-2">SEO Title</Label>
                                <Input
                                    type="text"
                                    value={formData.seoTitle}
                                    onChange={(e) => handleChange("seoTitle", e.target.value)}
                                    placeholder="Search engine title"
                                    maxLength={70}
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formData.seoTitle.length}/70 characters
                                </p>
                            </div>

                            <div>
                                <Label className="block text-sm font-semibold mb-2">SEO Description</Label>
                                <Textarea
                                    value={formData.seoDescription}
                                    onChange={(e) => handleChange("seoDescription", e.target.value)}
                                    placeholder="Search engine meta description"
                                    maxLength={160}
                                    rows={4}
                                    className="resize-none"
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formData.seoDescription.length}/160 characters
                                </p>
                            </div>

                            <Card className="p-4 bg-blue-500/5 border-blue-200/20">
                                <p className="text-sm text-foreground">
                                    <strong>Tip:</strong> Write compelling titles and descriptions to improve search
                                    visibility and click-through rates.
                                </p>
                            </Card>
                        </div>
                    )}
                </form>

                {/* Footer Actions */}
                <div className="flex gap-3 p-6 border-t border-border bg-background">
                    <Button
                        variant="outline"
                        onClick={() => {
                            resetForm();
                            onOpenChange(false);
                        }}
                        className="flex-1 bg-transparent"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
