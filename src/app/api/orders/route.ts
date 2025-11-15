import { supabase } from "@/lib/supabase";
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
    
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(100);
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
    const { count: orderCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);
    const orderNumber = `ORD-${Date.now()}-${(orderCount || 0) + 1}`;

    // Create order with customer
    const { data: order } = await supabase
      .from('orders')
      .insert({
        tenant_id: tenantId,
        user_id: customer.id,
        order_number: orderNumber,
        customer_email: customerEmail,
        customer_name: customerName || customer.name,
        customer_phone: customerPhone,
        subtotal: total,
        total,
        payment_method: paymentMethod || 'online',
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    return NextResponse.json({ order, customer });
  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
