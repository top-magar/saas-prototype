import {
  BarChart2,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Workflow,
  Key,
  Plug,
  Boxes,
  ListTree,
  UploadCloud,
  CreditCard,
  ShieldCheck,
  UsersRound,
  Settings2,
  DollarSign,
  User,
  FileStack,
  ClipboardList,
  Receipt,
  FileBarChart,
  Users,
  Settings,
} from 'lucide-react';

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
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
      { name: 'Revenue', href: '/dashboard/analytics/revenue', tiers: ['PRO', 'ENTERPRISE'], icon: DollarSign },
      { name: 'Customer Insights', href: '/dashboard/analytics/customers', tiers: ['PRO', 'ENTERPRISE'], icon: User },
      { name: 'Product Analytics', href: '/dashboard/analytics/products', tiers: ['PRO', 'ENTERPRISE'], icon: Package },
      { name: 'Custom Reports', href: '/dashboard/analytics/custom-reports', tiers: ['PRO', 'ENTERPRISE'], icon: FileStack },
    ],
  },
  {
    title: 'Products',
    icon: Package,
    items: [
      { name: 'All Products', href: '/dashboard/products', icon: Boxes },
      { name: 'Categories', href: '/dashboard/products/categories', icon: ListTree },
      { name: 'Inventory', href: '/dashboard/products/inventory', dynamicBadgeKey: 'lowStockProducts', icon: Package },
      { name: 'Import/Export', href: '/dashboard/products/import-export', tiers: ['PRO', 'ENTERPRISE'], icon: UploadCloud },
    ],
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    items: [
      { name: 'All Orders', href: '/dashboard/orders', icon: ClipboardList },
      { name: 'Invoices', href: '/dashboard/orders/invoices', tiers: ['PRO', 'ENTERPRISE'], icon: Receipt },
      { name: 'Reports', href: '/dashboard/orders/reports', tiers: ['PRO', 'ENTERPRISE'], icon: FileBarChart },
    ],
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/dashboard/customers',
  },
  {
    title: 'Automation',
    icon: Workflow,
    items: [
      { name: 'Workflows', href: '/dashboard/workflows', badge: 'Beta', tiers: ['PRO', 'ENTERPRISE'], icon: Workflow },
      { name: 'Webhooks', href: '/dashboard/webhooks', tiers: ['PRO', 'ENTERPRISE'], icon: Plug },
      { name: 'API Keys', href: '/dashboard/api-keys', tiers: ['PRO', 'ENTERPRISE'], icon: Key },
      { name: 'Integrations', href: '/dashboard/integrations', tiers: ['PRO', 'ENTERPRISE'], icon: CreditCard },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      { name: 'Workspace', href: '/dashboard/settings/workspace', icon: Settings },
      { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
      { name: 'Permissions', href: '/dashboard/settings/permissions', roles: ['admin'], tiers: ['PRO', 'ENTERPRISE'], icon: ShieldCheck },
      { name: 'Team', href: '/dashboard/settings/team', roles: ['admin', 'manager'], tiers: ['PRO', 'ENTERPRISE'], icon: UsersRound },
      { name: 'Profile', href: '/dashboard/settings/profile', icon: User },
    ],
  },
];

// Navigation specific to admin users
export const adminNavigationConfig: NavSection[] = [
  {
    title: 'Admin',
    icon: Users,
    roles: ['admin'],
    items: [
      { name: 'All Tenants', href: '/dashboard/admin/tenants', roles: ['admin'], icon: UsersRound },
      { name: 'System Logs', href: '/dashboard/admin/logs', roles: ['admin'], icon: ClipboardList },
      { name: 'Platform Settings', href: '/dashboard/admin/settings', roles: ['admin'], icon: Settings2 },
    ],
  },
];