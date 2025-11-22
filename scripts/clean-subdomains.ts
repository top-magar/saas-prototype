import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanSubdomains() {
  console.log('Cleaning subdomains...');
  
  // Delete all tenants
  const { error: tenantsError } = await supabase
    .from('tenants')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (tenantsError) {
    console.error('Error deleting tenants:', tenantsError);
  } else {
    console.log('✓ All tenants deleted');
  }
  
  // Delete all users
  const { error: usersError } = await supabase
    .from('users')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (usersError) {
    console.error('Error deleting users:', usersError);
  } else {
    console.log('✓ All users deleted');
  }
  
  console.log('Done!');
}

cleanSubdomains();
