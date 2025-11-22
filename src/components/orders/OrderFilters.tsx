'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { OrderFilter } from '@/types/orders';

interface OrderFiltersProps {
    onFilterChange: (filters: Partial<OrderFilter>) => void;
    currentFilters: {
        paymentStatus: string;
        fulfillmentStatus: string;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        search: string;
    };
}

export function OrderFilters({ onFilterChange, currentFilters }: OrderFiltersProps) {
    const [search, setSearch] = useState(currentFilters.search);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ search, page: 1 });
    };

    // Quick filter presets
    const quickFilters = [
        { label: 'All Orders', payment: 'all', fulfillment: 'all' },
        { label: 'To Fulfill', payment: 'paid', fulfillment: 'unfulfilled' },
        { label: 'Pending Payment', payment: 'pending', fulfillment: 'all' },
        { label: 'Completed', payment: 'paid', fulfillment: 'fulfilled' },
    ];

    const activeQuickFilter = quickFilters.findIndex(
        f => f.payment === currentFilters.paymentStatus && f.fulfillment === currentFilters.fulfillmentStatus
    );

    return (
        <div className="space-y-3 md:space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-11 md:h-10 text-base md:text-sm touch-manipulation"
                    />
                </div>
                <Button type="submit" size="default" className="h-11 md:h-10 px-6 touch-manipulation">
                    Search
                </Button>

                {/* Advanced Filters */}
                <Sheet open={showAdvanced} onOpenChange={setShowAdvanced}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-11 w-11 md:h-10 md:w-10 touch-manipulation flex-shrink-0">
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85vw] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Advanced Filters</SheetTitle>
                            <SheetDescription>
                                Fine-tune your order search
                            </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Payment Status</label>
                                <Select
                                    value={currentFilters.paymentStatus}
                                    onValueChange={(value) => {
                                        onFilterChange({ payment_status: value as any, page: 1 });
                                        setShowAdvanced(false);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="authorized">Authorized</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                        <SelectItem value="voided">Voided</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Fulfillment Status</label>
                                <Select
                                    value={currentFilters.fulfillmentStatus}
                                    onValueChange={(value) => {
                                        onFilterChange({ fulfillment_status: value as any, page: 1 });
                                        setShowAdvanced(false);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                                        <SelectItem value="partially_fulfilled">Partially Fulfilled</SelectItem>
                                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Sort By</label>
                                <Select
                                    value={currentFilters.sortBy}
                                    onValueChange={(value) => {
                                        onFilterChange({ sortBy: value as any, page: 1 });
                                        setShowAdvanced(false);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="created_at">Date Created</SelectItem>
                                        <SelectItem value="updated_at">Date Updated</SelectItem>
                                        <SelectItem value="total">Total Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Order</label>
                                <Select
                                    value={currentFilters.sortOrder}
                                    onValueChange={(value) => {
                                        onFilterChange({ sortOrder: value as 'asc' | 'desc', page: 1 });
                                        setShowAdvanced(false);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Newest First</SelectItem>
                                        <SelectItem value="asc">Oldest First</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </form>


            {/* Quick Filter Tabs - Scrollable on Mobile */}
            <Tabs
                value={String(activeQuickFilter >= 0 ? activeQuickFilter : 0)}
                onValueChange={(value) => {
                    const filter = quickFilters[Number(value)];
                    onFilterChange({
                        payment_status: filter.payment as any,
                        fulfillment_status: filter.fulfillment as any,
                        page: 1
                    });
                }}
                className="w-full"
            >
                <TabsList className="w-full h-auto flex-col sm:flex-row gap-1 p-1">
                    {quickFilters.map((filter, index) => (
                        <TabsTrigger
                            key={index}
                            value={String(index)}
                            className="flex-1 h-11 sm:h-10 text-sm touch-manipulation data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            {filter.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
