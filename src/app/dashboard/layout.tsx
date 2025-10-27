'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SignedIn } from "@clerk/nextjs";
import { TenantProvider } from "@/components/TenantProvider";
import { useTenant } from "@/lib/tenant-context";
import { Sidebar } from "@/components/sidebar";
import { Header } from '@/components/header';
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { tenant, isLoading } = useTenant();
  const router = useRouter();
  const { isCollapsed } = useSidebarStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !tenant) {
      router.push('/tenant/new');
    }
  }, [isLoading, tenant, router]);

  if (isLoading || !tenant) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-40">
          <Button variant="outline" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out h-screen overflow-hidden",
        isCollapsed ? "md:ml-20" : "md:ml-64",
        "ml-0" // Reset ml for mobile, handled by sheet
      )}>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto scroll-smooth">
            <div className="container mx-auto py-8">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignedIn>
      <TenantProvider>
        <DashboardContent>
          {children}
        </DashboardContent>
      </TenantProvider>
    </SignedIn>
  );
}