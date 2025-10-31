import { currentUser } from '@clerk/nextjs/server';
import DashboardClientPage, { DashboardData } from './dashboard-client-page';

async function getDashboardData(): Promise<DashboardData> {
    // Simulate fetching data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return {
        stats: {
          totalSales: 12345,
          totalRevenue: 45231.89,
          activeCustomers: 2350,
          refundRequests: 12,
        },
        overview: [
          { month: "Jan", totalSales: 4000, totalRevenue: 15000 },
          { month: "Feb", totalSales: 3000, totalRevenue: 18000 },
          { month: "Mar", totalSales: 2000, totalRevenue: 17000 },
          { month: "Apr", totalSales: 2780, totalRevenue: 16000 },
          { month: "May", totalSales: 1890, totalRevenue: 20000 },
          { month: "Jun", totalSales: 2390, totalRevenue: 22000 },
          { month: "Jul", totalSales: 3490, totalRevenue: 25000 },
        ],
        recentOrders: [
          { id: "ORD001", product: "Laptop Pro", customer: "Alice Smith", date: "2023-10-20", amount: 1200.00, status: "Completed" },
          { id: "ORD002", product: "Wireless Mouse", customer: "Bob Johnson", date: "2023-10-22", amount: 25.50, status: "Pending" },
          { id: "ORD003", product: "Mechanical Keyboard", customer: "Charlie Brown", date: "2023-10-21", amount: 150.00, status: "Completed" },
        ],
        topProducts: [
          { name: "Laptop Pro", percent: 80, earnings: 25000 },
          { name: "Smartphone X", percent: 60, earnings: 18000 },
          { name: "Smartwatch Z", percent: 50, earnings: 15000 },
        ],
      };
}

export default async function DashboardPage() {
  const user = await currentUser();
  const data = await getDashboardData();

  return <DashboardClientPage data={data} />;
}
