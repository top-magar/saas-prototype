import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { NextRequest } from 'next/server';
import { createAuthError } from '@/lib/server-only-utils';

// Type definitions for better maintainability
type AuthResult = { userId: string } | { error: string; status: number };
type UserRole = 'admin' | 'manager' | 'user';

export async function withAuth(req: NextRequest): Promise<AuthResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return createAuthError('Unauthorized', 401);
    }

    return { userId };
  } catch (error) {
    console.error('[AUTH_ERROR]', error);
    return createAuthError('Authentication failed', 401);
  }
}

export async function withRoleAuth(req: NextRequest, allowedRoles: UserRole[]): Promise<AuthResult> {
  const authResult = await withAuth(req);

  if ('error' in authResult) {
    return authResult;
  }

  try {
    const { supabase } = await import('@/lib/database/supabase');

    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', authResult.userId)
      .single();

    if (!user || !allowedRoles.includes(user.role as UserRole)) {
      return createAuthError('Forbidden: Insufficient permissions', 403);
    }

    return authResult;
  } catch (error) {
    console.error('[ROLE_AUTH_ERROR]', error);

    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('timeout')) {
        return createAuthError('Database connection error', 503);
      }
      if (error.message.includes('not found')) {
        return createAuthError('User not found', 401);
      }
    }

    return createAuthError('Authorization check failed', 500);
  }
}

export async function withAdminAuth(req: NextRequest): Promise<AuthResult> {
  const authResult = await withAuth(req);

  if ('error' in authResult) {
    return authResult;
  }

  try {
    // Import here to avoid circular dependencies
    const { supabase } = await import('@/lib/database/supabase');

    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', authResult.userId)
      .single();

    if (!user || user.role !== 'admin') {
      return createAuthError('Forbidden: Admin access required', 403);
    }

    return authResult;
  } catch (error) {
    console.error('[ADMIN_AUTH_ERROR]', error);

    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('timeout')) {
        return createAuthError('Database connection error', 503);
      }
      if (error.message.includes('not found')) {
        return createAuthError('User not found', 401);
      }
    }

    return createAuthError('Authorization check failed', 500);
  }
}