import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma}  from '@/lib/prisma';
import { getTenant } from '@/lib/tenant';

async function getDashboardData() {
  const user = await currentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const tenant = await getTenant();
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
    topProducts: topProducts.map((p) => {
      const product = productDetails.find((pd) => pd.id === p.productId);
      return {
        name: product?.name || 'Unknown',
        percent: 0, 
        earnings: p._sum.subtotal,
      };
    }),
  };
}

export async function GET() {
  const data = await getDashboardData();
  if ('error' in data) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }
  return NextResponse.json(data);
}
