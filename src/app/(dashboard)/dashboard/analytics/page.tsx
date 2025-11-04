import { currentUser } from '@clerk/nextjs/server';
import { calculateAnalytics } from '@/lib/server-only-utils';
import AnalyticsClient from './analytics-client';

interface AnalyticsPageProps {
  searchParams: Promise<{ timeRange?: string }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const user = await currentUser();
  const { timeRange = '30d' } = await searchParams;
  
  if (!user) {
    return <div>Unauthorized</div>;
  }

  const tenantId = (user.publicMetadata?.tenantId as string) || 
                   (user.privateMetadata?.tenantId as string) || 
                   user.id;

  let analyticsData;
  let hasError = false;

  try {
    const analytics = await calculateAnalytics(tenantId, timeRange);
    
    analyticsData = {
      overview: [
        { month: "Jan", totalSales: 45000, newCustomers: 240, orders: 180, avgOrderValue: 250 },
        { month: "Feb", totalSales: 52000, newCustomers: 320, orders: 208, avgOrderValue: 250 },
        { month: "Mar", totalSales: 48000, newCustomers: 280, orders: 192, avgOrderValue: 250 },
        { month: "Apr", totalSales: 58000, newCustomers: 390, orders: 232, avgOrderValue: 250 },
        { month: "May", totalSales: 62000, newCustomers: 480, orders: 248, avgOrderValue: 250 },
        { month: "Jun", totalSales: 68000, newCustomers: 520, orders: 272, avgOrderValue: 250 },
        { month: "Jul", totalSales: 72000, newCustomers: 580, orders: 288, avgOrderValue: 250 },
      ],
      revenue: {
        chartData: [
          { month: "Jan", total: 45000, subscriptions: 28000, oneTime: 17000, refunds: 2000 },
          { month: "Feb", total: 52000, subscriptions: 32000, oneTime: 20000, refunds: 1800 },
          { month: "Mar", total: 48000, subscriptions: 30000, oneTime: 18000, refunds: 2200 },
          { month: "Apr", total: 58000, subscriptions: 36000, oneTime: 22000, refunds: 1500 },
          { month: "May", total: 62000, subscriptions: 38000, oneTime: 24000, refunds: 1200 },
          { month: "Jun", total: 68000, subscriptions: 42000, oneTime: 26000, refunds: 1000 },
        ],
        sources: [
          { source: "Subscriptions", amount: "$42,000", percentage: "61.8%", growth: "+12%" },
          { source: "One-time Purchases", amount: "$26,000", percentage: "38.2%", growth: "+8%" },
          { source: "Affiliate Commissions", amount: "$3,200", percentage: "4.7%", growth: "+25%" },
          { source: "Refunds", amount: "-$1,000", percentage: "-1.5%", growth: "-15%" },
        ],
        metrics: {
          mrr: 42000,
          arr: 504000,
          churnRate: 2.3,
          ltv: 1250,
          cac: 85
        }
      },
      customers: {
        segmentation: [
          { name: "New Customers", value: 580, color: "hsl(var(--chart-1))", growth: "+15%" },
          { name: "Returning Customers", value: 420, color: "hsl(var(--chart-2))", growth: "+8%" },
          { name: "High-Value Customers", value: 180, color: "hsl(var(--chart-3))", growth: "+22%" },
          { name: "At-Risk Customers", value: 65, color: "hsl(var(--chart-4))", growth: "-5%" },
        ],
        activities: [
          { id: 1, customer: "Alice Smith", activity: "Placed new order", time: "2 hours ago", value: "$450" },
          { id: 2, customer: "Bob Johnson", activity: "Upgraded subscription", time: "4 hours ago", value: "$99/mo" },
          { id: 3, customer: "Charlie Brown", activity: "Renewed subscription", time: "1 day ago", value: "$299" },
          { id: 4, customer: "Diana Prince", activity: "Downloaded report", time: "2 days ago", value: "Premium" },
          { id: 5, customer: "Eve Wilson", activity: "Cancelled subscription", time: "3 days ago", value: "-$49/mo" },
        ],
        demographics: {
          ageGroups: [
            { range: "18-24", count: 120, percentage: 12 },
            { range: "25-34", count: 380, percentage: 38 },
            { range: "35-44", count: 280, percentage: 28 },
            { range: "45-54", count: 150, percentage: 15 },
            { range: "55+", count: 70, percentage: 7 },
          ],
          locations: [
            { country: "Nepal", count: 450, percentage: 45 },
            { country: "India", count: 280, percentage: 28 },
            { country: "USA", count: 120, percentage: 12 },
            { country: "UK", count: 80, percentage: 8 },
            { country: "Others", count: 70, percentage: 7 },
          ]
        }
      },
      products: {
        performance: [
          { month: "Jan", sales: 28000, units: 180, profit: 12000, returns: 8 },
          { month: "Feb", sales: 32000, units: 210, profit: 14500, returns: 12 },
          { month: "Mar", sales: 30000, units: 195, profit: 13200, returns: 10 },
          { month: "Apr", sales: 36000, units: 230, profit: 16800, returns: 15 },
          { month: "May", sales: 38000, units: 245, profit: 18200, returns: 11 },
          { month: "Jun", sales: 42000, units: 270, profit: 21000, returns: 9 },
        ],
        topProducts: [
          { id: 1, name: "Premium Widget Pro", sales: 18500, units: 85, progress: 92, margin: 45 },
          { id: 2, name: "Deluxe Gadget Plus", sales: 14200, units: 120, progress: 78, margin: 38 },
          { id: 3, name: "Smart Tool Kit", sales: 12800, units: 95, progress: 68, margin: 42 },
          { id: 4, name: "Advanced Solution", sales: 9600, units: 65, progress: 52, margin: 35 },
          { id: 5, name: "Basic Starter Pack", sales: 7200, units: 180, progress: 45, margin: 25 },
        ],
        categories: [
          { id: 1, name: "Electronics", sales: 28500, count: 45, growth: "+18%", margin: 42 },
          { id: 2, name: "Software Tools", sales: 22000, count: 28, growth: "+25%", margin: 65 },
          { id: 3, name: "Home & Garden", sales: 15800, count: 62, growth: "+12%", margin: 35 },
          { id: 4, name: "Books & Media", sales: 8200, count: 85, growth: "+8%", margin: 28 },
        ],
        inventory: {
          lowStock: 12,
          outOfStock: 3,
          totalProducts: 248,
          avgStockLevel: 85
        }
      },
      marketing: {
        channels: [
          { channel: "Organic Search", visitors: 12500, conversions: 380, cost: 0, roas: "∞" },
          { channel: "Social Media", visitors: 8200, conversions: 245, cost: 2800, roas: "4.2x" },
          { channel: "Email Marketing", visitors: 5600, conversions: 420, cost: 450, roas: "12.8x" },
          { channel: "Paid Ads", visitors: 6800, conversions: 185, cost: 3200, roas: "2.8x" },
          { channel: "Referrals", visitors: 3200, conversions: 95, cost: 0, roas: "∞" },
        ],
        campaigns: [
          { name: "Summer Sale 2024", status: "Active", budget: 5000, spent: 3200, conversions: 145, roas: "3.2x" },
          { name: "Product Launch", status: "Completed", budget: 8000, spent: 7800, conversions: 280, roas: "4.1x" },
          { name: "Holiday Special", status: "Scheduled", budget: 12000, spent: 0, conversions: 0, roas: "0x" },
        ]
      },
      reports: {
        saved: [
          { id: 1, name: "Monthly Revenue Deep Dive", type: "Revenue", created: "2024-01-15", status: "Active", lastRun: "2 hours ago" },
          { id: 2, name: "Customer Acquisition Analysis", type: "Customers", created: "2024-01-10", status: "Active", lastRun: "1 day ago" },
          { id: 3, name: "Product Performance Q1", type: "Products", created: "2024-01-05", status: "Scheduled", lastRun: "Weekly" },
          { id: 4, name: "Marketing ROI Report", type: "Marketing", created: "2023-12-20", status: "Active", lastRun: "3 hours ago" },
          { id: 5, name: "Inventory Optimization", type: "Inventory", created: "2023-12-15", status: "Archived", lastRun: "1 month ago" },
        ]
      },
      stats: {
        totalSales: `$${analytics.revenue.toLocaleString()}`,
        newCustomers: `+${analytics.customers.toLocaleString()}`,
        conversionRate: 6.2,
        avgOrderValue: 250,
        totalOrders: 1680,
        activeSubscriptions: 420,
        churnRate: 2.3,
        customerSatisfaction: 4.7
      }
    };
  } catch {
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-xl font-semibold md:text-2xl">Analytics Overview</h1>
        <div className="text-center py-8 text-muted-foreground">
          Failed to load analytics data
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <AnalyticsClient 
        data={analyticsData} 
        timeRange={timeRange}
      />
    </div>
  );
}