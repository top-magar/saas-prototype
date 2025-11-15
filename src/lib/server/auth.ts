import 'server-only';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '../database/supabase';
import type { UserRole } from '../shared/types';

/**
 * Verifies that the current user is authenticated, belongs to the specified tenant,
 * and has one of the allowed roles.
 */
export async function authorize(tenantId: string, allowedRoles: UserRole[]) {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error('Unauthorized: No user logged in.');
  }

  const { data: dbUser } = await supabase
    .from('users')
    .select('*, tenant:tenants(*)')
    .eq('clerk_user_id', user.id)
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