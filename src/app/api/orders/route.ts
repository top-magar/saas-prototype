import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateCustomer } from '@/lib/customer-utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    const { authorize } = await import('@/lib/auth');
    await authorize(tenantId, ['admin', 'manager', 'user']);
    
    const orders = await prisma.order.findMany({
      where: { tenantId },
      take: 100, // Limit results for performance
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, customerEmail, customerName, customerPhone, items, total, paymentMethod } = body;

    if (!tenantId || !customerEmail || !items || !total) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Auto-create or find customer
    const customer = await findOrCreateCustomer({
      email: customerEmail,
      name: customerName,
      phone: customerPhone,
      tenantId
    });

    // Generate order number
    const orderCount = await prisma.order.count({ where: { tenantId } });
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // Create order with customer
    const order = await prisma.order.create({
      data: {
        tenantId,
        userId: customer.id,
        orderNumber,
        customerEmail,
        customerName: customerName || customer.name,
        customerPhone: customerPhone,
        subtotal: total,
        total,
        paymentMethod: paymentMethod || 'online',
        status: 'pending',
        paymentStatus: 'pending'
      }
    });

    return NextResponse.json({ order, customer });
  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
