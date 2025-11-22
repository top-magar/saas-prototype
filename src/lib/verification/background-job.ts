import { verifyDNSTXTRecord } from './dns';
import { getPendingVerifications, updateVerificationAttempt } from './storage';
import { supabaseAdmin } from '@/lib/database/supabase';
import { deleteTenantCache } from '@/lib/cache/tenant-redis';

export async function runVerificationJob() {
  console.log('[Verification Job] Starting...');

  const pending = await getPendingVerifications();
  console.log(`[Verification Job] Found ${pending.length} pending verifications`);

  for (const attempt of pending) {
    try {
      console.log(`[Verification Job] Checking ${attempt.domain}...`);

      const result = await verifyDNSTXTRecord(attempt.domain, attempt.verification_token);

      await updateVerificationAttempt(attempt.id, {
        attempts: attempt.attempts + 1,
        status: result.verified ? 'verified' : 'pending',
        error_message: result.error,
        verified_at: result.verified ? new Date().toISOString() : undefined,
      });

      if (result.verified) {
        console.log(`[Verification Job] ✓ Verified ${attempt.domain}`);

        const { data: tenant } = await supabaseAdmin
          .from('tenants')
          .update({
            domain_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', attempt.tenantId)
          .select()
          .single();

        if (tenant) {
          await deleteTenantCache(tenant);
        }
      } else {
        console.log(`[Verification Job] ✗ Not verified ${attempt.domain} (${attempt.attempts + 1} attempts)`);
      }

      // Rate limit: wait 1 second between checks
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`[Verification Job] Error checking ${attempt.domain}:`, error);
    }
  }

  console.log('[Verification Job] Complete');
}

// Run every 6 hours
export function startVerificationJob() {
  const SIX_HOURS = 6 * 60 * 60 * 1000;

  runVerificationJob(); // Run immediately

  setInterval(() => {
    runVerificationJob();
  }, SIX_HOURS);

  console.log('[Verification Job] Scheduled to run every 6 hours');
}
