import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createTenantAndAssociateUser } from '@/lib/tenant';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, subdomain, primaryColor } = await req.json();

    if (!name || !subdomain) {
      return new NextResponse('Name and subdomain are required', { status: 400 });
    }

    const tenant = await createTenantAndAssociateUser({
      clerkUserId: user.id,
      name,
      subdomain,
      email: user.emailAddresses[0]?.emailAddress || '',
      userName: user.firstName || '',
      primaryColor: primaryColor || '#3B82F6',
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('Error creating tenant:', error);
    type PrismaError = { code?: string };
    if (error instanceof Error && (error as PrismaError).code === 'P2002') {
      return new NextResponse('This subdomain is already taken.', { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}