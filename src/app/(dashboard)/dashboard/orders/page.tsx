import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { OrdersList } from '@/components/orders/OrdersList';
import { supabase } from '@/lib/database/supabase';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/sign-in');
  }

  // Get user's tenant - try multiple strategies
  const userId = (user as any)?.id;
  if (!userId) {
    redirect('/sign-in');
  }

  // Try to get tenant from database first
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', userId)
    .single();

  // Use tenant ID if found, otherwise fallback to user ID
  const tenantId = tenant?.id ||
    ((user as any)?.publicMetadata?.tenantId as string) ||
    ((user as any)?.privateMetadata?.tenantId as string) ||
    userId;

  console.log('User:', userId, 'TenantId:', tenantId); // Debug log

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <OrdersList tenantId={tenantId} />
    </div>
  );
}