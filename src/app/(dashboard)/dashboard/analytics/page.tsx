import { currentUser } from '@clerk/nextjs/server';
import { calculateAnalytics } from '@/lib/server-only-utils';
import AnalyticsClient from './analytics-client';
import { Button } from "@/components/ui/button";

interface AnalyticsPageProps {
  searchParams: Promise<{ timeRange?: string }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const user = await currentUser();
  const { timeRange = '30d' } = await searchParams;
  
  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Try multiple ways to get tenant ID (same as products page)
  const tenantId = (user.publicMetadata?.tenantId as string) || 
                   (user.privateMetadata?.tenantId as string) || 
                   user.id; // Fallback to user ID
  
  console.log('Analytics - User:', user.id, 'TenantId:', tenantId); // Debug log

  try {
    const analytics = await calculateAnalytics(tenantId, timeRange);
    
    // Mock data structure for now - replace with real analytics
    const analyticsData = {
      overview: [
        { month: "Jan", totalSales: 4000, newCustomers: 240 },
        { month: "Feb", totalSales: 3000, newCustomers: 139 },
        { month: "Mar", totalSales: 2000, newCustomers: 980 },
        { month: "Apr", totalSales: 2780, newCustomers: 390 },
        { month: "May", totalSales: 1890, newCustomers: 480 },
        { month: "Jun", totalSales: 2390, newCustomers: 380 },
        { month: "Jul", totalSales: 3490, newCustomers: 430 },
      ],
      trends: [
        { category: "Electronics", sales: 1500, units: 120 },
        { category: "Clothing", sales: 1200, units: 150 },
        { category: "Books", sales: 800, units: 200 },
        { category: "Home Goods", sales: 1000, units: 90 },
      ],
      stats: {
        totalSales: `$${analytics.revenue.toLocaleString()}`,
        newCustomers: `+${analytics.customers.toLocaleString()}`,
        conversionRate: 4.8
      }
    };

    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <AnalyticsClient 
          data={analyticsData} 
          timeRange={timeRange}
        />
        <div className="flex justify-end">
          <Button variant="outline">View All Reports</Button>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-xl font-semibold md:text-2xl">Analytics Overview</h1>
        <div className="text-center py-8 text-muted-foreground">
          Failed to load analytics data
        </div>
      </div>
    );
  }
}