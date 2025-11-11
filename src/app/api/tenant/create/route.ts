import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createTenantAndAssociateUser } from '@/lib/tenant';
import { isValidSubdomain } from '@/lib/tenant';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, subdomain, email, userName, primaryColor } = await request.json();

    if (!isValidSubdomain(subdomain)) {
      return NextResponse.json(
        { error: 'Invalid subdomain. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    const tenant = await createTenantAndAssociateUser({
      clerkUserId: userId,
      name,
      subdomain,
      email,
      userName,
      primaryColor,
    });

    return NextResponse.json({ tenant });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Subdomain already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}