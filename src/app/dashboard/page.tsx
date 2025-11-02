import { currentUser } from '@clerk/nextjs/server';
import DashboardClientPage, { DashboardData } from './dashboard-client-page';

async function getDashboardData(): Promise<DashboardData> {
    // Simulate fetching data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return {
        stats: {
          totalSales: 12345,
          totalRevenue: 5427827.00, // NPR (45231.89 * 120)
          activeCustomers: 2350,
          refundRequests: 12,
        },
        overview: [
          { month: "Jan", totalSales: 4000, totalRevenue: 1800000 },
          { month: "Feb", totalSales: 3000, totalRevenue: 2160000 },
          { month: "Mar", totalSales: 2000, totalRevenue: 2040000 },
          { month: "Apr", totalSales: 2780, totalRevenue: 1920000 },
          { month: "May", totalSales: 1890, totalRevenue: 2400000 },
          { month: "Jun", totalSales: 2390, totalRevenue: 2640000 },
          { month: "Jul", totalSales: 3490, totalRevenue: 3000000 },
        ],
        recentOrders: [
          { id: "ORD001", product: "Laptop Pro", customer: "Alice Smith", date: "2023-10-20", amount: 144000.00, status: "Completed" },
          { id: "ORD002", product: "Wireless Mouse", customer: "Bob Johnson", date: "2023-10-22", amount: 3060.00, status: "Pending" },
          { id: "ORD003", product: "Mechanical Keyboard", customer: "Charlie Brown", date: "2023-10-21", amount: 18000.00, status: "Completed" },
        ],
        topProducts: [
          { name: "Laptop Pro", percent: 80, earnings: 3000000 },
          { name: "Smartphone X", percent: 60, earnings: 2160000 },
          { name: "Smartwatch Z", percent: 50, earnings: 1800000 },
        ],
      };
}

export default async function DashboardPage() {
  const user = await currentUser();
  const data = await getDashboardData();

  return <DashboardClientPage data={data} />;
}
