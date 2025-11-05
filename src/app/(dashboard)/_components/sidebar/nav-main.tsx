"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuItem as SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type Route = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  link: string;
  subs?: {
    title: string;
    link: string;
    icon?: React.ReactNode;
  }[];
};

export default function DashboardNavigation({ routes }: { routes: Route[] }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  return (
    <SidebarMenu className="list-none [&>li]:list-none">
      {routes.map((route) => {
        const isOpen = !isCollapsed && openCollapsible === route.id;
        const hasSubRoutes = !!route.subs?.length;

        return (
          <SidebarMenuItem key={route.id} className="list-none">
            {hasSubRoutes ? (
              <div className="w-full">
                <SidebarMenuButton
                  onClick={() => setOpenCollapsible(isOpen ? null : route.id)}
                  className={cn(
                    "flex items-center rounded-lg transition-colors cursor-pointer",
                    isOpen
                      ? "bg-sidebar-muted text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-muted hover:text-foreground",
                    isCollapsed ? "w-8 h-8 justify-center p-0" : "w-full px-2"
                  )}
                >
                  {route.icon}
                  {!isCollapsed && (
                    <span className="ml-2 flex-1 text-sm font-medium">
                      {route.title}
                    </span>
                  )}
                  {!isCollapsed && hasSubRoutes && (
                    <motion.span 
                      className="ml-auto"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>
                  )}
                </SidebarMenuButton>

                {!isCollapsed && (
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <SidebarMenuSub className="my-1 ml-3.5 list-none [&>li]:list-none">
                          {route.subs?.map((subRoute, index) => (
                            <motion.div
                              key={`${route.id}-${subRoute.title}`}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ 
                                duration: 0.2, 
                                delay: index * 0.05,
                                ease: "easeOut" 
                              }}
                            >
                              <SidebarMenuSubItem className="h-auto list-none">
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={subRoute.link}
                                    prefetch={true}
                                    className="flex items-center rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-muted hover:text-foreground no-underline"
                                  >
                                    {subRoute.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </motion.div>
                          ))}
                        </SidebarMenuSub>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ) : (
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.1 }}
              >
                <SidebarMenuButton tooltip={route.title} asChild>
                  <Link
                    href={route.link}
                    prefetch={true}
                    className={cn(
                      "flex items-center rounded-lg transition-colors text-muted-foreground hover:bg-sidebar-muted hover:text-foreground no-underline",
                      isCollapsed ? "w-8 h-8 justify-center p-0" : "w-full px-2"
                    )}
                  >
                    {route.icon}
                    {!isCollapsed && (
                      <span className="ml-2 text-sm font-medium">
                        {route.title}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </motion.div>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}