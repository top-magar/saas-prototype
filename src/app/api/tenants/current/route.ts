import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // Log all request headers for debugging session/cookie issues
  console.log('--- Incoming API Request Headers ---');
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }

  console.log('DATABASE_URL seen by API:', process.env.DATABASE_URL);
  try {
    const user = await currentUser();
    console.log('Clerk currentUser() result:', user);

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