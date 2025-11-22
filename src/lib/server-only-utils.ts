import 'server-only';
import { ErrorLogger } from './shared/error-logger';
import { NextResponse } from 'next/server';

// Error response helper for API routes
export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

// Error object helper for auth middleware
export function createAuthError(message: string, status: number = 500) {
  return { error: message, status };
}

// Server-only database operations with fallback
export async function getProductsForTenant(tenantId: string) {
  try {
    // Try to use Supabase if available
    const { supabase } = await import("./database/supabase").catch(() => ({ supabase: null }));

    if (supabase) {
      const { data: products } = await supabase
        .from('products')
        .select(`
          *,
          media(*),
          product_variants(*)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      return products || [];
    }

    // Fallback: Return mock data for development
    return [
      {
        id: '1',
        name: 'Sample Product 1',
        slug: 'sample-product-1',
        description: 'This is a sample product for testing',
        status: 'PUBLISHED' as const,
        createdAt: new Date().toISOString(),
        media: [{ id: '1', url: '/placeholder.svg', altText: 'Sample product', order: 1 }],
        categories: [{ id: '1', name: 'Electronics' }],
        variants: [{ id: '1', sku: 'SP1', price: 99.99, stock: 10, optionValues: [] }],
        options: []
      },
      {
        id: '2',
        name: 'Sample Product 2',
        slug: 'sample-product-2',
        description: 'Another sample product',
        status: 'DRAFT' as const,
        createdAt: new Date().toISOString(),
        media: [{ id: '2', url: '/placeholder.svg', altText: 'Sample product 2', order: 1 }],
        categories: [{ id: '2', name: 'Clothing' }],
        variants: [{ id: '2', sku: 'SP2', price: 49.99, stock: 5, optionValues: [] }],
        options: []
      }
    ];
  } catch (error) {
    ErrorLogger.logServerError(error as Error, {
      function: 'getProductsForTenant',
      tenantId
    });
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

export async function getCategoriesForTenant(tenantId: string) {
  try {
    // Try to use Supabase if available
    const { supabase } = await import("./database/supabase").catch(() => ({ supabase: null }));

    if (supabase) {
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true });
      return categories || [];
    }

    // Fallback: Return mock categories
    return [
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Clothing' },
      { id: '3', name: 'Books' },
      { id: '4', name: 'Home & Garden' }
    ];
  } catch (error) {
    ErrorLogger.logServerError(error as Error, {
      function: 'getCategoriesForTenant',
      tenantId
    });
    return [];
  }
}

// Server-only analytics calculations
export async function calculateAnalytics(tenantId: string, timeRange: string) {
  try {
    // Try to use Supabase if available
    const { supabase } = await import("./database/supabase").catch(() => ({ supabase: null }));

    if (supabase) {
      const dateFilter = getDateFilter(timeRange);

      const [salesResult, revenueResult, customersResult] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).gte('created_at', dateFilter.gte.toISOString()),
        supabase.from('orders').select('total').eq('tenant_id', tenantId).gte('created_at', dateFilter.gte.toISOString()),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId).gte('created_at', dateFilter.gte.toISOString())
      ]);

      const revenue = revenueResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      return {
        totalSales: salesResult.count || 0,
        revenue,
        customers: customersResult.count || 0
      };
    }

    // Fallback: Return mock analytics data
    return {
      totalSales: 42,
      revenue: 12500,
      customers: 28
    };
  } catch (error) {
    ErrorLogger.logServerError(error as Error, {
      function: 'calculateAnalytics',
      tenantId,
      timeRange
    });
    // Return fallback data instead of throwing
    return {
      totalSales: 0,
      revenue: 0,
      customers: 0
    };
  }
}

function getDateFilter(timeRange: string) {
  const now = new Date();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return {
    gte: startDate
  };
}