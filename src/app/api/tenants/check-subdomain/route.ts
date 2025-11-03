import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return new NextResponse('Subdomain is required', { status: 400 });
    }

    const existingTenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true },
    });

    return NextResponse.json({ available: !existingTenant });
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}