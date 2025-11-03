'use client';
import React from 'react';
import Link from 'next/link';
import { Package, ChevronsUpDown } from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { SidebarOptInForm } from './sidebar-opt-in-form';

function NavUser() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const { isMobile } = useSidebar();

  const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.fullName || 'User'}</span>
            <span className="truncate text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
              <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.fullName || 'User'}</span>
              <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings/profile')}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings/billing')}>Billing</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings/workspace')}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut(() => router.push('/'))}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <div className="flex-1 overflow-auto">
          <SidebarNav />
        </div>
        <div className="mt-auto">
          <SidebarOptInForm />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Pasaal.Io</span>
                  <span className="truncate text-xs">SaaS Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}