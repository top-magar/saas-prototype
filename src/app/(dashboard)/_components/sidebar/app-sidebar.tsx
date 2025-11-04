"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Home,
  Package2,
  Settings,
  ShoppingBag,
  Users,
  Palette,
  BarChart,
  Workflow,
  Keyboard,
  Plus,
  Archive,
  List,
  Upload,
  CreditCard,
  Check,
  User,
  Clipboard,
  BookOpen,
} from "lucide-react";
import { Logo } from "./logo";
import type { Route } from "./nav-main";
import DashboardNavigation from "./nav-main";




const dashboardRoutes: Route[] = [
  {
    id: "home",
    title: "Dashboard",
    icon: <Home className="size-4" />,
    link: "/dashboard",
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: <BarChart className="size-4" />,
    link: "/dashboard/analytics",
  },
  {
    id: "products",
    title: "Products",
    icon: <Package2 className="size-4" />,
    link: "/dashboard/products",
    subs: [
      {
        title: "All Products",
        link: "/dashboard/products",
        icon: <Archive className="size-4" />,
      },
      {
        title: "Categories",
        link: "/dashboard/products/categories",
        icon: <List className="size-4" />,
      },
      {
        title: "Inventory",
        link: "/dashboard/products/inventory",
        icon: <Package2 className="size-4" />,
      },
      {
        title: "Import/Export",
        link: "/dashboard/products/import-export",
        icon: <Upload className="size-4" />,
      },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    icon: <ShoppingBag className="size-4" />,
    link: "/dashboard/orders",
    subs: [
      {
        title: "All Orders",
        link: "/dashboard/orders",
        icon: <Clipboard className="size-4" />,
      },
      {
        title: "Invoices",
        link: "/dashboard/orders/invoices",
        icon: <BookOpen className="size-4" />,
      },
      {
        title: "Reports",
        link: "/dashboard/orders/reports",
        icon: <BarChart className="size-4" />,
      },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    icon: <Users className="size-4" />,
    link: "/dashboard/customers",
  },
  {
    id: "store-builder",
    title: "Store Builder",
    icon: <Palette className="size-4" />,
    link: "/dashboard/store-builder",
  },
  {
    id: "automation",
    title: "Automation",
    icon: <Workflow className="size-4" />,
    link: "/dashboard/workflows",
    subs: [
      {
        title: "Workflows",
        link: "/dashboard/workflows",
        icon: <Workflow className="size-4" />,
      },
      {
        title: "Webhooks",
        link: "/dashboard/webhooks",
        icon: <Plus className="size-4" />,
      },
      {
        title: "API Keys",
        link: "/dashboard/api-keys",
        icon: <Keyboard className="size-4" />,
      },
      {
        title: "Integrations",
        link: "/dashboard/integrations",
        icon: <CreditCard className="size-4" />,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="size-4" />,
    link: "/dashboard/settings",
    subs: [
      {
        title: "Profile",
        link: "/dashboard/settings/profile",
        icon: <User className="size-4" />,
      },
      {
        title: "Workspace",
        link: "/dashboard/settings/workspace",
        icon: <Settings className="size-4" />,
      },
      {
        title: "Team",
        link: "/dashboard/settings/team",
        icon: <Users className="size-4" />,
      },
      {
        title: "Permissions",
        link: "/dashboard/settings/permissions",
        icon: <Check className="size-4" />,
      },
      {
        title: "Billing",
        link: "/dashboard/settings/billing",
        icon: <CreditCard className="size-4" />,
      },
    ],
  },
];



export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <a href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              Pasaal.Io
            </span>
          )}
        </a>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>

    </Sidebar>
  );
}