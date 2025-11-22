import 'server-only';
import { getServerSession } from 'next-auth';
import { supabase } from '../database/supabase';
import type { UserRole } from '../shared/types';

export async function authorize(tenantId: string, allowedRoles: UserRole[]) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    throw new Error('Unauthorized: No user logged in.');
  }

  const { data: dbUser } = await supabase
    .from('users')
    .select('*, tenant:tenants(*)')
    .eq('email', session.user.email)
    .eq('tenant_id', tenantId)
    .single();

  if (!dbUser || !dbUser.tenant) {
    throw new Error('Forbidden: User does not belong to this tenant or tenant not found.');
  }

  if (!allowedRoles.includes(dbUser.role.toLowerCase() as UserRole)) {
    throw new Error(`Forbidden: User role "${dbUser.role}" is not one of the allowed roles.`);
  }

  return dbUser;
}