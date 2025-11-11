import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TenantProvider } from '@/components/providers/tenant-provider';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}

async function getTenant(subdomain: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
    select: {
      id: true,
      name: true,
      subdomain: true,
      tier: true,
      primaryColor: true,
    },
  });

  return tenant;
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { subdomain } = await params;
  const tenant = await getTenant(subdomain);

  if (!tenant) {
    notFound();
  }

  return (
    <TenantProvider tenant={tenant}>
      <div style={{ '--primary-color': tenant.primaryColor } as React.CSSProperties}>
        {children}
      </div>
    </TenantProvider>
  );
}