import { currentUser } from '@clerk/nextjs/server';
import OrdersClient from './orders-client';

export default async function OrdersPage() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Unauthorized</div>;
  }

  const ordersData = {
    stats: {
      totalOrders: 1680,
      pendingOrders: 45,
      completedOrders: 1580,
      cancelledOrders: 55,
      totalRevenue: 420000,
      avgOrderValue: 250,
      fulfillmentRate: 94.2,
      avgProcessingTime: 2.3
    },
    recentOrders: [
      { id: "ORD-2024-1245", customer: "Alice Johnson", product: "Premium Widget Pro", date: "2024-01-15", amount: 450, status: "Completed" },
      { id: "ORD-2024-1244", customer: "Bob Smith", product: "Deluxe Gadget Plus", date: "2024-01-15", amount: 320, status: "Processing" },
      { id: "ORD-2024-1243", customer: "Charlie Brown", product: "Smart Tool Kit", date: "2024-01-14", amount: 280, status: "Pending" },
      { id: "ORD-2024-1242", customer: "Diana Prince", product: "Advanced Solution", date: "2024-01-14", amount: 520, status: "Completed" },
      { id: "ORD-2024-1241", customer: "Eve Wilson", product: "Basic Starter Pack", date: "2024-01-13", amount: 180, status: "Shipped" },
      { id: "ORD-2024-1240", customer: "Frank Miller", product: "Premium Widget Pro", date: "2024-01-13", amount: 450, status: "Completed" },
      { id: "ORD-2024-1239", customer: "Grace Lee", product: "Deluxe Gadget Plus", date: "2024-01-12", amount: 320, status: "Cancelled" },
      { id: "ORD-2024-1238", customer: "Henry Davis", product: "Smart Tool Kit", date: "2024-01-12", amount: 280, status: "Completed" },
    ],
    ordersByStatus: [
      { status: "Completed", count: 1580, percentage: 94.0, color: "hsl(var(--chart-1))" },
      { status: "Processing", count: 28, percentage: 1.7, color: "hsl(var(--chart-2))" },
      { status: "Pending", count: 17, percentage: 1.0, color: "hsl(var(--chart-3))" },
      { status: "Cancelled", count: 55, percentage: 3.3, color: "hsl(var(--chart-4))" },
    ],
    orderTrends: [
      { month: "Jan", orders: 180, revenue: 45000, avgValue: 250 },
      { month: "Feb", orders: 208, revenue: 52000, avgValue: 250 },
      { month: "Mar", orders: 192, revenue: 48000, avgValue: 250 },
      { month: "Apr", orders: 232, revenue: 58000, avgValue: 250 },
      { month: "May", orders: 248, revenue: 62000, avgValue: 250 },
      { month: "Jun", orders: 272, revenue: 68000, avgValue: 250 },
    ],
    topProducts: [
      { name: "Premium Widget Pro", orders: 285, revenue: 128250, avgValue: 450 },
      { name: "Deluxe Gadget Plus", orders: 420, revenue: 134400, avgValue: 320 },
      { name: "Smart Tool Kit", orders: 315, revenue: 88200, avgValue: 280 },
      { name: "Advanced Solution", orders: 180, revenue: 93600, avgValue: 520 },
      { name: "Basic Starter Pack", orders: 480, revenue: 86400, avgValue: 180 },
    ]
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <OrdersClient data={ordersData} />
    </div>
  );
}