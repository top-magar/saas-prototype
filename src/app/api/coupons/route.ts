import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    const { data: coupons } = await supabase
      .from('coupons')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('[COUPONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    const body = await req.json();
    const { code, type, value, minAmount, maxUses, expiresAt } = body;

    if (!code || !type || !value) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if coupon code already exists
    const { data: existingCoupon } = await supabase
      .from('coupons')
      .select('id')
      .eq('code', code.toUpperCase())
      .single();

    if (existingCoupon) {
      return new NextResponse('Coupon code already exists', { status: 409 });
    }

    const { data: coupon } = await supabase
      .from('coupons')
      .insert({
        tenant_id: tenant.id,
        code: code.toUpperCase(),
        type,
        value,
        minimum_amount: minAmount,
        usage_limit: maxUses,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
      })
      .select()
      .single();

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('[COUPONS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}