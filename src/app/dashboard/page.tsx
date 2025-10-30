'use client';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { StatCard } from './_components/stat-card';
import { OverviewChart } from './_components/overview-chart';
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
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { ButtonGroup } from '@/components/ui/button-group';

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

interface DashboardData {
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
  { name: "Online", value: 60, color: "hsl(var(--chart-1))" },
  { name: "Store", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Referral", value: 10, color: "hsl(var(--chart-3))" },
];

const salesByChannelConfig = {
  online: { label: "Online", color: "hsl(var(--chart-1))" },
  store: { label: "Store", color: "hsl(var(--chart-2))" },
  referral: { label: "Referral", color: "hsl(var(--chart-3))" },
};

export default function DashboardPage() {
  const { user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeframe, setTimeframe] = useState("30d");

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setData({
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
      });
    };
    fetchData();
  }, []);

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
                value={`$${data.stats.totalRevenue.toLocaleString()}`}
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
              <ChartContainer config={salesByChannelConfig} className="h-[250px] w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent nameKey="name" />} 
                  />
                  <Pie
                    data={salesByChannelData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    strokeWidth={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {salesByChannelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />} 
                    className="flex-wrap justify-center gap-2 pt-2"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {data.recentOrders && <RecentOrders data={data.recentOrders} />} 

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
                <p className="text-xs text-muted-foreground">${product.earnings.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
