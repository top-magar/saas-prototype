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
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { navigationConfig, adminNavigationConfig, NavItem } from '@/lib/navigation';

export const CommandMenu = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { signOut } = useClerk();

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

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-64 justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {allNavItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.sectionTitle ? `${item.sectionTitle}: ${item.name}` : item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings & Actions">
            <CommandItem
              onSelect={() => {
                router.push('/dashboard/settings/profile');
                setOpen(false);
              }}
            >
              Profile
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push('/dashboard/settings/billing');
                setOpen(false);
              }}
            >
              Billing
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push('/dashboard/settings/workspace');
                setOpen(false);
              }}
            >
              Settings
            </CommandItem>
            <CommandItem
              onSelect={() => {
                signOut(() => router.push('/'));
                setOpen(false);
              }}
            >
              Logout
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
