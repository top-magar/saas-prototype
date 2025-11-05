'use client';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { StatCard } from './_components/stat-card';
import { RecentOrders } from './_components/recent-orders';
import { Download, Package } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { ButtonGroup } from '@/components/ui/button-group';
import dynamic from 'next/dynamic';

import { InteractiveBarChart } from './_components/interactive-bar-chart';

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
  const { user } = useUser();
  const [timeframe, setTimeframe] = useState("30d");

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
        className="flex flex-col gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName} 👋</h1>
          <p className="text-base text-muted-foreground">
            An overview of customer insights, sales performance, and revenue analytics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ButtonGroup>
            <Button
              variant={timeframe === "7d" ? "default" : "outline"}
              onClick={() => setTimeframe("7d")}
            >
              7D
            </Button>
            <Button
              variant={timeframe === "30d" ? "default" : "outline"}
              onClick={() => setTimeframe("30d")}
            >
              30D
            </Button>
            <Button
              variant={timeframe === "90d" ? "default" : "outline"}
              onClick={() => setTimeframe("90d")}
            >
              90D
            </Button>
          </ButtonGroup>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {data.stats && (
        <motion.div
          className="mx-auto grid grid-cols-1 gap-px rounded-xl bg-border sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <StatCard
              name="Total Sales"
              value={data.stats.totalSales.toLocaleString()}
              change="+24.8%"
              changeType="positive"
              index={0}
              total={4}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              name="Total Revenue"
              value={`NPR ${data.stats.totalRevenue.toLocaleString()}`}
              change="+18.2%"
              changeType="positive"
              index={1}
              total={4}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              name="Active Customers"
              value={data.stats.activeCustomers.toLocaleString()}
              change="+12.5%"
              changeType="positive"
              index={2}
              total={4}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              name="Refund Requests"
              value={data.stats.refundRequests.toLocaleString()}
              change="-8.3%"
              changeType="negative"
              index={3}
              total={4}
            />
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue Overview</CardTitle>
              <CardDescription>12-month performance trend showing consistent growth.</CardDescription>
            </CardHeader>
            <CardContent>
              <OverviewChart data={data.overview} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Channels</CardTitle>
              <CardDescription>Revenue distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={salesByChannelConfig} className="mx-auto aspect-square max-h-[200px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={salesByChannelData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    strokeWidth={3}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-1 text-xs [&>*]:basis-1/2 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Order Value</span>
                <span className="font-semibold">NPR 47,720</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="font-semibold text-green-600">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                <span className="font-semibold">4.8/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Return Rate</span>
                <span className="font-semibold text-red-600">0.4%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveBarChart />
        {data.recentOrders && <RecentOrders data={data.recentOrders} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Best-selling items ranked by performance and revenue contribution.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.topProducts && data.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">{product.name}</p>
                  <Progress value={product.percent} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{product.percent}% performance</span>
                    <span className="font-medium">NPR {product.earnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>
    
  );
}