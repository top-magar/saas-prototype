import { notFound } from 'next/navigation';
import { supabase } from "@/lib/database/supabase";
import { TenantProvider } from '@/components/providers/tenant-provider';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}

async function getTenant(domain: string) {
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name, subdomain, tier, primaryColor')
    .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
    .single();

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