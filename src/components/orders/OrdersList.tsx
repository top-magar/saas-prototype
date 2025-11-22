'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter } from 'lucide-react';
import type { Order, OrdersResponse } from '@/types/orders';
import { usePreferences } from '@/app/context/preferences-context';

interface OrdersListProps {
    tenantId: string;
}

export function OrdersList({ tenantId }: OrdersListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { formatCurrency } = usePreferences();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Parse filters from URL
    const page = +(searchParams?.get('page') || 1);
    const limit = +(searchParams?.get('limit') || 50);
    const paymentStatus = (searchParams?.get('payment_status') as string) || 'all';
    const fulfillmentStatus = (searchParams?.get('fulfillment_status') as string) || 'all';
    const sortBy = (searchParams?.get('sort') as string) || 'created_at';
    const sortOrder = (searchParams?.get('order') as 'asc' | 'desc') || 'desc';
    const search = (searchParams?.get('search') as string) || '';

    // Sync search query with URL
    useEffect(() => {
        setSearchQuery(search);
    }, [search]);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('tenantId', tenantId);
            params.append('page', String(page));
            params.append('limit', String(limit));
            if (paymentStatus !== 'all') params.append('payment_status', paymentStatus);
            if (fulfillmentStatus !== 'all') params.append('fulfillment_status', fulfillmentStatus);
            if (search) params.append('search', search);
            params.append('sort', sortBy);
            params.append('order', sortOrder);

            const response = await fetch(`/api/orders?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch orders');

            const data: OrdersResponse = await response.json();
            setOrders(data.orders);
            setTotalCount(data.total);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    }, [tenantId, page, limit, paymentStatus, fulfillmentStatus, search, sortBy, sortOrder]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Update URL with new search/filters
    const updateFilters = (updates: Record<string, string | number>) => {
        const params = new URLSearchParams();

        const allFilters = {
            page: updates.page !== undefined ? updates.page : page,
            limit: updates.limit !== undefined ? updates.limit : limit,
            payment_status: updates.payment_status !== undefined ? updates.payment_status : paymentStatus,
            fulfillment_status: updates.fulfillment_status !== undefined ? updates.fulfillment_status : fulfillmentStatus,
            sort: updates.sort !== undefined ? updates.sort : sortBy,
            order: updates.order !== undefined ? updates.order : sortOrder,
            search: updates.search !== undefined ? updates.search : search
        };

        Object.entries(allFilters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.append(key, String(value));
            }
        });

        router.push(`?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchQuery, page: 1 });
    };

    // Combine payment and fulfillment status into single filter
    const statusFilter = useMemo(() => {
        if (paymentStatus === 'all' && fulfillmentStatus === 'all') return 'all';
        if (paymentStatus === 'paid' && fulfillmentStatus === 'unfulfilled') return 'unfulfilled';
        if (paymentStatus === 'pending' && fulfillmentStatus === 'all') return 'pending';
        if (paymentStatus === 'paid' && fulfillmentStatus === 'fulfilled') return 'fulfilled';
        return 'all';
    }, [paymentStatus, fulfillmentStatus]);

    const handleStatusFilterChange = (value: string) => {
        let newPaymentStatus = 'all';
        let newFulfillmentStatus = 'all';

        switch (value) {
            case 'unfulfilled':
                newPaymentStatus = 'paid';
                newFulfillmentStatus = 'unfulfilled';
                break;
            case 'pending':
                newPaymentStatus = 'pending';
                newFulfillmentStatus = 'all';
                break;
            case 'fulfilled':
                newPaymentStatus = 'paid';
                newFulfillmentStatus = 'fulfilled';
                break;
        }

        updateFilters({
            payment_status: newPaymentStatus,
            fulfillment_status: newFulfillmentStatus,
            page: 1
        });
    };

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_minor_units || 0), 0);
        const pendingOrders = orders.filter(o => o.payment_status === 'pending').length;
        const deliveredOrders = orders.filter(o => o.fulfillment_status === 'fulfilled').length;

        return {
            totalOrders: totalCount,
            totalRevenue,
            pendingOrders,
            deliveredOrders,
        };
    }, [orders, totalCount]);

    return (
        <div className="space-y-6">
            {/* Filters and Search - Like Reference */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e);
                            }
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="w-full sm:w-40">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="unfulfilled">To Fulfill</SelectItem>
                            <SelectItem value="pending">Pending Payment</SelectItem>
                            <SelectItem value="fulfilled">Completed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Table */}
            <OrdersTable
                orders={orders}
                loading={loading}
                page={page}
                limit={limit}
                total={totalCount}
                onPageChange={(newPage) => updateFilters({ page: newPage })}
            />

            {/* Summary Stats at Bottom - Like Reference */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{summaryStats.totalOrders}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                        {formatCurrency(summaryStats.totalRevenue)}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                        {summaryStats.pendingOrders}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Delivered Orders</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                        {summaryStats.deliveredOrders}
                    </p>
                </div>
            </div>
        </div>
    );
}
