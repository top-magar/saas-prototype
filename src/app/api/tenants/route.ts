
import { NextRequest } from 'next/server';
import { createTenantAndAssociateUser } from '@/lib/database/tenant';
import { createErrorResponse, createSuccessResponse, validateRequest } from '@/lib/server/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth');
    const session = await getServerSession();
    
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { name, subdomain, primaryColor } = body;

    if (!name || !subdomain) {
      return createErrorResponse('Name and subdomain are required', 400);
    }

    const tenant = await createTenantAndAssociateUser({
      email: session.user.email || '',
      name,
      subdomain,
      userName: session.user.name || 'User',
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