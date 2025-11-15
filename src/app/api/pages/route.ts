import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { z } from 'zod';

const componentSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'button', 'container', 'hero', 'grid']),
  props: z.record(z.string(), z.unknown()),
  children: z.array(componentSchema).optional()
}));

const pageSchema = z.object({
  storeId: z.string(),
  pageName: z.string().min(1, "Page name is required"),
  pageSlug: z.string().min(1, "Page slug is required"),
  pageType: z.enum(['home', 'product', 'collection', 'custom']).default('custom'),
  layoutData: z.object({
    components: z.array(componentSchema)
  }),
  seoMetadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');
  const storeId = searchParams.get('storeId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    const authResult = await authorize(tenantId, ['admin', 'manager', 'user']);
    const userId = authResult.user?.id;

    const whereClause = storeId 
      ? { storeId, store: { tenantId } }
      : { store: { tenantId } };

    const pages = await (prisma as any).page.findMany({
      where: whereClause,
      include: {
        store: { select: { storeName: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('[PAGES_GET]', error);
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
    const authResult = await authorize(tenantId, ['admin', 'manager']);
    const userId = authResult.user?.id;

    const body = await req.json();
    const pageData = pageSchema.parse(body);

    // Verify store belongs to tenant
    const store = await (prisma as any).store.findFirst({
      where: { id: pageData.storeId, tenantId }
    });

    if (!store) {
      return new NextResponse('Store not found', { status: 404 });
    }

    const page = await (prisma as any).page.create({
      data: {
        ...pageData,
        createdByUserId: userId,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    console.error('[PAGES_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');
  const pageId = searchParams.get('pageId');

  if (!tenantId || !pageId) {
    return new NextResponse('Tenant ID and Page ID are required', { status: 400 });
  }

  try {
    const authResult = await authorize(tenantId, ['admin', 'manager']);
    const userId = authResult.user?.id;

    const body = await req.json();
    const updateData = pageSchema.partial().parse(body);

    // Create version before updating
    const currentPage = await (prisma as any).page.findFirst({
      where: { id: pageId, store: { tenantId } }
    });

    if (!currentPage) {
      return new NextResponse('Page not found', { status: 404 });
    }

    try {
      await (prisma as any).pageVersion.create({
        data: {
          pageId,
          versionNumber: currentPage.versionNumber,
          layoutData: currentPage.layoutData,
          createdByUserId: userId,
        }
      });

      const updatedPage = await (prisma as any).page.update({
        where: { id: pageId },
        data: {
          ...updateData,
          versionNumber: currentPage.versionNumber + 1,
        },
      });

      return NextResponse.json(updatedPage);
    } catch (versionError) {
      console.error('[PAGE_VERSION_ERROR]', versionError);
      // Continue without versioning if it fails
      const updatedPage = await (prisma as any).page.update({
        where: { id: pageId },
        data: updateData,
      });
      return NextResponse.json(updatedPage);
    }
  } catch (error) {
    console.error('[PAGES_PUT]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}