import { currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { createTenantAndAssociateUser } from '@/lib/tenant';
import { createErrorResponse, createSuccessResponse, validateRequest } from '@/lib/server-only-utils';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { name, subdomain, primaryColor } = await validateRequest(req, ['name', 'subdomain']);

    const tenant = await createTenantAndAssociateUser({
      clerkUserId: user.id,
      name,
      subdomain,
      email: user.emailAddresses[0]?.emailAddress || '',
      userName: user.firstName || '',
      primaryColor: primaryColor || '#3B82F6',
    });

    return createSuccessResponse(tenant);
  } catch (error) {
    console.error('Error creating tenant:', error);
    type PrismaError = { code?: string };
    if (error instanceof Error && (error as PrismaError).code === 'P2002') {
      return createErrorResponse('This subdomain is already taken.', 409);
    }
    return createErrorResponse('Internal Server Error', 500);
  }
}