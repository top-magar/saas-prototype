'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton, SignOutButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useTenant } from '@/lib/tenant-context';
import { navigationConfig, adminNavigationConfig } from '@/lib/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSidebarStore } from '@/hooks/use-sidebar-store';
import { LogOut, Package } from 'lucide-react';

const SidebarNav = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const renderNavItem = (item: { href: string; name: string }) => (
    <Link
      key={item.name}
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        pathname === item.href && 'bg-muted text-primary'
      )}
    >
      {item.name}
    </Link>
  );

  const renderNavSection = (section: (typeof navigationConfig)[0]) => {
    if (section.href) {
      return (
         <Link
          key={section.title}
          href={section.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === section.href && 'bg-muted text-primary'
          )}
        >
          <section.icon className="h-4 w-4" />
          {section.title}
        </Link>
      )
    }

    return (
      <AccordionItem value={section.title} key={section.title} className="border-b-0">
        <AccordionTrigger className="py-2 text-base font-medium hover:no-underline text-muted-foreground hover:text-primary rounded-lg px-3 [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center gap-3">
            <section.icon className="h-4 w-4" />
            {section.title}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-8 text-sm flex flex-col gap-1 pb-1">
          {section.items.map(renderNavItem)}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <nav className="grid items-start gap-2 text-sm font-medium">
      <Accordion type="multiple" defaultValue={navigationConfig.map(s => s.title)}>
        {navigationConfig.map(renderNavSection)}
        {isAdmin && adminNavigationConfig.map(renderNavSection)}
      </Accordion>
    </nav>
  );
};

const SidebarContent = () => {
    const { tenant } = useTenant();
    const { user } = useUser();

    return (
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Package className="h-6 w-6" />
                <span>{tenant!.name}</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <SidebarNav />
            </div>
             <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-3 mb-4">
                <UserButton afterSignOutUrl="/" />
                <div className='flex flex-col'>
                  <p className="text-sm font-medium">{user?.fullName || user?.primaryEmailAddress?.toString()}</p>
                  <p className="text-xs text-muted-foreground">{tenant!.name} ({tenant!.tier})</p>
                </div>
              </div>
              <SignOutButton redirectUrl="/">
                <Button variant="ghost" className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
        </div>
    )
}

export const Sidebar = () => {
  const { isOpen, onClose } = useSidebarStore();
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:z-50 md:block md:w-64">
        <SidebarContent />
      </aside>
    </>
  );
};