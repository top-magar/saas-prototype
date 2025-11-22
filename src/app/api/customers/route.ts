import { supabase } from '@/lib/database/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/database/tenant';

export async function GET() {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    const { data: customers } = await supabase
      .from('users')
      .select(`
        *,
        orders(total, created_at)
      `)
      .eq('tenantId', tenant.id)
      .eq('role', 'user')
      .order('created_at', { ascending: false });

    const formattedCustomers = (customers || []).map(customer => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
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

