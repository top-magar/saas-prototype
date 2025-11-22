import { supabase } from "@/lib/database/supabase";
import { NextRequest, NextResponse } from 'next/server';
import type { Order } from '@/types/orders';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const { id: orderId } = await params;

    if (!tenantId) {
        return new NextResponse('Tenant ID is required', { status: 400 });
    }

    try {
        const { authorize } = await import('@/lib/server/auth');
        await authorize(tenantId, ['admin', 'manager', 'user']);

        // Fetch order with line items and fulfillments
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        *,
        line_items:order_line_items(*),
        fulfillments:order_fulfillments(*)
      `)
            .eq('id', orderId)
            .eq('tenant_id', tenantId)
            .single();

        if (error) {
            console.error('[ORDER_GET]', error);
            return new NextResponse('Order not found', { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('[ORDER_GET]', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const { id: orderId } = await params;

    if (!tenantId) {
        return new NextResponse('Tenant ID is required', { status: 400 });
    }

    try {
        const { authorize } = await import('@/lib/server/auth');
        await authorize(tenantId, ['admin', 'manager']);

        const body = await req.json();
        const { payment_status, fulfillment_status, notes, tags } = body;

        // Build update object
        const updates: Partial<Order> = {};
        if (payment_status) updates.payment_status = payment_status;
        if (fulfillment_status) updates.fulfillment_status = fulfillment_status;
        if (notes !== undefined) updates.notes = notes;
        if (tags !== undefined) updates.tags = tags;

        const { data: order, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', orderId)
            .eq('tenant_id', tenantId)
            .select()
            .single();

        if (error) {
            console.error('[ORDER_PATCH]', error);
            return new NextResponse('Failed to update order', { status: 500 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('[ORDER_PATCH]', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
