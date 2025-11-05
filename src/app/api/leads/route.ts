import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    // Get orders that are pending payment for more than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const abandonedOrders = await prisma.order.findMany({
      where: {
        tenantId: tenant.id,
        paymentStatus: 'pending',
        createdAt: {
          lt: oneHourAgo
        }
      },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const leads = abandonedOrders.map(order => {
      const daysSinceAbandoned = Math.floor(
        (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderNumber: order.orderNumber,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        daysSinceAbandoned,
        items: order.items.length
      };
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('[LEADS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}