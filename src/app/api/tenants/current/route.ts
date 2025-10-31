import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const clerkUserId = user.id;
    if (!clerkUserId) {
      return new NextResponse('User has no Clerk ID', { status: 400 });
    }

    // Find user's tenant
    const dbUser = await prisma.user.findFirst({
      where: { clerkUserId },
      include: {
        tenant: true,
      },
    });

    if (!dbUser || !dbUser.tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    return NextResponse.json(dbUser.tenant);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}