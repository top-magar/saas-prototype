'use client';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { StatCard } from './_components/stat-card';
import { RecentOrders } from './_components/recent-orders';
import { Download, ArrowUp, User, CreditCard, AlertTriangle, Package } from 'lucide-react';
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
  { name: "Online", value: 60, fill: "var(--color-online)" },
  { name: "Store", value: 30, fill: "var(--color-store)" },
  { name: "Referral", value: 10, fill: "var(--color-referral)" },
];

const salesByChannelConfig = {
  online: { label: "Online", color: "hsl(var(--chart-1))" },
  store: { label: "Store", color: "hsl(var(--chart-2))" },
  referral: { label: "Referral", color: "hsl(var(--chart-3))" },
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

      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {data.stats && (
          <>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Sales"
                value={data.stats.totalSales.toLocaleString()}
                icon={<ArrowUp className="h-5 w-5 text-muted-foreground" />}
                change={20.1}
                changeType={'increase'}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Revenue"
                value={`NPR ${data.stats.totalRevenue.toLocaleString()}`}
                icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
                change={15.5}
                changeType={'increase'}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Active Customers"
                value={data.stats.activeCustomers.toLocaleString()}
                icon={<User className="h-5 w-5 text-muted-foreground" />}
                change={10.2}
                changeType={'increase'}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Refund Requests"
                value={data.stats.refundRequests.toLocaleString()}
                icon={<AlertTriangle className="h-5 w-5 text-muted-foreground" />}
                change={5.0}
                changeType={'decrease'}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue Overview</CardTitle>
              <CardDescription>Monthly performance of your business.</CardDescription>
            </CardHeader>
            <CardContent>
              <OverviewChart data={data.overview} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Sales by Channel</CardTitle>
              <CardDescription>Distribution of sales across different channels.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={salesByChannelConfig} className="mx-auto aspect-square max-h-[250px]">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={salesByChannelData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
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
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Your best-selling items this month.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {data.topProducts && data.topProducts.map(product => (
            <div key={product.name} className="flex items-center gap-4">
              <Package className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{product.name}</p>
                <Progress value={product.percent} />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{product.percent}%</p>
                <p className="text-xs text-muted-foreground">NPR {product.earnings.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}