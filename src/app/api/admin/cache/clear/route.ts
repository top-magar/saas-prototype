import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { invalidateTenantById, invalidateAllTenants, invalidatePattern } from '@/lib/cache/invalidation';
import { supabaseAdmin } from '@/lib/database/supabase';

const ClearSchema = z.object({
  type: z.enum(['tenant', 'all', 'pattern']),
  tenantId: z.string().uuid().optional(),
  pattern: z.string().optional(),
});

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) return false;

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', token.sub)
    .single();

  return user?.role === 'admin';
}

export async function POST(req: NextRequest) {
  try {
    if (!await isAdmin(req)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = ClearSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { type, tenantId, pattern } = validation.data;

    let result: { cleared: number; message: string };

    switch (type) {
      case 'tenant':
        if (!tenantId) {
          return NextResponse.json(
            { error: 'tenantId required for tenant type' },
            { status: 400 }
          );
        }
        await invalidateTenantById(tenantId);
        result = { cleared: 2, message: `Cache cleared for tenant ${tenantId}` };
        break;

      case 'all':
        const allCleared = await invalidateAllTenants();
        result = { cleared: allCleared, message: `All tenant caches cleared (${allCleared} keys)` };
        break;

      case 'pattern':
        if (!pattern) {
          return NextResponse.json(
            { error: 'pattern required for pattern type' },
            { status: 400 }
          );
        }
        const patternCleared = await invalidatePattern(pattern);
        result = { cleared: patternCleared, message: `Pattern cache cleared: ${pattern} (${patternCleared} keys)` };
        break;
    }

    console.log(`[Admin] Cache cleared: ${type}`);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Admin] Cache clear error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
