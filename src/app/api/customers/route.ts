import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    const customers = await prisma.user.findMany({
      where: {
        tenantId: tenant.id,
        role: 'user'
      },
      include: {
        orders: {
          select: {
            total: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCustomers = customers.map(customer => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0);
      const lastOrder = customer.orders[0];
      
      return {
        id: customer.id,
        name: customer.name || 'Unknown',
        email: customer.email,
        totalOrders,
        totalSpent,
        status: totalSpent > 1000 ? 'VIP' : totalOrders > 0 ? 'Active' : 'New',
        lastActive: lastOrder ? lastOrder.createdAt.toISOString().split('T')[0] : customer.createdAt.toISOString().split('T')[0],
        joinDate: customer.createdAt.toISOString().split('T')[0]
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error('[CUSTOMERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

