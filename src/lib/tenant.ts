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
