import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { createErrorResponse } from '@/lib/server-only-utils';

export async function withAuth(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }
    
    return { userId };
  } catch (error) {
    return createErrorResponse('Authentication failed', 401);
  }
}

export async function withAdminAuth(req: NextRequest) {
  const authResult = await withAuth(req);
  
  if ('error' in authResult) {
    return authResult;
  }
  
  // Add admin role check here
  // const user = await getUserById(authResult.userId);
  // if (!user?.roles?.includes('admin')) {
  //   return createErrorResponse('Forbidden', 403);
  // }
  
  return authResult;
}