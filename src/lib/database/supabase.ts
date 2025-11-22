import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/config/env';

// Validate env vars are present (already done in env.ts, but add runtime check)
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase configuration is missing. Check environment variables.');
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase service role key is missing. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  env.SUPABASE_SERVICE_ROLE_KEY
);