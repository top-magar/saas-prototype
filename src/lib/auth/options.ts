import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/lib/database/supabase';
import { createTenantAndAssociateUser } from '@/lib/database/tenant';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const { data: user } = await supabaseAdmin
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (!user || !user.passwordHash) return null;

                if (user.email_verified === false) {
                    throw new Error('Please verify your email before logging in');
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === 'google') {
                    const { data: existingUser } = await supabaseAdmin
                        .from('users')
                        .select('id')
                        .eq('email', user.email)
                        .single();

                    if (!existingUser) {
                        console.log('Creating new tenant for user:', user.email);
                        // Auto-create tenant
                        const name = user.name || 'User';
                        const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20) + '-' + crypto.randomUUID().slice(0, 4);

                        await createTenantAndAssociateUser({
                            email: user.email!,
                            name: `${name}'s Store`,
                            subdomain,
                            userName: name,
                        });
                        console.log('Tenant created successfully');
                    } else {
                        // Check if existing user has a tenant
                        const { data: userWithTenant } = await supabaseAdmin
                            .from('users')
                            .select('tenantId')
                            .eq('id', existingUser.id)
                            .single();

                        if (!userWithTenant?.tenantId) {
                            console.log('User exists but has no tenant. Creating one for:', user.email);
                            const name = user.name || 'User';
                            const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20) + '-' + crypto.randomUUID().slice(0, 4);

                            await createTenantAndAssociateUser({
                                email: user.email!,
                                name: `${name}'s Store`,
                                subdomain,
                                userName: name,
                            });
                            console.log('Tenant created for existing user successfully');
                        }
                    }
                }
                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub!;
            }
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
        signOut: '/',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
};
