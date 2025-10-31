import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { z } from 'zod';
import { productService } from '@/lib/services/product.service';

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  // imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryIds: z.array(z.string()).optional(),
  mediaUrls: z.array(z.object({
    url: z.string().url("Invalid image URL"),
    altText: z.string().optional(),
    order: z.number().int().optional(),
  })).optional(),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string()),
  })).optional(),
  variants: z.array(z.object({
    sku: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    optionValues: z.array(z.object({
      optionName: z.string(),
      value: z.string(),
    })),
  })).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');
  const productId = searchParams.get('productId');
  const searchTerm = searchParams.get('searchTerm') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    await authorize(tenantId, ['admin', 'manager', 'user']);

    if (productId) {
      const product = await productService.getProduct(productId, tenantId);
      if (!product) {
        return new NextResponse('Product not found', { status: 404 });
      }
      return NextResponse.json(product);
    } else {
      const products = await productService.listProducts(tenantId, searchTerm, categoryId);
      return NextResponse.json(products);
    }
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
    const { userId } = await authorize(tenantId, ['admin', 'manager']);

    const body = await req.json();
    const productData = productSchema.parse(body);

    const product = await productService.createProduct({
      tenantId,
      userId,
      ...productData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
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
    const { userId } = await authorize(tenantId, ['admin', 'manager']);

    const body = await req.json();
    const productData = productSchema.partial().parse(body);

    const updatedProduct = await productService.updateProduct(productId, {
      tenantId,
      userId,
      ...productData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('[PRODUCTS_PUT]', error);
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
  const productId = searchParams.get('productId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }
  if (!productId) {
    return new NextResponse('Product ID is required', { status: 400 });
  }

  try {
    const { userId } = await authorize(tenantId, ['admin', 'manager']);

    await productService.deleteProduct(productId, tenantId, userId);

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