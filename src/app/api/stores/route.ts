import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { z } from 'zod';

const storeSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  domain: z.string().optional(),
  vanitySubdomain: z.string().optional(),
  brandingConfig: z.object({
    logo: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
  }).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager', 'user']);

    let stores = await prisma.store.findMany({
      where: { tenantId },
      include: {
        pages: {
          select: { id: true, pageName: true, publishStatus: true }
        }
      }
    });

    // Create default store if none exists
    if (stores.length === 0) {
      const defaultStore = await prisma.store.create({
        data: {
          tenantId,
          storeName: 'My Store',
          brandingConfig: {
            primaryColor: '#3b82f6',
            secondaryColor: '#10b981'
          }
        }
      });
      stores = [defaultStore];
    }

    return NextResponse.json(stores);
  } catch (error) {
    console.error('[STORES_GET]', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      if (error.message.includes('Forbidden')) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager']);

    const body = await req.json();
    const storeData = storeSchema.parse(body);

    const store = await prisma.store.create({
      data: {
        tenantId,
        ...storeData,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error('[STORES_POST]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      if (error.message.includes('Forbidden')) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}