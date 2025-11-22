'use client';
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, LayoutGrid, List, Package, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { DeleteButton } from "./delete-button";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/hooks/use-currency";

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

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { formatCurrency } = useCurrency();

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" ||
        product.categories.some(cat => cat.id === filterCategory);
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchTerm, filterCategory]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = initialProducts.length;
    const published = initialProducts.filter(p => p.status === 'PUBLISHED').length;
    const totalValue = initialProducts.reduce((sum, p) => {
      const price = p.variants[0]?.price || 0;
      const stock = p.variants[0]?.stock || 0;
      return sum + (price * stock);
    }, 0);
    const lowStock = initialProducts.filter(p => {
      const stock = p.variants[0]?.stock || 0;
      return stock > 0 && stock < 10;
    }).length;

    return { total, published, totalValue, lowStock };
  }, [initialProducts]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 md:p-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across {categories.length} categories
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Published
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.published / stats.total) * 100) || 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold">
              {formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-warning">
              {stats.lowStock}
            </div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Category Filter */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {/* View Toggle */}
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="text-sm text-muted-foreground">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="aspect-square bg-muted relative">
                {product.media[0]?.url ? (
                  <Image
                    src={product.media[0].url}
                    alt={product.media[0].altText || product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  className="absolute top-2 right-2"
                  variant={product.status === 'PUBLISHED' ? 'default' : product.status === 'DRAFT' ? 'secondary' : 'destructive'}
                >
                  {product.status}
                </Badge>
              </div>

              {/* Card Content */}
              <CardHeader className="pb-2">
                <CardTitle className="text-base truncate">{product.name}</CardTitle>
                <CardDescription className="text-xs truncate">
                  {product.categories.map(c => c.name).join(', ') || 'Uncategorized'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold">
                    {formatCurrency(product.variants[0]?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stock</span>
                  <span className={`font-medium ${(product.variants[0]?.stock || 0) < 10 ? 'text-warning' : ''}`}>
                    {product.variants[0]?.stock || 0}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/dashboard/products/${product.id}/edit`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <DeleteButton
                    productId={product.id}
                    productName={product.name}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Image */}
                <div className="w-full sm:w-16 h-16 bg-muted rounded flex-shrink-0 relative overflow-hidden">
                  {product.media[0]?.url ? (
                    <Image
                      src={product.media[0].url}
                      alt={product.media[0].altText || product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {product.categories.map(cat => cat.name).join(', ') || 'Uncategorized'}
                  </p>
                </div>

                {/* Price & Stock */}
                <div className="flex sm:flex-col gap-4 sm:gap-1 sm:items-end">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Price: </span>
                    <span className="font-bold">{formatCurrency(product.variants[0]?.price || 0)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Stock: </span>
                    <span className={`font-medium ${(product.variants[0]?.stock || 0) < 10 ? 'text-warning' : ''}`}>
                      {product.variants[0]?.stock || 0}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Badge
                    variant={product.status === 'PUBLISHED' ? 'default' : product.status === 'DRAFT' ? 'secondary' : 'destructive'}
                    className="whitespace-nowrap"
                  >
                    {product.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}