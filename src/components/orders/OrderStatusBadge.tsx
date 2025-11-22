'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { PaymentStatus, FulfillmentStatus } from '@/types/orders';

interface OrderStatusBadgeProps {
    status: PaymentStatus | FulfillmentStatus;
    type: 'payment' | 'fulfillment';
}

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    authorized: 'bg-blue-100 text-blue-800 border-blue-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    partially_refunded: 'bg-orange-100 text-orange-800 border-orange-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    voided: 'bg-red-100 text-red-800 border-red-200'
};

const FULFILLMENT_STATUS_COLORS: Record<FulfillmentStatus, string> = {
    unfulfilled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    partially_fulfilled: 'bg-blue-100 text-blue-800 border-blue-200',
    fulfilled: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    pending: 'Pending',
    authorized: 'Authorized',
    paid: 'Paid',
    partially_refunded: 'Partially Refunded',
    refunded: 'Refunded',
    voided: 'Voided'
};

const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
    unfulfilled: 'Unfulfilled',
    partially_fulfilled: 'Partially Fulfilled',
    fulfilled: 'Fulfilled',
    cancelled: 'Cancelled'
};

const PAYMENT_STATUS_TOOLTIPS: Record<PaymentStatus, string> = {
    pending: 'Waiting for payment',
    authorized: 'Payment authorized but not captured',
    paid: 'Payment received',
    partially_refunded: 'Part of payment returned to customer',
    refunded: 'Full payment returned to customer',
    voided: 'Payment cancelled'
};

const FULFILLMENT_STATUS_TOOLTIPS: Record<FulfillmentStatus, string> = {
    unfulfilled: 'Order not yet shipped',
    partially_fulfilled: 'Some items shipped',
    fulfilled: 'All items delivered',
    cancelled: 'Order cancelled'
};

export function OrderStatusBadge({ status, type }: OrderStatusBadgeProps) {
    const colors = type === 'payment'
        ? PAYMENT_STATUS_COLORS[status as PaymentStatus]
        : FULFILLMENT_STATUS_COLORS[status as FulfillmentStatus];

    const label = type === 'payment'
        ? PAYMENT_STATUS_LABELS[status as PaymentStatus]
        : FULFILLMENT_STATUS_LABELS[status as FulfillmentStatus];

    const tooltip = type === 'payment'
        ? PAYMENT_STATUS_TOOLTIPS[status as PaymentStatus]
        : FULFILLMENT_STATUS_TOOLTIPS[status as FulfillmentStatus];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors} cursor-help`}
                        role="status"
                        aria-label={`${type === 'payment' ? 'Payment' : 'Fulfillment'} status: ${label}`}
                    >
                        {label}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
