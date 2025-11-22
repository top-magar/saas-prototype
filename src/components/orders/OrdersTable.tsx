'use client';

import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderCard } from './OrderCard';
import { usePreferences } from '@/app/context/preferences-context';
import { Package, Plus, MoreHorizontal } from 'lucide-react';
import type { Order } from '@/types/orders';

interface OrdersTableProps {
    orders: Order[];
    loading: boolean;
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
}

export function OrdersTable({
    orders,
    loading,
    page,
    limit,
    total,
    onPageChange
}: OrdersTableProps) {
    const { formatCurrency, formatDateTime } = usePreferences();
    const totalPages = Math.ceil(total / limit);

    // Loading skeleton
    if (loading) {
        return (
            <div className="space-y-3">
                {/* Mobile skeleton */}
                <div className="md:hidden space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop skeleton */}
                <div className="hidden md:block space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Skeleton className="h-12 w-24" />
                            <Skeleton className="h-12 flex-1" />
                            <Skeleton className="h-12 w-32" />
                            <Skeleton className="h-12 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state with helpful message
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 border border-dashed rounded-lg bg-muted/20">
                <div className="p-4 bg-muted rounded-full mb-4">
                    <Package className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-sm md:text-base text-muted-foreground text-center mb-4 max-w-sm px-4">
                    When customers place orders, they'll appear here. Start by adding products to your store.
                </p>
                <Button asChild size="sm" className="md:size-default">
                    <Link href="/dashboard/products">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Products
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-border/50">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead className="font-semibold">Order</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Payment</TableHead>
                            <TableHead className="font-semibold">Fulfillment</TableHead>
                            <TableHead className="text-right font-semibold">Total</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow
                                key={order.id}
                                className="hover:bg-muted/20 cursor-pointer transition-colors"
                            >
                                <TableCell>
                                    <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        className="font-medium text-primary hover:underline"
                                        aria-label={`View order ${order.order_number}`}
                                    >
                                        #{order.order_number}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{order.customer_name || 'Guest'}</div>
                                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                            {order.customer_email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDateTime(order.created_at)}
                                </TableCell>
                                <TableCell>
                                    <OrderStatusBadge status={order.payment_status} type="payment" />
                                </TableCell>
                                <TableCell>
                                    <OrderStatusBadge status={order.fulfillment_status} type="fulfillment" />
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {formatCurrency(order.total_minor_units || 0)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/orders/${order.id}/edit`}>Edit Order</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination - Mobile Optimized */}
            {totalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2">
                    <div className="text-xs md:text-sm text-muted-foreground order-2 md:order-1">
                        Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total.toLocaleString()}
                    </div>
                    <Pagination className="order-1 md:order-2">
                        <PaginationContent>
                            <PaginationPrevious
                                onClick={() => page > 1 && onPageChange(page - 1)}
                                className={`${page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} h-10 w-10 md:h-auto md:w-auto touch-manipulation`}
                                aria-disabled={page === 1}
                            />

                            {/* Show fewer pages on mobile */}
                            {Array.from({ length: Math.min(totalPages, window.innerWidth < 768 ? 3 : 5) }, (_, i) => {
                                let pageNum;
                                const maxPages = window.innerWidth < 768 ? 3 : 5;
                                if (totalPages <= maxPages) {
                                    pageNum = i + 1;
                                } else if (page <= 2) {
                                    pageNum = i + 1;
                                } else if (page >= totalPages - 1) {
                                    pageNum = totalPages - (maxPages - 1) + i;
                                } else {
                                    pageNum = page - 1 + i;
                                }

                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            onClick={() => onPageChange(pageNum)}
                                            isActive={page === pageNum}
                                            className="cursor-pointer h-10 w-10 touch-manipulation"
                                            aria-label={`Go to page ${pageNum}`}
                                            aria-current={page === pageNum ? 'page' : undefined}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationNext
                                onClick={() => page < totalPages && onPageChange(page + 1)}
                                className={`${page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} h-10 w-10 md:h-auto md:w-auto touch-manipulation`}
                                aria-disabled={page === totalPages}
                            />
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
