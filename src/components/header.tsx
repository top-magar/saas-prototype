'use client';

import { useSidebarStore } from '@/hooks/use-sidebar-store';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeft, PanelRight } from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import("@/components/ui/theme-toggle").then(mod => mod.ThemeToggle), { ssr: false });
import { CommandMenu } from '@/components/command-menu';
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

export const Header = () => {
    const { openMobile, isCollapsed, toggleCollapse } = useSidebarStore();
    const { signOut } = useClerk();
    const { user } = useUser();
    const router = useRouter();

    const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;

    return (
        <header className="sticky top-0 z-40 grid grid-cols-3 items-center gap-4 bg-background px-2 sm:px-2 h-14 border-b">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={openMobile} className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleCollapse} className="hidden md:block size-8 hover:bg-transparent" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                    {isCollapsed ? <PanelRight className="h-4 w-4"/> : <PanelLeft className="h-4 w-4"/>}
                </Button>
            </div>
            <div className="flex justify-center">
                <CommandMenu />
            </div>
            <div className="flex items-center justify-end gap-4">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/profile')}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/billing')}>Billing</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/workspace')}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
