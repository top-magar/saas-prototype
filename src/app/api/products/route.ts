import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    // Authorize the user before fetching data.
    // Allows any user role ('admin', 'manager', 'user') to view products.
    await authorize(tenantId, ['admin', 'manager', 'user']);

    const products = await prisma.product.findMany({
      where: { tenantId },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
        return new NextResponse(error.message, { status: 403 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
        return new NextResponse(error.message, { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}