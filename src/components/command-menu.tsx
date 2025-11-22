'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Clock,
  Settings,
  User,
  CreditCard,
  LogOut,
  BarChart3,
  Package,
  Users,
  ShoppingCart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { navigationConfig, adminNavigationConfig, NavItem } from '@/lib/navigation';

interface RecentSearch {
  id: string;
  name: string;
  href: string;
  timestamp: number;
}

export const CommandMenu = () => {
  const [open, setOpen] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<RecentSearch[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem('command-menu-recent');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  const addToRecent = React.useCallback((item: { name: string; href: string }) => {
    const newItem: RecentSearch = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      href: item.href,
      timestamp: Date.now(),
    };

    setRecentSearches(prev => {
      const filtered = prev.filter(i => i.href !== item.href);
      const updated = [newItem, ...filtered].slice(0, 5);
      localStorage.setItem('command-menu-recent', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const allNavItems = React.useMemo(() => {
    const items: (NavItem & { sectionTitle?: string })[] = [];
    [...navigationConfig, ...adminNavigationConfig].forEach(section => {
      if (section.href) {
        items.push({ ...section, name: section.title, sectionTitle: section.title, href: section.href! });
      } else if (section.items) {
        section.items.forEach(item => items.push({ ...item, sectionTitle: section.title }));
      }
    });
    return items;
  }, []);

  const quickActions = [
    { name: 'View Analytics', href: '/dashboard/analytics', icon: BarChart3 },

    { name: 'View Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Recent Orders', href: '/dashboard/orders', icon: ShoppingCart },
  ];

  const handleNavigation = (item: { name: string; href: string }) => {
    addToRecent(item);
    router.push(item.href);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 md:w-40 lg:w-56 justify-center md:justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for pages, actions, or settings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {recentSearches.length > 0 && (
            <>
              <CommandGroup heading="Recent">
                {recentSearches.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleNavigation(item)}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.href}
                onSelect={() => handleNavigation(action)}
              >
                <action.icon className="mr-2 h-4 w-4" />
                <span>{action.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Quick
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            {allNavItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => handleNavigation({ name: item.name, href: item.href })}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.sectionTitle && item.sectionTitle !== item.name ? `${item.sectionTitle}: ${item.name}` : item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings & Account">
            <CommandItem
              onSelect={() => {
                addToRecent({ name: 'Profile Settings', href: '/dashboard/settings/profile' });
                router.push('/dashboard/settings/profile');
                setOpen(false);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </CommandItem>
            <CommandItem
              onSelect={() => {
                addToRecent({ name: 'Billing & Plans', href: '/dashboard/settings/billing' });
                router.push('/dashboard/settings/billing');
                setOpen(false);
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing & Plans
            </CommandItem>
            <CommandItem
              onSelect={() => {
                addToRecent({ name: 'Workspace Settings', href: '/dashboard/settings/workspace' });
                router.push('/dashboard/settings/workspace');
                setOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Workspace Settings
            </CommandItem>
            <CommandSeparator />
            <CommandItem
              onSelect={() => {
                signOut({ callbackUrl: '/' });
                setOpen(false);
              }}
              className="text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
