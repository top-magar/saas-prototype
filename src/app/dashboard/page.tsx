'use client';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from './_components/stat-card';
import { OverviewChart } from './_components/overview-chart';
import { RecentOrders } from './_components/recent-orders';
import { kpiData } from '@/lib/mock-data';
import { Download, DollarSign, Users, CreditCard, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { topProductsData } from "@/lib/mock-data"


export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.firstName} 👋</h1>
          <p className="text-muted-foreground">
            An overview of customer insights, sales performance, and revenue analytics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={kpiData.totalSales.value.toLocaleString()}
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          change={kpiData.totalSales.change}
          changeType={kpiData.totalSales.changeType}
        />
        <StatCard
          title="Total Revenue"
          value={`$${kpiData.totalRevenue.value.toLocaleString()}`}
          icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
          change={kpiData.totalRevenue.change}
          changeType={kpiData.totalRevenue.changeType}
        />
        <StatCard
          title="Active Customers"
          value={kpiData.activeCustomers.value.toLocaleString()}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          change={kpiData.activeCustomers.change}
          changeType={kpiData.activeCustomers.changeType}
        />
        <StatCard
          title="Refund Requests"
          value={kpiData.refundRequests.value.toLocaleString()}
          icon={<AlertCircle className="h-5 w-5 text-muted-foreground" />}
          change={kpiData.refundRequests.change}
          changeType={kpiData.refundRequests.changeType}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Your best-selling items this month.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {topProductsData.map(product => (
                        <div key={product.name} className="flex items-center gap-4">
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
        </div>
      </div>

      <RecentOrders />
    </div>
  );
}