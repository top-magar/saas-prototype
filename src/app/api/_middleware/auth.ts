import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { createErrorResponse } from '@/lib/server-only-utils';

// Type definitions for better maintainability
type AuthResult = { userId: string } | { error: string; status: number };
type UserRole = 'admin' | 'manager' | 'user';

export async function withAuth(req: NextRequest): Promise<AuthResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }
    
    return { userId };
  } catch (error) {
    console.error('[AUTH_ERROR]', error);
    return createErrorResponse('Authentication failed', 401);
  }
}

export async function withRoleAuth(req: NextRequest, allowedRoles: UserRole[]): Promise<AuthResult> {
  const authResult = await withAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }
  
  try {
    const { supabase } = await import('@/lib/supabase');
    
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('clerk_user_id', authResult.userId)
      .single();
    
    if (!user || !allowedRoles.includes(user.role as UserRole)) {
      return createErrorResponse('Forbidden: Insufficient permissions', 403);
    }
    
    return authResult;
  } catch (error) {
    console.error('[ROLE_AUTH_ERROR]', error);
    
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('timeout')) {
        return createErrorResponse('Database connection error', 503);
      }
      if (error.message.includes('not found')) {
        return createErrorResponse('User not found', 401);
      }
    }
    
    return createErrorResponse('Authorization check failed', 500);
  }
}

export async function withAdminAuth(req: NextRequest): Promise<AuthResult> {
  const authResult = await withAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }
  
  try {
    // Import here to avoid circular dependencies
    const { supabase } = await import('@/lib/supabase');
    
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('clerk_user_id', authResult.userId)
      .single();
    
    if (!user || user.role !== 'admin') {
      return createErrorResponse('Forbidden: Admin access required', 403);
    }
    
    return authResult;
  } catch (error) {
    console.error('[ADMIN_AUTH_ERROR]', error);
    
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('timeout')) {
        return createErrorResponse('Database connection error', 503);
      }
      if (error.message.includes('not found')) {
        return createErrorResponse('User not found', 401);
      }
    }
    
    return createErrorResponse('Authorization check failed', 500);
  }
}