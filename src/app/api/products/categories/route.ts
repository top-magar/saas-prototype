import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager', 'user']); // Allow users to view categories

    const categories = await prisma.category.findMany({
      where: { tenantId },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
        return new NextResponse(error.message, { status: 403 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
        return new NextResponse(error.message, { status: 401 });
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
    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    await authorize(tenantId, ['admin', 'manager']); // Only admin/manager can create categories

    const category = await prisma.category.create({
      data: {
        tenantId,
        name: validatedData.name,
        description: validatedData.description,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
        return new NextResponse(error.message, { status: 403 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
        return new NextResponse(error.message, { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');
  const categoryId = searchParams.get('categoryId'); // Assuming categoryId is passed as a search param

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }
  if (!categoryId) {
    return new NextResponse('Category ID is required', { status: 400 });
  }

  try {
    const body = await req.json();
    const validatedData = categorySchema.partial().parse(body); // Use partial for PATCH

    await authorize(tenantId, ['admin', 'manager']);

    const category = await prisma.category.update({
      where: { id: categoryId, tenantId },
      data: {
        ...validatedData,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORIES_PATCH]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
        return new NextResponse(error.message, { status: 403 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
        return new NextResponse(error.message, { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');
  const categoryId = searchParams.get('categoryId'); // Assuming categoryId is passed as a search param

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }
  if (!categoryId) {
    return new NextResponse('Category ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager']);

    await prisma.category.delete({
      where: { id: categoryId, tenantId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CATEGORIES_DELETE]', error);
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
        return new NextResponse(error.message, { status: 403 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
        return new NextResponse(error.message, { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}