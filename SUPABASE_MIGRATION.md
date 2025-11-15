# Supabase Migration Guide

This project has been successfully migrated from Prisma to Supabase. Here's what you need to do to complete the setup:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

## 2. Set up Environment Variables

Update your `.env.local` file with the following Supabase variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Keep your existing Clerk variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
# ... other variables
```

## 3. Run the Database Schema

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create all tables and indexes

## 4. Key Changes Made

### Database Layer
- ✅ Replaced Prisma Client with Supabase Client
- ✅ Converted Prisma schema to SQL schema with RLS policies
- ✅ Updated all database queries to use Supabase syntax
- ✅ Maintained the same table structure and relationships

### Files Updated
- ✅ `src/lib/supabase.ts` - New Supabase client configuration
- ✅ `src/lib/tenant.ts` - Updated to use Supabase queries
- ✅ `src/lib/auth.ts` - Updated authentication logic
- ✅ `src/lib/customer-utils.ts` - Updated customer operations
- ✅ `src/lib/services/product.service.ts` - Rewritten for Supabase
- ✅ All API routes in `src/app/api/` - Updated to use Supabase
- ✅ `package.json` - Removed Prisma, added Supabase
- ✅ `README.md` - Updated setup instructions

### Files Removed
- ✅ `prisma/` directory (schema, migrations, seed)
- ✅ `src/lib/prisma.ts`

## 5. Benefits of Supabase

- **Real-time subscriptions** - Built-in real-time capabilities
- **Row Level Security** - Database-level security policies
- **Auto-generated APIs** - REST and GraphQL APIs
- **Built-in Auth** - Optional authentication system
- **Storage** - File storage capabilities
- **Edge Functions** - Serverless functions

## 6. Next Steps

1. Set up your Supabase project and environment variables
2. Run the SQL schema in your Supabase dashboard
3. Test the application to ensure everything works
4. Consider enabling Row Level Security policies for production
5. Optionally migrate to Supabase Auth if you want to replace Clerk

## 7. Row Level Security (RLS)

The schema includes basic RLS policies for tenant isolation. You may need to adjust these based on your specific security requirements.

## 8. Data Migration

If you have existing data in a Prisma/PostgreSQL database, you'll need to:

1. Export your data from the old database
2. Transform column names from camelCase to snake_case
3. Import the data into your Supabase database

## 9. Testing

Make sure to test all functionality:
- User authentication and tenant association
- Product CRUD operations
- Order processing
- Payment webhooks
- API endpoints

The migration maintains the same API structure, so your frontend should continue to work without changes.