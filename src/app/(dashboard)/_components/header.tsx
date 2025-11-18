'use client';

import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { NotificationsPopover } from "./sidebar/nav-notifications";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChevronRight,
  Settings,
  User,
  CreditCard,
  LogOut,
  Keyboard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = '/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;
    
    // Format segment names
    let name = segment.charAt(0).toUpperCase() + segment.slice(1);
    if (name === 'Dashboard') name = 'Overview';
    if (name === 'Api-keys') name = 'API Keys';
    if (name === 'Store-builder') name = 'Store Builder';
    
    breadcrumbs.push({ name, href, isLast });
  }
  
  return breadcrumbs;
}

export function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  // const { tenant } = useTenant();
  const tenant = null; // Temporarily disabled until tenant context is properly set up

  const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-2 z-50 w-full bg-background  ">
      <div className="flex h-14 items-center justify-between pl-6 pr-6">
        {/* Left side - Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>}
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="font-medium">{crumb.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          

        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          <CommandMenu />
          <NotificationsPopover notifications={[
            {
              id: "1",
              avatar: "/avatars/01.png",
              fallback: "OM",
              text: "New order received.",
              time: "10m ago",
            },
            {
              id: "2",
              avatar: "/avatars/02.png",
              fallback: "JL",
              text: "Server upgrade completed.",
              time: "1h ago",
            },
            {
              id: "3",
              avatar: "/avatars/03.png",
              fallback: "HH",
              text: "New user signed up.",
              time: "2h ago",
            },
          ]} />
          <ThemeToggle />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
              >
                <div className="h-7 w-7 bg-primary/10 flex items-center justify-center text-xs font-mono font-medium text-primary">
                  {userInitials}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 border-border/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary/10 flex items-center justify-center text-xs font-mono font-medium text-primary">
                      {userInitials}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium font-mono">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings/billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings/workspace')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-4 w-4" />
                Keyboard shortcuts
                <Badge variant="secondary" className="ml-auto text-xs">⌘K</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut(() => router.push('/'))}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}