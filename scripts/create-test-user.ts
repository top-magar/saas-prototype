
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function createTestUser() {
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';
    const tenantName = 'Test Company';
    const subdomain = 'test-company';

    try {
        // 1. Create Tenant
        console.log('Creating tenant...');
        const { data: tenant, error: tenantError } = await supabaseAdmin
            .from('tenants')
            .insert({
                id: crypto.randomUUID(),
                name: tenantName,
                subdomain: subdomain,
                status: 'active',
                tier: 'STARTER',
                monthlyBudget: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .select()
            .single();

        if (tenantError) {
            // If tenant exists, try to fetch it
            if (tenantError.code === '23505') { // Unique violation
                console.log('Tenant already exists, fetching...');
                const { data: existingTenant } = await supabaseAdmin
                    .from('tenants')
                    .select()
                    .eq('subdomain', subdomain)
                    .single();

                if (existingTenant) {
                    // Continue with existing tenant
                    await createUser(existingTenant.id, email, password, name);
                    return;
                }
            }
            throw new Error(`Failed to create tenant: ${tenantError.message}`);
        }

        await createUser(tenant.id, email, password, name);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function createUser(tenantId: string, email: string, password: string, name: string) {
    console.log('Creating user...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Insert user (using camelCase as per tenant.ts)
    const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
            id: crypto.randomUUID(),
            email,
            name,
            tenantId: tenantId, // camelCase
            email_verified: true,
            role: 'owner',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

    if (user) {
        console.log('User created. Keys:', Object.keys(user));
    }

    if (userError) {
        if (userError.code === '23505') {
            console.log('User already exists. Fetching to inspect keys...');
            const { data: existingUser } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (existingUser) {
                console.log('Existing User Keys:', Object.keys(existingUser));
            }

            console.log('Updating password...');
            // Fall through to update
        } else {
            throw new Error(`Failed to create user: ${userError.message}`);
        }
    }

    // 2. Update password (using correct keys found: passwordHash + email_verified)
    console.log('Updating password...');
    const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
            passwordHash: hashedPassword,
            email_verified: true
        })
        .eq('email', email);

    if (updateError) {
        throw new Error(`Failed to update password: ${updateError.message}`);
    }

    console.log('\n✅ Test user created/updated successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

createTestUser();
