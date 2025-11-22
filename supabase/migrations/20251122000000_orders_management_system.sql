-- Orders Management System Enhancement Migration
-- Adds Shopify-style order management capabilities

-- Add new columns to existing orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
  ADD COLUMN IF NOT EXISTS billing_address JSONB,
  ADD COLUMN IF NOT EXISTS shipping_address JSONB,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, authorized, paid, partially_refunded, refunded, voided';
COMMENT ON COLUMN orders.fulfillment_status IS 'Fulfillment status: unfulfilled, partially_fulfilled, fulfilled, cancelled';
COMMENT ON COLUMN orders.billing_address IS 'Billing address as JSON';
COMMENT ON COLUMN orders.shipping_address IS 'Shipping address as JSON';
COMMENT ON COLUMN orders.tags IS 'Tags for organization and filtering';

-- Create performance indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(tenant_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(tenant_id, fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON orders(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(tenant_id, customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(tenant_id, order_number);

-- Create order_line_items table (if not exists)
CREATE TABLE IF NOT EXISTS order_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  product_id UUID,
  product_name VARCHAR(255) NOT NULL,
  variant_id UUID,
  variant_title VARCHAR(255),
  
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_minor_units BIGINT NOT NULL,
  total_minor_units BIGINT NOT NULL,
  
  sku VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id ON order_line_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_line_items_product_id ON order_line_items(product_id);

-- Create order_fulfillments table (if not exists)
CREATE TABLE IF NOT EXISTS order_fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  tracking_number VARCHAR(255),
  tracking_company VARCHAR(100),
  tracking_url TEXT,
  
  shipped_at TIMESTAMP WITH TIME ZONE,
  estimated_delivery_at DATE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_fulfillments_order_id ON order_fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_order_fulfillments_status ON order_fulfillments(status);

COMMENT ON TABLE order_fulfillments IS 'Shipment tracking information for orders';
COMMENT ON COLUMN order_fulfillments.status IS 'Fulfillment status: scheduled, in_transit, delivered, failed, cancelled';
