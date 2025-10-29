import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

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
      include: {
        variants: {
          include: {
            optionValues: {
              include: {
                optionValue: true,
              },
            },
          },
        },
        options: {
          include: {
            values: true,
          },
        },
      },
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

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager']);

    const body = await req.json();
    const { name, description } = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        tenantId,
        name,
        description,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
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

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');
  const productId = searchParams.get('productId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }
  if (!productId) {
    return new NextResponse('Product ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager']);

    const body = await req.json();
    const { name, description } = productSchema.parse(body);

    const product = await prisma.product.update({
      where: { id: productId, tenantId },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_PUT]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
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
  const productId = searchParams.get('productId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }
  if (!productId) {
    return new NextResponse('Product ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager']);

    // Delete product and its related data (variants, options, option values, variant option values)
    // Prisma's cascade delete should handle most of this if configured in schema.prisma
    // However, explicit deletion ensures all related records are removed.
    await prisma.$transaction(async (tx) => {
      // Delete ProductVariantOptionValue records first
      await tx.productVariantOptionValue.deleteMany({
        where: { variant: { productId: productId } },
      });
      // Delete ProductOptionValue records
      await tx.productOptionValue.deleteMany({
        where: { option: { productId: productId } },
      });
      // Delete ProductVariant records
      await tx.productVariant.deleteMany({
        where: { productId: productId },
      });
      // Delete ProductOption records
      await tx.productOption.deleteMany({
        where: { productId: productId },
      });
      // Finally, delete the Product
      await tx.product.delete({
        where: { id: productId, tenantId },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PRODUCTS_DELETE]', error);
    if (error instanceof Error && error.message.startsWith('Forbidden')) {
        return new NextResponse(error.message, { status: 403 });
    }
    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
        return new NextResponse(error.message, { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}