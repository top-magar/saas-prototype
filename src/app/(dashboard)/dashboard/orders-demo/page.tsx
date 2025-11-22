import OrdersTableDemo from '@/components/orders/OrdersTableDemo';

export default function OrdersDemoPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Orders Table Demo</h1>
                <p className="text-muted-foreground mt-2">
                    Self-contained client-side orders table with enhanced UI/UX features
                </p>
            </div>
            <OrdersTableDemo />
        </div>
    );
}
