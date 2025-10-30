'use client';
import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { navigationConfig, adminNavigationConfig } from '@/lib/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSidebarStore } from '@/hooks/use-sidebar-store';
import { AnimatePresence, motion, Easing } from 'framer-motion';
import { Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';


import { NavItem, NavSection } from '@/lib/navigation';
import { TenantTier } from '@/lib/types';





const sidebarStrings = {
  platformName: "SaaS Platform",
  freeTier: "FREE",
  betaBadge: "Beta",
};

const SidebarNav = React.memo(({ isCollapsed }: { isCollapsed: boolean }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const userRoles = React.useMemo(() => (user?.publicMetadata?.role as string[]) || [], [user?.publicMetadata?.role]);
  const isAdmin = userRoles.includes('admin');
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>(undefined);

  const [dynamicBadges, setDynamicBadges] = React.useState<Record<string, string>>({});

  // Dummy function to check user roles and tenant tiers
  const userHasAccess = React.useCallback((itemOrSection: NavItem | NavSection) => {
    // Temporarily override currentTenantTier to ENTERPRISE for development purposes
    const effectiveTenantTier = TenantTier.ENTERPRISE; 

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
  }, [userRoles]);

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

  React.useEffect(() => {
    if (isCollapsed) {
      setOpenAccordionItem(undefined); // Collapse all when sidebar is collapsed
    }
  }, [isCollapsed]);

  const renderNavItem = (item: NavItem, isPopover = false) => (
    <motion.div key={item.name} whileHover={{ scale: 1 }} transition={{ duration: 0.2 }} className="relative relative">
      {pathname === item.href && (
        <motion.div
          layoutId="active-sidebar-link"
          className="absolute inset-0 bg-primary/10 rounded-lg"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <Link
        href={item.href}
        className={cn(
          'relative z-10 flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary no-underline',
          (isCollapsed && !isPopover) ? 'gap-0' : 'gap-3',
          pathname === item.href && 'text-primary font-semibold'
        )}
      >
        {item.icon && (
          <div className={cn('transition-transform duration-300 ease-in-out', isCollapsed && 'scale-90')}>
            <item.icon className="h-3.5 w-3.5" />
          </div>
        )}
        <span className={cn('truncate', (isCollapsed && !isPopover) && 'sr-only')}>
          {item.name}
        </span>
        {!isCollapsed && (item.badge || (item.dynamicBadgeKey && dynamicBadges[item.dynamicBadgeKey])) && (
          <Badge variant="default" className="ml-auto">{item.badge || dynamicBadges[item.dynamicBadgeKey!]}</Badge>
        )}
      </Link>
    </motion.div>
  );

  const renderNavSection = (section: NavSection) => {
    const isActiveSection = section.href
      ? pathname === section.href // Exact match for direct links
      : section.items?.some(item => pathname.startsWith(item.href)); // Check if any sub-item is active

    if (section.href && !section.items) { // Direct link section without sub-items
      return (
        <Link key={section.title}
          href={section.href}
          className={cn(
            'flex items-center rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary no-underline font-normal',
            isCollapsed ? 'gap-0' : 'gap-3', // Remove justify-center for sections without items
            isActiveSection && ''
          )}
        >
          <div className={cn('transition-transform duration-300 ease-in-out', isCollapsed && 'scale-90')}>
            <section.icon className="h-4 w-4" />
          </div>
          <span
            className={cn('truncate', isCollapsed && 'sr-only')}
          >
            {section.title}
          </span>
        </Link>
      );
    }

    if (isCollapsed) {
      return (
        <HoverCard key={section.title} openDelay={100} closeDelay={50}>
          <HoverCardTrigger asChild>
            <div
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary',
                isActiveSection && '',
                'gap-3' // Always have gap for the popover trigger
              )}
            >
              <section.icon className="h-4 w-4" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="right" className="w-48 p-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold p-2">{section.title}</p>
              {section.items?.map(item => renderNavItem(item, true))}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    }

    // Section with sub-items (Accordion)
    return (
      <Accordion
        type="single"
        collapsible={true}
        value={openAccordionItem}
        onValueChange={setOpenAccordionItem}
        key={section.title}
      >
        <AccordionItem value={section.title} className="border-none">
          <AccordionTrigger
            className={cn(
              'flex items-center rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary hover:no-underline font-normal',
              isCollapsed ? 'gap-0' : 'gap-3', // Remove justify-center for accordion triggers
              isActiveSection && ''
            )}
          >
            <div className={cn('transition-transform duration-300 ease-in-out', isCollapsed && 'scale-90')}>
              <section.icon className="h-4 w-4" />
            </div>
            <span
              className={cn('truncate flex-1 text-left', isCollapsed && 'sr-only')}
            >
              {section.title}
            </span>
          </AccordionTrigger>
          <AnimatePresence initial={false}>
            {openAccordionItem === section.title && !isCollapsed && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={{
                  expanded: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <AccordionContent className={cn('pt-1', isCollapsed ? 'pl-0' : 'pl-4')}>
                  <div className="flex flex-col gap-1 border-l border-muted-foreground/20 ml-2 pl-2">
                    {section.items?.map((item) => renderNavItem(item, false))}
                  </div>
                </AccordionContent>
              </motion.div>
            )}
          </AnimatePresence>
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
}); // FIX: Added closing brace and parenthesis for React.memo

SidebarNav.displayName = 'SidebarNav';


const SidebarContent = () => {
    const { isCollapsed } = useSidebarStore();

    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center justify-between px-5">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className={cn('transition-transform duration-300 ease-in-out', isCollapsed && 'scale-90')}>
                        <Package className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                        <span className="truncate">
                            {sidebarStrings.platformName}
                        </span>
                    )}
                </Link>

            </div>
            
            <ScrollArea className="flex-1 overflow-auto py-4">
                <SidebarNav isCollapsed={isCollapsed} />
            </ScrollArea>
        </div>
    )
}



export const Sidebar = () => {
  const { isCollapsed } = useSidebarStore();

  const sidebarVariants = {
    expanded: { width: '256px', transition: { duration: 0.3, ease: 'easeInOut' as Easing } },
    collapsed: { width: '80px', transition: { duration: 0.3, ease: 'easeInOut' as Easing } },
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      className="hidden border-r bg-background md:fixed md:inset-y-0 md:z-50 md:block shadow-sm ring-1 ring-gray-200"
    >
      <SidebarContent />
    </motion.aside>
  );
};