-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY; -- Table doesn't exist
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_CategoryToProduct" ENABLE ROW LEVEL SECURITY;

-- Basic tenant isolation policies
CREATE POLICY "Users can access their own tenant data" ON tenants FOR ALL USING (auth.uid()::text IN (SELECT "clerkUserId" FROM users WHERE "tenantId" = tenants.id));
CREATE POLICY "Users can access their own data" ON users FOR ALL USING ("clerkUserId" = auth.uid()::text);
CREATE POLICY "Tenant isolation for categories" ON categories FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM users WHERE "clerkUserId" = auth.uid()::text));
CREATE POLICY "Tenant isolation for products" ON products FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM users WHERE "clerkUserId" = auth.uid()::text));
CREATE POLICY "Tenant isolation for orders" ON orders FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM users WHERE "clerkUserId" = auth.uid()::text));
CREATE POLICY "Tenant isolation for webhooks" ON webhooks FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM users WHERE "clerkUserId" = auth.uid()::text));
CREATE POLICY "Tenant isolation for workflows" ON workflows FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM users WHERE "clerkUserId" = auth.uid()::text));
CREATE POLICY "Tenant isolation for stores" ON stores FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM users WHERE "clerkUserId" = auth.uid()::text));
CREATE POLICY "Tenant isolation for coupons" ON coupons FOR ALL USING ("tenantId" IN (SELECT "tenantId" FROM users WHERE "clerkUserId" = auth.uid()::text));

-- Service role bypass (for server-side operations)
CREATE POLICY "Service role bypass" ON tenants FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON users FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON categories FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON products FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON orders FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON webhooks FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON workflows FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON stores FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON coupons FOR ALL TO service_role USING (true);

-- Policies for remaining tables
CREATE POLICY "Service role bypass" ON sessions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON api_keys FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON media FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON product_options FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON product_option_values FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON product_variants FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON product_variant_option_values FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON order_items FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON payments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON audit_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON analytics_events FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON page_versions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON templates FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON pages FOR ALL TO service_role USING (true);
CREATE POLICY "Service role bypass" ON "_CategoryToProduct" FOR ALL TO service_role USING (true);