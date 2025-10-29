import { headers } from 'next/headers';
import { prisma } from './prisma';

export async function getTenant() {
  const headersList = await headers();
  const host = headersList.get('host');
  const subdomain = host?.split('.')[0];

  if (!subdomain) {
    return null;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });

  return tenant;
}

interface CreateTenantAndAssociateUserParams {
  clerkUserId: string;
  name: string;
  subdomain: string;
  email: string;
  userName: string;
  primaryColor?: string;
}

export async function createTenantAndAssociateUser({
  clerkUserId,
  name,
  subdomain,
  email,
  userName,
  primaryColor,
}: CreateTenantAndAssociateUserParams) {
  return await prisma.$transaction(async (tx) => {
    const newTenant = await tx.tenant.create({
      data: {
        name,
        subdomain,
        primaryColor: primaryColor || '#3B82F6',
        monthlyBudget: 0,
      },
    });

    await tx.user.upsert({
      where: { clerkUserId },
      update: { tenantId: newTenant.id },
      create: {
        clerkUserId,
        tenantId: newTenant.id,
        email,
        name: userName,
      },
    });

    return newTenant;
  });
}
