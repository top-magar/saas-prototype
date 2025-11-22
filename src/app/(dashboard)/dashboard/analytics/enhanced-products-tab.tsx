'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Package, TrendingUp, DollarSign, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";
import { CurrencyDisplay } from "@/components/currency-selector";

interface EnhancedProductsTabProps {
  data: {
    performance: Array<{ month: string; sales: number; units: number; profit: number; returns: number }>;
    topProducts: Array<{ id: number; name: string; sales: number; units: number; progress: number; margin: number }>;
    categories: Array<{ id: number; name: string; sales: number; count: number; growth: string; margin: number }>;
    inventory: { lowStock: number; outOfStock: number; totalProducts: number; avgStockLevel: number };
  };
}

const productPerformanceConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  units: { label: "Units Sold", color: "hsl(var(--chart-2))" },
  profit: { label: "Profit", color: "hsl(var(--chart-3))" },
};

export function EnhancedProductsTab({ data }: EnhancedProductsTabProps) {
  const totalSales = data.performance.reduce((sum, item) => sum + item.sales, 0);
  const totalUnits = data.performance.reduce((sum, item) => sum + item.units, 0);

  return (
    <div className="grid gap-6">
      {/* Product Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total Sales</div>
              <Badge variant="secondary" className="text-xs font-mono">+18%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold"><CurrencyDisplay amount={totalSales} /></div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Product Revenue</div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Units Sold</div>
              <Badge variant="secondary" className="text-xs font-mono">+12%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">{totalUnits.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Total Units</div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Avg Margin</div>
              <Badge variant="secondary" className="text-xs font-mono">+2.5%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">42%</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Profit Margin</div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Return Rate</div>
              <Badge variant="destructive" className="text-xs font-mono">-0.8%</Badge>
            </div>
            <div className="text-2xl font-mono font-bold">3.2%</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Product Returns</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart and Top Products */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              PERFORMANCE TRENDS
            </CardTitle>
            <CardDescription>Monthly sales, units, and profit tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={productPerformanceConfig} className="h-[300px]">
              <LineChart data={data.performance} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} className="text-xs font-mono" />
                <YAxis tickLine={false} axisLine={false} className="text-xs font-mono" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line dataKey="sales" type="monotone" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
                <Line dataKey="profit" type="monotone" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide flex items-center gap-2">
              <Package className="h-4 w-4" />
              TOP PRODUCTS
            </CardTitle>
            <CardDescription>Best performing products by sales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topProducts.map((product) => (
              <div key={product.id} className="space-y-3 p-3 border border-border/50 hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-mono font-medium">{product.name}</div>
                  <Badge variant="secondary" className="text-xs font-mono">{product.margin}% margin</Badge>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>Sales: <CurrencyDisplay amount={product.sales} /></span>
                  <span>Units: {product.units}</span>
                </div>
                <div className="space-y-1">
                  <Progress value={product.progress} className="h-2" />
                  <div className="text-xs font-mono text-muted-foreground">{product.progress}% of target</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Categories and Inventory */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">PRODUCT CATEGORIES</CardTitle>
            <CardDescription>Performance by category with margins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border border-border/50 hover:border-border transition-all">
                <div className="space-y-1">
                  <div className="text-sm font-mono font-medium">{category.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{category.count} products</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-mono font-bold"><CurrencyDisplay amount={category.sales} /></div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs font-mono">{category.margin}%</Badge>
                    <Badge variant={category.growth.startsWith('+') ? 'default' : 'destructive'} className="text-xs font-mono">
                      {category.growth}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-background border border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide">INVENTORY STATUS</CardTitle>
            <CardDescription>Stock levels and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              <div className="text-center p-4 border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
                <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-orange-600">{data.inventory.lowStock}</div>
                <div className="text-xs font-mono font-medium">Low Stock</div>
              </div>

              <div className="text-center p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-red-600">{data.inventory.outOfStock}</div>
                <div className="text-xs font-mono font-medium">Out of Stock</div>
              </div>

              <div className="text-center p-4 border border-border/50">
                <Package className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold">{data.inventory.totalProducts}</div>
                <div className="text-xs font-mono font-medium">Total Products</div>
              </div>

              <div className="text-center p-4 border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-green-600">{data.inventory.avgStockLevel}%</div>
                <div className="text-xs font-mono font-medium">Avg Stock Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}