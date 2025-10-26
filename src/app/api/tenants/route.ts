import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Use a transaction to ensure both operations succeed or fail together
    const tenant = await prisma.$transaction(async (tx) => {
      // 1. Create the new tenant
      const newTenant = await tx.tenant.create({
        data: {
          name,
          subdomain,
          primaryColor: primaryColor || '#3B82F6',
          monthlyBudget: 0, // Default value for required field
        },
      });

      // 2. Find the user created by the webhook and link them to the new tenant.
      // If the webhook failed for some reason, this will create the user.
      await tx.user.upsert({
        where: { clerkUserId: user.id },
        update: { tenantId: newTenant.id },
        create: {
          clerkUserId: user.id,
          tenantId: newTenant.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.firstName || '',
        },
      });

      return newTenant;
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('Error creating tenant:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      return new NextResponse('This subdomain is already taken.', { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}