'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { OrderStatusBadge } from './OrderStatusBadge';
import { usePreferences } from '@/app/context/preferences-context';
import { Calendar, User, MoreHorizontal } from 'lucide-react';
import type { Order } from '@/types/orders';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const { formatCurrency, formatDateTime } = usePreferences();

    return (
        <Card className="hover:bg-muted/20 transition-colors">
            <CardContent className="p-4">
                <div className="space-y-3">
                    {/* Header: Order Number + Action Menu */}
                    <div className="flex items-start justify-between gap-2">
                        <Link href={`/dashboard/orders/${order.id}`} className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate">
                                #{order.order_number}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {formatDateTime(order.created_at)}
                            </p>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <p className="text-lg font-bold">
                            {formatCurrency(order.total_minor_units || 0)}
                        </p>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{order.customer_name || 'Guest'}</p>
                            <p className="text-xs text-muted-foreground truncate">{order.customer_email}</p>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                        <OrderStatusBadge status={order.payment_status} type="payment" />
                        <OrderStatusBadge status={order.fulfillment_status} type="fulfillment" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
