import { currentUser } from '@clerk/nextjs/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ErrorBoundary } from '@/components/error-boundary';
import Link from "next/link";
import ProductsClient from './products-client';
import { getProductsForTenant, getCategoriesForTenant } from '@/lib/server-only-utils';

export default async function ProductsPage() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Try multiple ways to get tenant ID
  const tenantId = (user.publicMetadata?.tenantId as string) || 
                   (user.privateMetadata?.tenantId as string) || 
                   user.id; // Fallback to user ID
  
  console.log('User:', user.id, 'TenantId:', tenantId); // Debug log

  let products = null;
  let categories = null;
  let hasError = false;

  try {
    [products, categories] = await Promise.all([
      getProductsForTenant(tenantId),
      getCategoriesForTenant(tenantId)
    ]);
  } catch {
    hasError = true;
  }

  if (hasError) {
    return (
      
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <h1 className="text-xl font-semibold md:text-2xl">Products</h1>
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-muted-foreground">Failed to load products</p>
              </div>
            </CardContent>
          </Card>
        </div>
      
    );
  }

  if (!products || products.length === 0) {
    return (
      
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold md:text-2xl">Products</h1>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No Products Found</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t added any products yet. Get started by adding your first one.
                  </EmptyDescription>
                </EmptyHeader>
                <Link href="/dashboard/products/add">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </Link>
              </Empty>
            </CardContent>
          </Card>
        </div>
      
    );
  }

  return (
    
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>Manage all your products and their details.</CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <ProductsClient initialProducts={products} categories={categories || []} />
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    
  );
}
