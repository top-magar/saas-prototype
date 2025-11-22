import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { warmAllTenants } from '../src/lib/cache/cache-warming';

async function main() {
  console.log('🔥 Starting cache warming...\n');

  const result = await warmAllTenants();

  if (result.success) {
    console.log(`\n✅ Success: ${result.count} cache entries warmed`);
    process.exit(0);
  } else {
    console.error(`\n❌ Error: ${result.error}`);
    process.exit(1);
  }
}

main();
