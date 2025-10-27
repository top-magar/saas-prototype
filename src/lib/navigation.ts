import {
  BarChart2,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Workflow,
  Key,
  Plug,
  FileText,
  Boxes,
  ListTree,
  UploadCloud,
  DownloadCloud,
  CreditCard,
  ShieldCheck,
  UsersRound,
  ScrollText,
  Settings2,
  LineChart,
  DollarSign,
  User,
  BarChart,
  FileStack,
  ClipboardList,
  Receipt,
  FileBarChart,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Users as AdminUsersIcon,
  ClipboardList as AdminLogsIcon,
  Settings2 as AdminSettingsIcon,
} from 'lucide-react';

export type NavItem = {
  name: string;
  href: string;
  badge?: string;
  dynamicBadgeKey?: string; // Key to identify dynamic badge data
  roles?: string[]; // Roles required to view this item
  icon?: React.ElementType; // Icon for the sub-menu item
};

export type NavSection = {
  title: string;
  icon: React.ElementType;
  href?: string;
  items?: NavItem[];
  roles?: string[]; // Roles required to view this section
};

// Main navigation for all users
export const navigationConfig: NavSection[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Products',
    icon: Package,
    items: [
      { name: 'All Products', href: '/dashboard/products', icon: Boxes },
      { name: 'Categories', href: '/dashboard/products/categories', icon: ListTree },
      { name: 'Inventory', href: '/dashboard/products/inventory', dynamicBadgeKey: 'lowStockProducts', icon: Package },
      { name: 'Import/Export', href: '/dashboard/products/import-export', icon: UploadCloud },
    ],
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    items: [
      { name: 'All Orders', href: '/dashboard/orders', icon: ClipboardList },
      { name: 'Invoices', href: '/dashboard/orders/invoices', icon: Receipt },
      { name: 'Reports', href: '/dashboard/orders/reports', icon: FileBarChart },
    ],
  },
  {
    title: 'Customers',
    icon: UsersIcon,
    href: '/dashboard/customers',
  },
  {
    title: 'Automation',
    icon: Workflow,
    items: [
      { name: 'Workflows', href: '/dashboard/workflows', badge: 'Beta', icon: Workflow },
      { name: 'Webhooks', href: '/dashboard/webhooks', icon: Plug },
      { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
      { name: 'Integrations', href: '/dashboard/integrations', icon: CreditCard },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart2,
    items: [
      { name: 'Overview', href: '/dashboard/analytics', icon: BarChart2 },
      { name: 'Revenue', href: '/dashboard/analytics/revenue', icon: DollarSign },
      { name: 'Customer Insights', href: '/dashboard/analytics/customers', icon: User },
      { name: 'Product Analytics', href: '/dashboard/analytics/products', icon: Package },
      { name: 'Custom Reports', href: '/dashboard/analytics/custom-reports', icon: FileStack },
    ],
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    items: [
      { name: 'Workspace', href: '/dashboard/settings/workspace', icon: SettingsIcon },
      { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
      { name: 'Permissions', href: '/dashboard/settings/permissions', roles: ['admin'], icon: ShieldCheck },
      { name: 'Team', href: '/dashboard/settings/team', roles: ['admin', 'manager'], icon: UsersRound },
    ],
  },
];

// Navigation specific to admin users
export const adminNavigationConfig: NavSection[] = [
  {
    title: 'Admin',
    icon: AdminUsersIcon,
    roles: ['admin'],
    items: [
      { name: 'All Tenants', href: '/dashboard/admin/tenants', roles: ['admin'], icon: UsersRound },
      { name: 'System Logs', href: '/dashboard/admin/logs', roles: ['admin'], icon: AdminLogsIcon },
      { name: 'Platform Settings', href: '/dashboard/admin/settings', roles: ['admin'], icon: AdminSettingsIcon },
    ],
  },
];