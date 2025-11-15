import { currentUser } from '@clerk/nextjs/server';
import DashboardClientPage, { DashboardData } from './dashboard-client-page';

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      stats: {
        totalSales: 18750,
        totalRevenue: 8945620.00,
        activeCustomers: 3420,
        refundRequests: 8,
      },
      overview: [
        { month: "Jan", totalSales: 5200, totalRevenue: 2800000 },
        { month: "Feb", totalSales: 4800, totalRevenue: 3200000 },
        { month: "Mar", totalSales: 6100, totalRevenue: 3600000 },
        { month: "Apr", totalSales: 5800, totalRevenue: 3100000 },
        { month: "May", totalSales: 7200, totalRevenue: 4200000 },
        { month: "Jun", totalSales: 6800, totalRevenue: 3900000 },
        { month: "Jul", totalSales: 8500, totalRevenue: 4800000 },
        { month: "Aug", totalSales: 9200, totalRevenue: 5200000 },
        { month: "Sep", totalSales: 8900, totalRevenue: 4900000 },
        { month: "Oct", totalSales: 10200, totalRevenue: 5800000 },
        { month: "Nov", totalSales: 11500, totalRevenue: 6400000 },
        { month: "Dec", totalSales: 12800, totalRevenue: 7200000 },
      ],
      recentOrders: [
        { id: "ORD2024001", product: "MacBook Pro M3", customer: "Rajesh Sharma", date: "2024-01-15", amount: 285000.00, status: "Completed" },
        { id: "ORD2024002", product: "iPhone 15 Pro", customer: "Priya Patel", date: "2024-01-15", amount: 165000.00, status: "Pending" },
        { id: "ORD2024003", product: "Samsung Galaxy S24", customer: "Amit Kumar", date: "2024-01-14", amount: 125000.00, status: "Completed" },
        { id: "ORD2024004", product: "Dell XPS 13", customer: "Sneha Thapa", date: "2024-01-14", amount: 195000.00, status: "Pending" },
        { id: "ORD2024005", product: "AirPods Pro", customer: "Bikash Rai", date: "2024-01-13", amount: 35000.00, status: "Completed" },
      ],
      topProducts: [
        { name: "MacBook Pro M3", percent: 92, earnings: 4200000 },
        { name: "iPhone 15 Pro", percent: 85, earnings: 3800000 },
        { name: "Samsung Galaxy S24", percent: 78, earnings: 3200000 },
        { name: "Dell XPS 13", percent: 72, earnings: 2900000 },
        { name: "AirPods Pro", percent: 65, earnings: 2400000 },
        { name: "iPad Pro", percent: 58, earnings: 2100000 },
      ],
    };
  } catch (error) {
    return null;
  }
}

export default async function DashboardPage() {
  let data = null;
  
  try {
    const [, dashboardData] = await Promise.all([
      currentUser(),
      getDashboardData()
    ]);
    data = dashboardData;
  } catch {
    // Error handled by returning null data
  }

  return <DashboardClientPage data={data} />;
}
