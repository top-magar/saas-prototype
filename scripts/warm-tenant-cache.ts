import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { supabaseAdmin } from '../src/lib/database/supabase';
import { setTenantCache } from '../src/lib/cache/tenant-redis';

async function warmCache() {
  console.log('🔥 Warming tenant cache...\n');

  const { data: tenants, error } = await supabaseAdmin
    .from('tenants')
    .select('id, subdomain, custom_domain, settings, status');

  if (error) {
    console.error('❌ Error fetching tenants:', error);
    process.exit(1);
  }

  if (!tenants || tenants.length === 0) {
    console.log('⚠️  No tenants found');
    return;
  }

  console.log(`Found ${tenants.length} tenants\n`);

  let cached = 0;
  for (const tenant of tenants) {
    try {
      // Cache by subdomain
      await setTenantCache(tenant.subdomain, tenant);
      console.log(`✓ Cached subdomain: ${tenant.subdomain}`);
      cached++;

      // Cache by custom domain if exists
      if (tenant.custom_domain) {
        await setTenantCache(tenant.custom_domain, tenant);
        console.log(`✓ Cached custom domain: ${tenant.custom_domain}`);
        cached++;
      }
    } catch (error) {
      console.error(`✗ Failed to cache ${tenant.subdomain}:`, error);
    }
  }

  console.log(`\n✅ Cache warming complete: ${cached} entries cached`);
}

warmCache();
