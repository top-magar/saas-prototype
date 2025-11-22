'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { navigationConfig, adminNavigationConfig, NavItem, NavSection } from '@/lib/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { TenantTier } from '@/lib/types';

export const SidebarNav = React.memo(() => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';
  const isAdmin = userRole === 'admin';
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>(undefined);

  const [dynamicBadges, setDynamicBadges] = React.useState<Record<string, string>>({});

  // Dummy function to check user roles and tenant tiers
  const userHasAccess = React.useCallback((itemOrSection: NavItem | NavSection) => {
    // Temporarily override currentTenantTier to ENTERPRISE for development purposes
    const effectiveTenantTier: TenantTier = 'enterprise';

    // Check roles
    // if (itemOrSection.roles && itemOrSection.roles.length > 0) {
    //   if (!itemOrSection.roles.some(role => userRoles.includes(role))) {
    //     return false; // User does not have required role
    //   }
    // }

    // Check tiers
    // if (itemOrSection.tiers && itemOrSection.tiers.length > 0) {
    //   if (!itemOrSection.tiers.includes(effectiveTenantTier)) {
    //     return false; // Current tenant tier does not have access
    //   }
    // }

    return true; // User has access
  }, [userRole]);

  // Simulate fetching dynamic badge data
  React.useEffect(() => {
    // In a real app, this would fetch data from an API
    const fetchDynamicBadges = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setDynamicBadges({
        lowStockProducts: '5',
        pendingOrders: '3',
      });
    };
    fetchDynamicBadges();
  }, []);

  const filterNavigation = React.useCallback((config: NavSection[]) => {
    return config.map(section => {
      if (!userHasAccess(section)) {
        return null; // User doesn't have access to this section
      }

      const filteredItems = section.items ? section.items.filter(item =>
        userHasAccess(item)
      ) : [];

      if (section.href) {
        return section; // Direct link section
      }

      if (filteredItems.length > 0) {
        return { ...section, items: filteredItems };
      }
      return null;
    }).filter(Boolean) as NavSection[];
  }, [userHasAccess]);

  const filteredNavigationConfig = React.useMemo(() => filterNavigation(navigationConfig), [filterNavigation]);
  const filteredAdminNavigationConfig = React.useMemo(() => filterNavigation(adminNavigationConfig), [filterNavigation]);



  const renderNavItem = (item: NavItem) => (
    <Link key={item.name} href={item.href} className="no-underline">
      <div className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
        pathname === item.href ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
      )}>
        {item.icon && <item.icon className="h-4 w-4" />}
        <span className="truncate">{item.name}</span>
        {(item.badge || (item.dynamicBadgeKey && dynamicBadges[item.dynamicBadgeKey])) && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge || dynamicBadges[item.dynamicBadgeKey!]}
          </Badge>
        )}
      </div>
    </Link>
  );

  const renderNavSection = (section: NavSection) => {
    const isActiveSection = section.href
      ? pathname === section.href
      : section.items?.some(item => pathname.startsWith(item.href));

    if (section.href && !section.items) {
      return (
        <Link key={section.title} href={section.href} className="no-underline">
          <div className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
            isActiveSection ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
          )}>
            <section.icon className="h-4 w-4" />
            <span className="truncate">{section.title}</span>
          </div>
        </Link>
      );
    }

    return (
      <Accordion
        type="single"
        collapsible={true}
        value={openAccordionItem}
        onValueChange={setOpenAccordionItem}
        key={section.title}
      >
        <AccordionItem value={section.title} className="border-none">
          <AccordionTrigger className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:no-underline',
            isActiveSection ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
          )}>
            <section.icon className="h-4 w-4" />
            <span className="truncate flex-1 text-left">{section.title}</span>
          </AccordionTrigger>
          <AccordionContent className="pl-6">
            <div className="flex flex-col gap-1">
              {section.items?.map(renderNavItem)}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <nav className="grid items-start gap-1 px-2">
      {filteredNavigationConfig.map(renderNavSection)}
      {isAdmin && filteredAdminNavigationConfig.length > 0 && <Separator className="my-4" />}
      {isAdmin && filteredAdminNavigationConfig.map(renderNavSection)}
    </nav>
  )
});

SidebarNav.displayName = 'SidebarNav';