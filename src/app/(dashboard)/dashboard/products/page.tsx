import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { ErrorBoundary } from '@/components/error-boundary';
import ProductsClient from './products-client';
import { AddProductButton } from './add-product-button';
import { getProductsForTenant, getCategoriesForTenant } from '@/lib/server-only-utils';

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Try multiple ways to get tenant ID
  const tenantId = ((user as any)?.publicMetadata?.tenantId as string) ||
    ((user as any)?.privateMetadata?.tenantId as string) ||
    (user as any)?.id; // Fallback to user ID

  console.log('User:', (user as any).id, 'TenantId:', tenantId); // Debug log

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
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No Products Found</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t added any products yet. Get started by adding your first one.
                </EmptyDescription>
              </EmptyHeader>
              <AddProductButton />
            </Empty>
          </CardContent>
        </Card>
      </div>

    );
  }

  return (

    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>Manage all your products and their details.</CardDescription>
          </div>
          <AddProductButton />
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
