import { currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { createTenantAndAssociateUser } from '@/lib/database/tenant';
import { createErrorResponse, createSuccessResponse, validateRequest } from '@/lib/server/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { name, subdomain, primaryColor } = body;

    if (!name || !subdomain) {
      return createErrorResponse('Name and subdomain are required', 400);
    }

    const tenant = await createTenantAndAssociateUser({
      clerkUserId: user.id,
      name,
      subdomain,
      email: user.emailAddresses[0]?.emailAddress || '',
      userName: user.firstName || user.username || 'User',
      primaryColor: primaryColor || '#3B82F6',
    });

    return createSuccessResponse({ tenant, success: true });
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    
    if (error.message?.includes('duplicate key') || error.message?.includes('already exists') || error.code === '23505') {
      return createErrorResponse('This subdomain is already taken', 409);
    }
    
    return createErrorResponse(error.message || 'Failed to create tenant', 500);
  }
}