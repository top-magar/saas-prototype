// Order Management Types

export type PaymentStatus =
    | 'pending'
    | 'authorized'
    | 'paid'
    | 'partially_refunded'
    | 'refunded'
    | 'voided';

export type FulfillmentStatus =
    | 'unfulfilled'
    | 'partially_fulfilled'
    | 'fulfilled'
    | 'cancelled';

export type OrderSortKey =
    | 'created_at'
    | 'updated_at'
    | 'processed_at'
    | 'total'
    | 'payment_status'
    | 'fulfillment_status';

export type SortOrder = 'asc' | 'desc';

export interface Address {
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    zip: string;
    country: string;
    phone?: string;
}

export interface OrderLineItem {
    id: string;
    order_id: string;
    product_id?: string;
    product_name: string;
    variant_id?: string;
    variant_title?: string;
    quantity: number;
    price_minor_units: number;
    total_minor_units: number;
    sku?: string;
    created_at: string;
}

export interface OrderFulfillment {
    id: string;
    order_id: string;
    status: 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
    tracking_number?: string;
    tracking_company?: string;
    tracking_url?: string;
    shipped_at?: string;
    estimated_delivery_at?: string;
    delivered_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    tenant_id: string;
    order_number: string;

    customer_id?: string;
    customer_email?: string;
    customer_name?: string;

    billing_address?: Address;
    shipping_address?: Address;

    subtotal_minor_units?: number;
    tax_minor_units?: number;
    shipping_minor_units?: number;
    discount_minor_units?: number;
    total_minor_units: number;
    currency_code?: string;

    payment_status: PaymentStatus;
    payment_method?: string;
    fulfillment_status: FulfillmentStatus;

    tags?: string[];
    notes?: string;

    line_items?: OrderLineItem[];
    fulfillments?: OrderFulfillment[];

    created_at: string;
    updated_at: string;
    processed_at?: string;
}

export interface OrderFilter {
    page?: number;
    limit?: number;
    payment_status?: PaymentStatus | 'all';
    fulfillment_status?: FulfillmentStatus | 'all';
    search?: string;
    sortBy?: OrderSortKey;
    sortOrder?: SortOrder;
    dateFrom?: string;
    dateTo?: string;
}

export interface OrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    fulfillmentRate: number;
    avgProcessingTime: number;
}
