import { createClient } from '@supabase/supabase-js';

// Connection pool configuration
const supabaseConfig = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'saas-prototype',
    },
  },
};

// Optimized client for server-side operations
export const supabaseServerClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  supabaseConfig
);

// Read replica client (if available)
export const supabaseReadClient = createClient(
  process.env.SUPABASE_READ_REPLICA_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  supabaseConfig
);

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { error } = await supabaseServerClient
      .from('tenants')
      .select('id')
      .limit(1)
      .single();
    
    return !error;
  } catch {
    return false;
  }
}