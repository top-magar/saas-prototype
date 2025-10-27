'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useTenant } from '@/lib/tenant-context';
import { cn } from '@/lib/utils';
import { navigationConfig, adminNavigationConfig } from '@/lib/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/hooks/use-sidebar-store';
import { Input } from '@/components/ui/input';
import { Package, ChevronsLeft, ChevronsRight, SearchIcon, Key, Plug, FileText, Boxes, ListTree, UploadCloud, DownloadCloud, CreditCard, ShieldCheck, UsersRound, ScrollText, Settings2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NavItem, NavSection } from '@/lib/navigation';



const SidebarNav = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const userRoles = (user?.publicMetadata?.role as string[]) || []; // Assuming roles are an array of strings
  const isAdmin = userRoles.includes('admin');
  const [openAccordionItem, setOpenAccordionItem] = React.useState<string | undefined>(undefined);
  const [dynamicBadges, setDynamicBadges] = React.useState<Record<string, string>>({});

  // Dummy function to check user roles
  const userHasAccess = (itemOrSection: NavItem | NavSection) => {
    if (!itemOrSection.roles || itemOrSection.roles.length === 0) {
      return true; // No specific roles required
    }
    return itemOrSection.roles.some(role => userRoles.includes(role));
  };

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

  React.useEffect(() => {
    if (isCollapsed) {
      setOpenAccordionItem(undefined); // Collapse all when sidebar is collapsed
    } else {
      // When expanded, open the accordion that contains the current active path
      const activeSection = [...navigationConfig, ...(isAdmin ? adminNavigationConfig : [])].find(section =>
        section.items && section.items.some(item => pathname.startsWith(item.href))
      );
      if (activeSection) {
        setOpenAccordionItem(activeSection.title);
      } else {
        setOpenAccordionItem(undefined); // No active section, keep all closed
      }
    }
  }, [isCollapsed, pathname, isAdmin]);

  const filterNavigation = (config: NavSection[]) => {
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
  };

  const filteredNavigationConfig = filterNavigation(navigationConfig);
  const filteredAdminNavigationConfig = filterNavigation(adminNavigationConfig);

  const renderNavItem = (item: NavItem) => (
    <Tooltip key={item.name} delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            'flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary',
            isCollapsed ? 'gap-0' : 'gap-3', // Remove justify-center for items
            pathname === item.href && 'bg-primary/10 text-primary font-semibold'
          )}
        >
          {item.icon && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: isCollapsed ? 0.8 : 1, opacity: isCollapsed ? 0.7 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className="h-5 w-5" />
            </motion.div>
          )}
          <motion.span
            initial={{ opacity: 1, width: 'auto' }}
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
            transition={{ duration: 0.2 }}
            className={cn('truncate', isCollapsed && 'sr-only')}
          >
            {item.name}
          </motion.span>
          {!isCollapsed && (item.badge || (item.dynamicBadgeKey && dynamicBadges[item.dynamicBadgeKey])) && (
            <Badge variant="primary" className="ml-auto">{item.badge || dynamicBadges[item.dynamicBadgeKey!]}</Badge>
          )}
        </Link>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
    </Tooltip>
  );

  const renderNavSection = (section: NavSection) => {
    const isActiveSection = section.href
      ? pathname === section.href // Exact match for direct links
      : section.items?.some(item => pathname.startsWith(item.href)); // Check if any sub-item is active

    if (section.href && !section.items) { // Direct link section without sub-items
      return (
        <Tooltip key={section.title} delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              href={section.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary',
                isCollapsed ? 'gap-0' : 'gap-3', // Remove justify-center for sections without items
                isActiveSection && 'bg-primary/10 text-primary font-semibold'
              )}
            >
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: isCollapsed ? 0.8 : 1, opacity: isCollapsed ? 0.7 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <section.icon className="h-5 w-5" />
              </motion.div>
              <motion.span
                initial={{ opacity: 1, width: 'auto' }}
                animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                transition={{ duration: 0.2 }}
                className={cn('truncate', isCollapsed && 'sr-only')}
              >
                {section.title}
              </motion.span>
            </Link>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">{section.title}</TooltipContent>}
        </Tooltip>
      );
    }

    // Section with sub-items (Accordion)
    return (
      <Accordion
        type="single"
        collapsible
        value={isCollapsed ? undefined : openAccordionItem}
        onValueChange={(value) => {
          if (!isCollapsed) {
            setOpenAccordionItem(value);
          }
        }}
        key={section.title}
      >
        <AccordionItem value={section.title} className="border-none">
          <Tooltip key={section.title} delayDuration={0}>
            <TooltipTrigger asChild>
              <AccordionTrigger
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary hover:no-underline',
                  isCollapsed ? 'gap-0' : 'gap-3', // Remove justify-center for accordion triggers
                  isActiveSection && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: isCollapsed ? 0.8 : 1, opacity: isCollapsed ? 0.7 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <section.icon className="h-5 w-5" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 1, width: 'auto' }}
                  animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}
                  className={cn('truncate flex-1 text-left', isCollapsed && 'sr-only')}
                >
                  {section.title}
                </motion.span>
              </AccordionTrigger>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">{section.title}</TooltipContent>}
          </Tooltip>
          <AccordionContent className={cn('pt-1', isCollapsed ? 'pl-0' : 'pl-4')}>
            <div className="flex flex-col gap-1 border-l border-muted-foreground/20 ml-2 pl-2">
              {section.items?.map(renderNavItem)}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="grid items-start gap-1 px-2">
        {filteredNavigationConfig.map(renderNavSection)}
        {isAdmin && filteredAdminNavigationConfig.length > 0 && <Separator className="my-4" />}
        {isAdmin && filteredAdminNavigationConfig.map(renderNavSection)}
      </nav>
    </TooltipProvider>
  );
};

const SidebarContent = () => {
    const { tenant } = useTenant();
    const { isCollapsed, toggleCollapse } = useSidebarStore();

    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center justify-center px-4 lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <motion.div
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: isCollapsed ? 0.8 : 1, opacity: isCollapsed ? 0.7 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Package className="h-6 w-6" />
                    </motion.div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="truncate"
                            >
                                {tenant!.name}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
                <Button variant="ghost" size="icon" onClick={toggleCollapse} className={cn("hidden md:block", isCollapsed && "ml-auto")}>
                    {isCollapsed ? <ChevronsRight className="h-5 w-5"/> : <ChevronsLeft className="h-5 w-5"/>}
                </Button>
            </div>
            
            <ScrollArea className="flex-1 overflow-auto py-4">
                <SidebarNav isCollapsed={isCollapsed} />
            </ScrollArea>
        </div>
    )
}

export const Sidebar = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "hidden border-r bg-background md:fixed md:inset-y-0 md:z-50 md:block",
        )}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};