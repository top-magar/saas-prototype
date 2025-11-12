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
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <SidebarMenu className="list-none [&>li]:list-none">
      {routes.map((route) => {
        const isOpen = !isCollapsed && openCollapsible === route.id;
        const hasSubRoutes = !!route.subs?.length;
        const isActive = pathname === route.link || route.subs?.some(sub => pathname === sub.link);

        return (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <SidebarMenuItem className="list-none">
              {hasSubRoutes ? (
                <div className="w-full">
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <SidebarMenuButton
                      onClick={() => setOpenCollapsible(isOpen ? null : route.id)}
                      tooltip={isCollapsed ? route.title : undefined}
                      className={cn(
                        "flex items-center rounded-lg transition-all duration-200 cursor-pointer",
                        isActive || isOpen
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isCollapsed ? "w-8 h-8 justify-center p-0" : "w-full px-2"
                      )}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {route.icon}
                      </motion.div>
                      {!isCollapsed && (
                        <motion.span 
                          className="ml-2 flex-1 text-sm font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {route.title}
                        </motion.span>
                      )}
                      {!isCollapsed && hasSubRoutes && (
                        <motion.span 
                          className="ml-auto"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <ChevronDown className="size-4" />
                        </motion.span>
                      )}
                    </SidebarMenuButton>
                  </motion.div>

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
                            {route.subs?.map((subRoute, index) => {
                              const isSubActive = pathname === subRoute.link;
                              return (
                                <motion.div
                                  key={`${route.id}-${subRoute.title}`}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -10, opacity: 0 }}
                                  transition={{ 
                                    duration: 0.2, 
                                    delay: index * 0.05,
                                    ease: "easeOut" 
                                  }}
                                  whileHover={{ x: 2 }}
                                >
                                  <SidebarMenuSubItem className="h-auto list-none">
                                    <motion.div
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ duration: 0.1 }}
                                    >
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                          href={subRoute.link}
                                          prefetch={true}
                                          className={cn(
                                            "flex items-center rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 no-underline",
                                            isSubActive
                                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                          )}
                                          title={subRoute.title}
                                        >
                                          {subRoute.icon && (
                                            <motion.span 
                                              className="mr-2"
                                              animate={{ scale: isSubActive ? 1.1 : 1 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                              {subRoute.icon}
                                            </motion.span>
                                          )}
                                          {subRoute.title}
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </motion.div>
                                  </SidebarMenuSubItem>
                                </motion.div>
                              );
                            })}
                          </SidebarMenuSub>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ) : (
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                >
                  <SidebarMenuButton tooltip={route.title} asChild>
                    <Link
                      href={route.link}
                      prefetch={true}
                      className={cn(
                        "flex items-center rounded-lg transition-all duration-200 no-underline",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isCollapsed ? "w-8 h-8 justify-center p-0" : "w-full px-2"
                      )}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {route.icon}
                      </motion.div>
                      {!isCollapsed && (
                        <motion.span 
                          className="ml-2 text-sm font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {route.title}
                        </motion.span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </motion.div>
              )}
            </SidebarMenuItem>
          </motion.div>
        );
      })}
    </SidebarMenu>
  );
}