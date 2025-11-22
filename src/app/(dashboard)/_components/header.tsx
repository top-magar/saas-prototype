'use client';

import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Bell,
  Sun,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";


// ... existing imports

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
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const tenant = null;

  const user = session?.user;
  const userName = user?.name || '';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-2 z-50 w-full bg-background border-b">
      <div className="flex h-14 items-center justify-between px-3 sm:px-6 gap-2">
        {/* Left side - Page Title */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <Breadcrumb className="hidden md:block">
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
          <span className="font-semibold md:hidden">
            {breadcrumbs[breadcrumbs.length - 1]?.name || 'Dashboard'}
          </span>


        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <CommandMenu />
          <div className="hidden md:flex">
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
          </div>
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 p-0 !rounded-full overflow-hidden bg-muted/50 hover:bg-muted transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user?.image || ''} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary rounded-full">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 md:w-72 border-border/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ''} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile-only items */}
              <div className="md:hidden">
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  <Badge variant="secondary" className="ml-auto text-xs">3</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sun className="mr-2 h-4 w-4" />
                  Theme
                  <Badge variant="outline" className="ml-auto text-xs">Auto</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>

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
              <DropdownMenuItem className="md:flex hidden">
                <Keyboard className="mr-2 h-4 w-4" />
                Shortcuts
                <Badge variant="secondary" className="ml-auto text-xs">⌘K</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/' })}
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