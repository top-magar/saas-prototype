import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorLogger } from './error-logger';

// Server-side API utilities
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status });
}

export async function validateRequest(req: NextRequest, requiredFields: string[]) {
  try {
    const body = await req.json();
    const missing = requiredFields.filter(field => !body[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return body;
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

// Server-only database operations with fallback
export async function getProductsForTenant(tenantId: string) {
  try {
    // Try to use Prisma if available
    const { prisma } = await import('@/lib/prisma').catch(() => ({ prisma: null }));
    
    if (prisma) {
      const products = await prisma.product.findMany({
        where: { tenantId },
        include: {
          media: true,
          categories: true,
          variants: true,
          options: {
            include: {
              values: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return products;
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
    // Try to use Prisma if available
    const { prisma } = await import('@/lib/prisma').catch(() => ({ prisma: null }));
    
    if (prisma) {
      const categories = await prisma.category.findMany({
        where: { tenantId },
        orderBy: { name: 'asc' }
      });
      return categories;
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
    // Try to use Prisma if available
    const { prisma } = await import('@/lib/prisma').catch(() => ({ prisma: null }));
    
    if (prisma) {
      const dateFilter = getDateFilter(timeRange);
      
      const [totalSales, revenue, customers] = await Promise.all([
        prisma.order.count({
          where: { tenantId, createdAt: dateFilter }
        }),
        prisma.order.aggregate({
          where: { tenantId, createdAt: dateFilter },
          _sum: { total: true }
        }),
        prisma.user.count({
          where: { tenantId, createdAt: dateFilter }
        })
      ]);
      
      return {
        totalSales,
        revenue: revenue._sum.total || 0,
        customers
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