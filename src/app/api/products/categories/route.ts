import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return new NextResponse('Tenant ID is required', { status: 400 });
  }

  try {
    const authResult = await authorize(tenantId, ['admin', 'manager', 'user']);
    
    if (!authResult.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, description, created_at, updated_at')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return new NextResponse('Forbidden', { status: 403 });
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
    const authResult = await authorize(tenantId, ['admin', 'manager']);
    
    if (!authResult.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return new NextResponse('Category name is required', { status: 400 });
    }

    const { data: category } = await supabase
      .from('categories')
      .insert({
        tenant_id: tenantId,
        name: name.trim(),
        description: description?.trim() || null,
      })
      .select()
      .single();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
