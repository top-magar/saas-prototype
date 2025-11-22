import { supabase } from './supabase';
import { cacheGet, cacheSet } from '../cache/upstash-client';

// Optimized product queries with caching
export async function getProductsWithCache(tenantId: string, page = 1, limit = 20) {
  const cacheKey = `products:${tenantId}:${page}:${limit}`;

  // Try cache first
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  // Query with optimized select and pagination
  const { data: products, error, count } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      status,
      created_at,
      media!inner(url, alt_text),
      product_variants!inner(price, stock)
    `, { count: 'exact' })
    .eq('tenant_id', tenantId)
    .range((page - 1) * limit, page * limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const result = {
    products: products || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    }
  };

  // Cache for 5 minutes
  await cacheSet(cacheKey, result, 300);
  return result;
}

// Optimized tenant analytics with caching
export async function getTenantAnalytics(tenantId: string, timeRange = '30d') {
  const cacheKey = `analytics:${tenantId}:${timeRange}`;

  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const dateFilter = getDateFilter(timeRange);

  // Parallel queries for better performance
  let ordersResult, revenueResult, customersResult;
  try {
    [ordersResult, revenueResult, customersResult] = await Promise.all([
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('created_at', dateFilter.gte.toISOString()),

      supabase
        .from('orders')
        .select('total')
        .eq('tenant_id', tenantId)
        .eq('status', 'completed')
        .gte('created_at', dateFilter.gte.toISOString()),

      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('created_at', dateFilter.gte.toISOString())
    ]);
  } catch (error) {
    throw new Error(`Failed to fetch analytics data: ${error}`);
  }

  // Check for errors in parallel queries
  if (ordersResult.error) throw ordersResult.error;
  if (revenueResult.error) throw revenueResult.error;
  if (customersResult.error) throw customersResult.error;

  const analytics = {
    totalOrders: ordersResult.count || 0,
    revenue: revenueResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
    newCustomers: customersResult.count || 0,
    generatedAt: new Date().toISOString(),
  };

  // Cache for 15 minutes
  await cacheSet(cacheKey, analytics, 900);
  return analytics;
}

function getDateFilter(timeRange: string) {
  const now = new Date();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return { gte: startDate };
}