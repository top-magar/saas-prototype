"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ProductsClient from './products-client';
import { AddProductSheet } from "./_components/add-product-sheet";

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdAt: string;
    media: Array<{ id?: string; url: string; altText?: string; order?: number }>;
    options: Array<{ id?: string; name: string; values: Array<{ id?: string; value: string }> }>;
    variants: Array<{ id?: string; sku?: string; price: number; stock: number; optionValues: Array<{ optionName: string; value: string }> }>;
    categories: Array<{ id: string; name: string }>;
}

interface Category {
    id: string;
    name: string;
}

interface ProductsPageClientProps {
    initialProducts: Product[];
    categories: Category[];
}

export default function ProductsPageClient({ initialProducts, categories }: ProductsPageClientProps) {
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            {/* Header with Add Product Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold md:text-2xl">Product Catalog</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your products and inventory</p>
                </div>
                <Button onClick={() => setIsAddProductOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Products List */}
            <ProductsClient initialProducts={initialProducts} categories={categories} />

            {/* Add Product Sheet */}
            <AddProductSheet
                open={isAddProductOpen}
                onOpenChange={setIsAddProductOpen}
                onSuccess={() => {
                    // Refresh products list if needed
                }}
            />
        </div>
    );
}
