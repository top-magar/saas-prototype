import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    const body = await req.json();
    const { code, type, value, minAmount, maxUses, expiresAt } = body;

    const coupon = await prisma.coupon.update({
      where: {
        id: params.id,
        tenantId: tenant.id
      },
      data: {
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
    console.error('[COUPON_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenant = await getTenant();
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    await prisma.coupon.delete({
      where: {
        id: params.id,
        tenantId: tenant.id
      }
    });

    return new NextResponse('Coupon deleted', { status: 200 });
  } catch (error) {
    console.error('[COUPON_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}