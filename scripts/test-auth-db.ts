import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import bcrypt from 'bcryptjs';

async function testAuth() {
    const { supabaseAdmin } = await import('../src/lib/database/supabase');

    const testEmail = 'magartop110@gmail.com';
    const testPassword = 'test123';

    console.log('\nUpdating password for existing user:', testEmail);
    
    const hash = await bcrypt.hash(testPassword, 10);
    const { error } = await supabaseAdmin
        .from('users')
        .update({ passwordHash: hash })
        .eq('email', testEmail);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n✓ Password updated successfully!');
    console.log('\nLogin credentials:');
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${testPassword}`);
}

testAuth();
