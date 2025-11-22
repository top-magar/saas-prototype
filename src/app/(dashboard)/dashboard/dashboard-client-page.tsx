'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { StatCard } from './_components/stat-card';
import { RecentOrders } from './_components/recent-orders';
import { ExternalLink, BarChart, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, EmptyHeader } from '@/components/ui/empty';
import { motion } from 'framer-motion';
import { ChartConfig } from '@/components/ui/chart';
import { InteractiveBarChart } from './_components/interactive-bar-chart';
import { useCurrency } from '@/hooks/use-currency';

const OverviewChart = dynamic(() => import('./_components/overview-chart').then(mod => mod.OverviewChart), {
  ssr: false,
  loading: () => <Skeleton className="h-80" />,
});

interface ChartData {
  month: string;
  totalSales: number;
  totalRevenue: number;
}

interface Order {
  id: string;
  product: string;
  customer: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

interface Product {
  name: string;
  percent: number;
  earnings: number;
}

export interface DashboardData {
  stats: {
    totalSales: number;
    totalRevenue: number;
    activeCustomers: number;
    refundRequests: number;
  };
  overview: ChartData[];
  recentOrders: Order[];
  topProducts: Product[];
}

const salesByChannelData = [
  { name: "Online", value: 68, fill: "var(--color-online)" },
  { name: "Store", value: 22, fill: "var(--color-store)" },
  { name: "Mobile App", value: 7, fill: "var(--color-mobile)" },
  { name: "Referral", value: 3, fill: "var(--color-referral)" },
];

const salesByChannelConfig = {
  online: { label: "Online", color: "hsl(var(--chart-1))" },
  store: { label: "Store", color: "hsl(var(--chart-2))" },
  mobile: { label: "Mobile App", color: "hsl(var(--chart-3))" },
  referral: { label: "Referral", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export default function DashboardClientPage({ data }: { data: DashboardData | null }) {
  const { data: session } = useSession();
  const { formatCurrency } = useCurrency();
  const [timeframe, setTimeframe] = useState("30d");

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (!data) {
    return (

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-80" />
          </div>
          <div>
            <Skeleton className="h-80" />
          </div>
        </div>
        <Skeleton className="h-96" />
      </div>

    );
  }

  return (

    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-3 md:gap-0 mb-4 md:mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {getTimeBasedGreeting()}, {session?.user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              Here are your stats for today — {getTodayDate()}
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hidden md:flex">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </div>

      {data.stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <StatCard
            name="Total Sales"
            value={data.stats.totalSales.toLocaleString()}
            change="+24.8%"
            changeType="positive"
            index={0}
            total={4}
          />
          <StatCard
            name="Total Revenue"
            value={formatCurrency(data.stats.totalRevenue)}
            change="+18.2%"
            changeType="positive"
            index={1}
            total={4}
          />
          <StatCard
            name="Active Customers"
            value={data.stats.activeCustomers.toLocaleString()}
            change="+12.5%"
            changeType="positive"
            index={2}
            total={4}
          />
          <StatCard
            name="Refund Requests"
            value={data.stats.refundRequests.toLocaleString()}
            change="-8.3%"
            changeType="negative"
            index={3}
            total={4}
          />
        </div>
      )}

      <div className="bg-background border border-border/50 p-4 md:p-8">
        <div className="text-sm font-mono font-semibold uppercase tracking-wide mb-6">PERFORMANCE</div>
        {data.overview && data.overview.length > 0 ? (
          <OverviewChart data={data.overview} />
        ) : (
          <Empty>
            <EmptyMedia variant="icon">
              <BarChart className="size-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyContent>
              <EmptyHeader>
                <EmptyTitle>No Performance Data</EmptyTitle>
                <EmptyDescription>
                  Sales and revenue data will appear here once you start processing orders.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        )}
      </div>

      <div className="bg-background border border-border/50 p-3 md:p-4">
        <div className="text-sm font-mono font-semibold uppercase tracking-wide mb-4">RECENT ACTIVITY</div>
        {data.recentOrders && data.recentOrders.length > 0 ? (
          <RecentOrders data={data.recentOrders} />
        ) : (
          <Empty>
            <EmptyMedia variant="icon">
              <ShoppingBag className="size-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyContent>
              <EmptyHeader>
                <EmptyTitle>No Recent Orders</EmptyTitle>
                <EmptyDescription>
                  New orders from your store will be listed here.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </motion.div>

  );
}