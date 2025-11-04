import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma}  from '@/lib/prisma';
import { getTenant } from '@/lib/tenant';

async function getDashboardData() {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    let tenant;
    try {
      tenant = await getTenant();
    } catch (tenantError) {
      console.error('[TENANT_FETCH_ERROR]', tenantError);
      return { error: 'Failed to retrieve tenant' };
    }
    
    if (!tenant) {
      return { error: 'Tenant not found' };
    }

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalSales = await prisma.order.count({
      where: { tenantId: tenant.id },
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { tenantId: tenant.id, status: 'completed' },
      _sum: { total: true },
    });

    const activeCustomers = await prisma.user.count({
      where: { tenantId: tenant.id, lastLoginAt: { gte: lastWeek } },
    });

    const refundRequests = await prisma.payment.count({
      where: {
        order: { tenantId: tenant.id },
        status: 'refunded',
      },
    });

    const totalProfitData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        tenantId: tenant.id,
        status: 'completed',
      },
      _sum: {
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const recentOrders = await prisma.order.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true },
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { tenantId: tenant.id } },
      _sum: { subtotal: true },
      orderBy: { _sum: { subtotal: 'desc' } },
      take: 5,
    });

    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProducts.map((p) => p.productId),
        },
      },
    });

    const totalProductRevenue = topProducts.reduce(
      (sum, product) => sum + (product._sum.subtotal || 0), 
      0
    );

    return {
      stats: {
        totalSales,
        totalRevenue: totalRevenue._sum.total || 0,
        activeCustomers,
        refundRequests,
      },
      overview: totalProfitData.map((d) => ({
        month: d.createdAt.toLocaleString('default', { month: 'short' }),
        totalSales: totalSales,
        totalRevenue: d._sum.total,
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        product: 'Not available',
        customer: order.customerName || order.user?.name || 'N/A',
        date: order.createdAt.toLocaleDateString(),
        amount: order.total,
        status: order.status,
      })),
      topProducts: topProducts.map((p, index) => {
        const product = productDetails.find((pd) => pd.id === p.productId);
        const earnings = p._sum.subtotal || 0;
        
        const revenuePercentage = totalProductRevenue > 0 
          ? Math.round((earnings / totalProductRevenue) * 100)
          : 0;
        
        return {
          name: product?.name || `Product ${index + 1}`,
          percent: revenuePercentage,
          earnings: earnings,
          rank: index + 1,
        };
      }),
    };
  } catch (error) {
    console.error('[DASHBOARD_DATA_ERROR]', error);
    return { error: 'Failed to fetch dashboard data' };
  }
}

export async function GET() {
  try {
    let data;
    try {
      data = await getDashboardData();
    } catch (dataError) {
      console.error('[DASHBOARD_DATA_ERROR]', dataError);
      return NextResponse.json(
        { error: 'Failed to retrieve dashboard data' },
        { status: 500 }
      );
    }
    
    if ('error' in data) {
      console.error('[DASHBOARD_ERROR]', data.error);
      
      // Return appropriate status codes based on error type
      if (data.error === 'Unauthorized') {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      if (data.error === 'Tenant not found') {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
      }
      
      return NextResponse.json({ error: data.error }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Database connection errors
      if (error.message.includes('connect') || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again later.' },
          { status: 503 } // Service Unavailable
        );
      }
      
      // Prisma query errors
      if (error.message.includes('Invalid') || error.message.includes('constraint')) {
        return NextResponse.json(
          { error: 'Data validation error' },
          { status: 400 }
        );
      }
      
      // Permission/access errors
      if (error.message.includes('permission') || error.message.includes('access')) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }
    
    // Generic fallback for unexpected errors
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
