'use client';
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/hooks/use-sidebar-store';
import { motion, Easing } from 'framer-motion';
import { Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarOptInForm } from './sidebar-opt-in-form';
import { SidebarNav } from './sidebar-nav';

const sidebarStrings = {
  platformName: "Pasaal.io",
  freeTier: "FREE",
  betaBadge: "Beta",
};

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
                        <span className="truncate uppercase font-bold">
                            {sidebarStrings.platformName}
                        </span>
                    )}
                </Link>
            </div>
            
            <ScrollArea className="flex-1 overflow-auto py-4">
                <SidebarNav isCollapsed={isCollapsed} />
            </ScrollArea>
            {!isCollapsed && <SidebarOptInForm className="mt-4 mb-4" />}
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
      className="hidden border-r bg-background md:fixed md:inset-y-0 md:z-50 md:block shadow-sm"
    >
      <SidebarContent />
    </motion.aside>
  );
};