import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables before importing anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    // Dynamic imports to ensure env vars are loaded first
    const { createTenantAndAssociateUser } = await import('../src/lib/database/tenant');
    const { supabaseAdmin } = await import('../src/lib/database/supabase');

    const testEmail = `test-${Date.now()}@example.com`;
    const testName = 'Test User';
    const testSubdomain = `test-${Date.now()}`;

    console.log('Testing tenant creation for:', testEmail);

    try {
        // 1. Create a user first (simulating the state where user exists but no tenant)
        const { data: user, error: userError } = await supabaseAdmin.from('users').insert({
            id: crypto.randomUUID(),
            email: testEmail,
            name: testName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).select().single();

        if (userError) {
            throw new Error(`Failed to create test user: ${userError.message}`);
        }
        console.log('Test user created:', user.id);

        // 2. Try to create tenant and associate
        console.log('Calling createTenantAndAssociateUser...');
        const tenant = await createTenantAndAssociateUser({
            email: testEmail,
            name: `${testName}'s Store`,
            subdomain: testSubdomain,
            userName: testName,
        });

        console.log('Tenant created successfully:', tenant);

        // Cleanup
        await supabaseAdmin.from('users').delete().eq('email', testEmail);
        await supabaseAdmin.from('tenants').delete().eq('id', tenant.id);
        console.log('Cleanup done.');

    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
}

main();
