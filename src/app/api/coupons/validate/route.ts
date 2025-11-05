import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';
import { validateCoupon } from '@/lib/coupon-utils';

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    const body = await req.json();
    const { code, orderTotal } = body;

    if (!code || orderTotal === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const validation = await validateCoupon(code, tenant.id, orderTotal);
    
    return NextResponse.json(validation);
  } catch (error) {
    console.error('[COUPON_VALIDATE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}