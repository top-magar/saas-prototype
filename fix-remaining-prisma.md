# Remaining Prisma References to Fix

The following files still contain Prisma references that need to be manually updated to Supabase:

## High Priority (Core Functionality)
1. `src/app/api/dashboard/route.ts` - Dashboard analytics
2. `src/app/api/orders/route.ts` - Order management  
3. `src/app/api/products/categories/route.ts` - Product categories
4. `src/lib/server-only-utils.ts` - Server utilities

## Medium Priority (Features)
5. `src/app/api/coupons/route.ts` & `src/app/api/coupons/[id]/route.ts` - Coupon system
6. `src/app/api/stores/route.ts` - Store management
7. `src/lib/coupon-utils.ts` - Coupon utilities

## Lower Priority (Advanced Features)
8. Payment webhooks (`src/app/api/(payments)/webhooks/`)
9. `src/lib/services/store-builder.service.ts` - Store builder
10. Other API routes

## Quick Fix Pattern

For each file, replace Prisma patterns with Supabase equivalents:

### Find Operations
```typescript
// Prisma
const result = await prisma.table.findUnique({ where: { id } });
const results = await prisma.table.findMany({ where: { tenantId } });

// Supabase
const { data: result } = await supabase.from('table').select('*').eq('id', id).single();
const { data: results } = await supabase.from('table').select('*').eq('tenant_id', tenantId);
```

### Create Operations
```typescript
// Prisma
const result = await prisma.table.create({ data: { name, tenantId } });

// Supabase
const { data: result } = await supabase.from('table').insert({ name, tenant_id: tenantId }).select().single();
```

### Update Operations
```typescript
// Prisma
const result = await prisma.table.update({ where: { id }, data: { name } });

// Supabase
const { data: result } = await supabase.from('table').update({ name }).eq('id', id).select().single();
```

### Delete Operations
```typescript
// Prisma
await prisma.table.delete({ where: { id } });

// Supabase
await supabase.from('table').delete().eq('id', id);
```

### Count Operations
```typescript
// Prisma
const count = await prisma.table.count({ where: { tenantId } });

// Supabase
const { count } = await supabase.from('table').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId);
```

### Aggregate Operations
```typescript
// Prisma
const result = await prisma.table.aggregate({ _sum: { amount: true }, where: { tenantId } });

// Supabase - Use PostgreSQL functions or handle in application code
const { data } = await supabase.from('table').select('amount').eq('tenant_id', tenantId);
const sum = data?.reduce((acc, item) => acc + item.amount, 0) || 0;
```

## Column Name Changes
Remember to convert camelCase to snake_case:
- `tenantId` → `tenant_id`
- `userId` → `user_id`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`
- `primaryColor` → `primary_color`
- etc.