import { supabase } from './supabase';
import type { CustomerData } from '../shared/types';

export async function findOrCreateCustomer(data: CustomerData) {
  const { email, name, phone, tenantId } = data;

  try {
    // First, try to find existing customer by email within the tenant
    let { data: customer } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('tenant_id', tenantId)
      .eq('role', 'user')
      .single();

    // If customer doesn't exist, create a new one
    if (!customer) {
      const { data: newCustomer } = await supabase
        .from('users')
        .insert({
          email,
          name: name || email.split('@')[0],
          tenant_id: tenantId,
          role: 'user',
          status: 'active'
        })
        .select()
        .single();
      customer = newCustomer;
    }

    return customer;
  } catch (error) {
    console.error('Error finding or creating customer:', error);
    throw error;
  }
}