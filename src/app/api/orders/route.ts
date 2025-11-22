import { supabase } from "@/lib/database/supabase";
import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateCustomer } from '@/lib/database/customers';
import type { OrderFilter, OrdersResponse, PaymentStatus, FulfillmentStatus, OrderSortKey } from '@/types/orders';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    const { authorize } = await import('@/lib/server/auth');
    await authorize(tenantId, ['admin', 'manager', 'user']);

    // Parse filter parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const paymentStatus = searchParams.get('payment_status') as PaymentStatus | 'all' | null;
    const fulfillmentStatus = searchParams.get('fulfillment_status') as FulfillmentStatus | 'all' | null;
    const search = searchParams.get('search');
    const sortBy = (searchParams.get('sort') as OrderSortKey) || 'created_at';
    const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'desc';

    // Build query
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId);

    // Apply filters
    if (paymentStatus && paymentStatus !== 'all') {
      query = query.eq('payment_status', paymentStatus);
    }

    if (fulfillmentStatus && fulfillmentStatus !== 'all') {
      query = query.eq('fulfillment_status', fulfillmentStatus);
    }

    // Search functionality
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }

    // Apply sorting
    const ascending = sortOrder === 'asc';
    query = query.order(sortBy, { ascending });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('[ORDERS_GET]', error);
      return new NextResponse('Database error', { status: 500 });
    }

    const response: OrdersResponse = {
      orders: orders || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };

    return NextResponse.json(response);
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

    // Create order with enhanced fields
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
        total_minor_units: total * 100, // Convert to minor units
        payment_method: paymentMethod || 'online',
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
        status: 'pending'
      })
      .select()
      .single();

    return NextResponse.json({ order, customer });
  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
