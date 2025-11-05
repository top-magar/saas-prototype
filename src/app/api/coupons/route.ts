import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    const coupons = await prisma.coupon.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' }
    });

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
    const existingCoupon = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase() }
    });

    if (existingCoupon) {
      return new NextResponse('Coupon code already exists', { status: 409 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        tenantId: tenant.id,
        code: code.toUpperCase(),
        type,
        value,
        minAmount,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('[COUPONS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}