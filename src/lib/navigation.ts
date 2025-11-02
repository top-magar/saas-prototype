
import {
  BarChart,
  LayoutDashboard,
  Package,
  Briefcase,
  Workflow,
  Keyboard,
  Plus,
  Archive,
  List,
  Upload,
  CreditCard,
  Check,
  Users,
  Settings,
  ArrowUp,
  User,
  Layers,
  Clipboard,
  BookOpen,
} from 'lucide-react';

import { navigationStrings } from "./i18n/en";

export type NavItem = {
  name: string;
  href: string;
  badge?: string;
  dynamicBadgeKey?: string; // Key to identify dynamic badge data
  roles?: string[]; // Roles required to view this item
  tiers?: string[]; // Tiers required to view this item
  icon?: React.ElementType; // Icon for the sub-menu item
};

export type NavSection = {
  title: string;
  icon: React.ElementType;
  href?: string;
  items?: NavItem[];
  roles?: string[]; // Roles required to view this section
  tiers?: string[]; // Tiers required to view this section
};

// Main navigation for all users
export const navigationConfig: NavSection[] = [
  {
    title: navigationStrings.dashboard,
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: navigationStrings.analytics,
    icon: BarChart,
    items: [
      { name: navigationStrings.overview, href: '/dashboard/analytics', icon: BarChart },
      { name: navigationStrings.revenue, href: '/dashboard/analytics/revenue', tiers: ['PRO', 'ENTERPRISE'], icon: ArrowUp },
      { name: navigationStrings.customerInsights, href: '/dashboard/analytics/customers', tiers: ['PRO', 'ENTERPRISE'], icon: User },
      { name: navigationStrings.productAnalytics, href: '/dashboard/analytics/products', tiers: ['PRO', 'ENTERPRISE'], icon: Package },
      { name: navigationStrings.customReports, href: '/dashboard/analytics/custom-reports', tiers: ['PRO', 'ENTERPRISE'], icon: Layers },
    ],
  },
  {
    title: navigationStrings.products,
    icon: Package,
    items: [
      { name: navigationStrings.allProducts, href: '/dashboard/products', icon: Archive },
      { name: navigationStrings.categories, href: '/dashboard/products/categories', icon: List },
      { name: navigationStrings.inventory, href: '/dashboard/products/inventory', dynamicBadgeKey: 'lowStockProducts', icon: Package },
      { name: navigationStrings.importExport, href: '/dashboard/products/import-export', tiers: ['PRO', 'ENTERPRISE'], icon: Upload },
    ],
  },
  {
    title: navigationStrings.orders,
    icon: Briefcase,
    items: [
      { name: navigationStrings.allOrders, href: '/dashboard/orders', icon: Clipboard },
      { name: navigationStrings.invoices, href: '/dashboard/orders/invoices', tiers: ['PRO', 'ENTERPRISE'], icon: BookOpen },
      { name: navigationStrings.reports, href: '/dashboard/orders/reports', tiers: ['PRO', 'ENTERPRISE'], icon: BarChart },
    ],
  },
  {
    title: navigationStrings.customers,
    icon: Users,
    href: '/dashboard/customers',
  },
  {
    title: navigationStrings.automation,
    icon: Workflow,
    items: [
      { name: navigationStrings.workflows, href: '/dashboard/workflows', badge: navigationStrings.beta, tiers: ['PRO', 'ENTERPRISE'], icon: Workflow },
      { name: navigationStrings.webhooks, href: '/dashboard/webhooks', tiers: ['PRO', 'ENTERPRISE'], icon: Plus },
      { name: navigationStrings.apiKeys, href: '/dashboard/api-keys', tiers: ['PRO', 'ENTERPRISE'], icon: Keyboard },
      { name: navigationStrings.integrations, href: '/dashboard/integrations', tiers: ['PRO', 'ENTERPRISE'], icon: CreditCard },
    ],
  },
  {
    title: navigationStrings.settings,
    icon: Settings,
    items: [
      { name: navigationStrings.profile, href: '/dashboard/settings/profile', icon: User },
      { name: navigationStrings.workspace, href: '/dashboard/settings/workspace', icon: Settings },
      { name: navigationStrings.team, href: '/dashboard/settings/team', roles: ['admin', 'manager'], tiers: ['PRO', 'ENTERPRISE'], icon: Users },
      { name: navigationStrings.permissions, href: '/dashboard/settings/permissions', roles: ['admin'], tiers: ['PRO', 'ENTERPRISE'], icon: Check },
      { name: navigationStrings.billing, href: '/dashboard/settings/billing', icon: CreditCard },
    ],
  },
];

// Navigation specific to admin users
export const adminNavigationConfig: NavSection[] = [
  {
    title: navigationStrings.admin,
    icon: Settings,
    roles: ['admin'],
    items: [
      { name: navigationStrings.allTenants, href: '/dashboard/admin/tenants', roles: ['admin'], icon: Users },
      { name: navigationStrings.systemLogs, href: '/dashboard/admin/logs', roles: ['admin'], icon: Clipboard },
      { name: navigationStrings.platformSettings, href: '/dashboard/admin/settings', roles: ['admin'], icon: Settings },
    ],
  },
];