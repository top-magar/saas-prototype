import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from "@/lib/database/supabase";
import { getTenant } from '@/lib/database/tenant';
import { authOptions } from '@/lib/auth/options';

async function getDashboardData() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

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

    const { count: totalSales } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id);

    const { data: revenueData } = await supabase
      .from('orders')
      .select('total')
      .eq('tenant_id', tenant.id)
      .eq('status', 'completed');
    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    const { count: activeCustomers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .gte('last_login_at', lastWeek.toISOString());

    const { count: refundRequests } = await supabase
      .from('payments')
      .select('*, orders!inner(tenantId)', { count: 'exact', head: true })
      .eq('orders.tenantId', tenant.id)
      .eq('status', 'refunded');

    const { data: profitData } = await supabase
      .from('orders')
      .select('created_at, total')
      .eq('tenant_id', tenant.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: true });

    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*, users(name)')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, subtotal, orders!inner(tenantId)')
      .eq('orders.tenantId', tenant.id);

    const productSales = orderItems?.reduce((acc, item) => {
      acc[item.product_id] = (acc[item.product_id] || 0) + (item.subtotal || 0);
      return acc;
    }, {} as Record<string, number>) || {};

    const topProductIds = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => id);

    const { data: productDetails } = await supabase
      .from('products')
      .select('id, name')
      .in('id', topProductIds);

    const totalProductRevenue = Object.values(productSales).reduce((sum, val) => sum + val, 0);

    return {
      stats: {
        totalSales: totalSales || 0,
        totalRevenue,
        activeCustomers: activeCustomers || 0,
        refundRequests: refundRequests || 0,
      },
      overview: profitData?.map((d) => ({
        month: new Date(d.created_at).toLocaleString('default', { month: 'short' }),
        totalSales: totalSales || 0,
        totalRevenue: d.total,
      })) || [],
      recentOrders: recentOrders?.map((order) => ({
        id: order.id,
        product: 'Not available',
        customer: order.customer_name || order.users?.name || 'N/A',
        date: new Date(order.created_at).toLocaleDateString(),
        amount: order.total,
        status: order.status,
      })) || [],
      topProducts: topProductIds.map((productId, index) => {
        const product = productDetails?.find((pd) => pd.id === productId);
        const earnings = productSales[productId] || 0;

        const revenuePercentage = totalProductRevenue > 0
          ? Math.round((earnings / totalProductRevenue) * 100)
          : 0;

        return {
          name: product?.name || `Product ${index + 1} `,
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
