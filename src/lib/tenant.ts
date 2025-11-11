import { headers } from 'next/headers';
import { prisma } from './prisma';

export async function getTenant() {
  const headersList = await headers();
  const tenantSubdomain = headersList.get('x-tenant-subdomain');
  
  if (!tenantSubdomain) {
    return null;
  }

  return await prisma.tenant.findUnique({
    where: { subdomain: tenantSubdomain },
  });
}

export async function getCurrentTenant() {
  const headersList = await headers();
  const tenantSubdomain = headersList.get('x-tenant-subdomain');
  
  if (!tenantSubdomain) {
    return null;
  }

  return await prisma.tenant.findUnique({
    where: { subdomain: tenantSubdomain },
    include: {
      users: true,
    },
  });
}

export function getTenantUrl(subdomain: string, path: string = '') {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${subdomain}.${domain}`;
  
  return `${baseUrl}${path}`;
}

export function isValidSubdomain(subdomain: string): boolean {
  const reservedSubdomains = ['www', 'api', 'admin', 'app', 'mail', 'ftp'];
  return !reservedSubdomains.includes(subdomain) && /^[a-z0-9-]+$/.test(subdomain);
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
