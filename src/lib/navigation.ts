import {
  BarChart2,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Workflow,
} from 'lucide-react';

// Main navigation for all users
export const navigationConfig = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { name: 'Overview', href: '/dashboard' },
      { name: 'Analytics', href: '/dashboard/analytics', badge: 'New' },
    ],
  },
  {
    title: 'Products',
    icon: Package,
    items: [
      { name: 'All Products', href: '/dashboard/products' },
      { name: 'Categories', href: '/dashboard/products/categories' },
      { name: 'Inventory', href: '/dashboard/products/inventory' },
      { name: 'Import/Export', href: '/dashboard/products/import-export' },
    ],
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    items: [
      { name: 'All Orders', href: '/dashboard/orders' },
      { name: 'Invoices', href: '/dashboard/orders/invoices' },
      { name: 'Reports', href: '/dashboard/orders/reports' },
    ],
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/dashboard/customers',
    items: [],
  },
  {
    title: 'Automation',
    icon: Workflow,
    items: [
      { name: 'Workflows', href: '/dashboard/workflows', badge: 'Beta' },
      { name: 'Webhooks', href: '/dashboard/webhooks' },
      { name: 'API Keys', href: '/dashboard/api-keys' },
      { name: 'Integrations', href: '/dashboard/integrations' },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart2,
    items: [
      { name: 'Revenue', href: '/dashboard/analytics/revenue' },
      { name: 'Customer Insights', href: '/dashboard/analytics/customers' },
      { name: 'Product Analytics', href: '/dashboard/analytics/products' },
      { name: 'Custom Reports', href: '/dashboard/analytics/custom-reports' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings/workspace',
    items: [],
  },
];

// Navigation specific to admin users
export const adminNavigationConfig = [
  {
    title: 'Admin',
    icon: Users,
    items: [
      { name: 'All Tenants', href: '/dashboard/admin/tenants' },
      { name: 'System Logs', href: '/dashboard/admin/logs' },
      { name: 'Platform Settings', href: '/dashboard/admin/settings' },
    ],
  },
];