# Row Level Security (RLS) Migration Guide

This migration adds Row Level Security policies to enforce tenant isolation at the database level.

## ⚠️ Before You Begin

**CRITICAL: Backup your database before running!**

```bash
# Create a backup
pg_dump -U postgres -d your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

## What This Migration Does

1. **Enables RLS** on all tenant-scoped tables
2. **Creates helper function** `get_current_tenant_id()` to retrieve current tenant from session
3. **Adds policies** for SELECT, INSERT, UPDATE, DELETE operations
4. **Enforces tenant isolation** - users can only access their own tenant's data

## How RLS Works

### Setting Tenant Context

Before executing queries, you must set the current tenant ID:

```sql
-- Set for current transaction
SET LOCAL app.current_tenant_id = 'your-tenant-uuid';

-- Now queries are automatically filtered
SELECT * FROM products; -- Only returns products for this tenant
```

### In Application Code

You'll need to update your database queries to set the tenant context:

```typescript
// Example: lib/database/with-tenant-context.ts
import { supabaseAdmin } from './supabase';

export async function withTenantContext<T>(
  tenantId: string,
  callback: () => Promise<T>
): Promise<T> {
  // Start a transaction and set tenant context
  const { data, error } = await supabaseAdmin.rpc('set_tenant_context', {
    tenant_uuid: tenantId
  });
  
  if (error) throw error;
  
  // Execute callback within tenant context
  return await callback();
}

// Usage:
const products = await withTenantContext(tenantId, async () => {
  return await supabaseAdmin.from('products').select('*');
});
```

## Running the Migration

### Option 1: Via Supabase CLI

```bash
# Apply migration
supabase db push
```

### Option 2: Via SQL Editor

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `add_rls_policies.sql`
3. Click "Run"

### Option 3: Via psql

```bash
psql -U postgres -d your_database -f supabase/migrations/add_rls_policies.sql
```

## Verification

After migration, verify RLS is active:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tenants', 'users', 'products', 'orders');

-- Should return rowsecurity = true for all
```

Test tenant isolation:

```sql
-- Set tenant A
SET LOCAL app.current_tenant_id = 'tenant-a-uuid';
SELECT count(*) FROM products; -- Returns tenant A's products

-- Set tenant B
SET LOCAL app.current_tenant_id = 'tenant-b-uuid';
SELECT count(*) FROM products; -- Returns tenant B's products (different count)
```

## Important Notes

### Service Role Key Bypass

⚠️ **The service role key BYPASSES RLS policies**

Be very careful when using `supabaseAdmin`:
- Always set tenant context explicitly
- Never expose service role key to client
- Use for admin operations only

### Existing Data

RLS policies apply to **future queries**, not existing data structure.  
- Existing data remains in database
- Queries will filter based on tenant_id
- No data migration needed

### Performance Considerations

RLS policies add WHERE clauses to queries:
```sql
-- Your query:
SELECT * FROM products;

-- What actually runs:
SELECT * FROM products WHERE tenant_id = get_current_tenant_id();
```

Ensure indexes exist:
- `tenant_id` columns should be indexed (already done in schema.sql)
- Consider composite indexes for frequently queried columns

## Rollback

If you need to undo this migration:

```sql
-- See rollback section at bottom of add_rls_policies.sql
-- Or run:
psql -U postgres -d your_database -f supabase/migrations/rollback_rls.sql
```

## Next Steps

After applying migration:

1. **Update database query layer** to set tenant context
2. **Test tenant isolation** thoroughly
3. **Add integration tests** for cross-tenant access attempts
4. **Monitor query performance** - RLS adds overhead

## Troubleshooting

### "Permission Denied" Errors

If you see permission denied after migration:
- Ensure `app.current_tenant_id` is set before queries
- Check user has `authenticated` or `anon` role
- Verify tenant_id matches in database

### Queries Return No Results

- Verify correct tenant_id is set
- Check `SELECT get_current_tenant_id();` returns expected UUID
- Ensure data has correct tenant_id value

### Performance Issues

- Check EXPLAIN ANALYZE on slow queries
- Ensure indexes on tenant_id columns
- Consider materialized views for complex joins

## Resources

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
