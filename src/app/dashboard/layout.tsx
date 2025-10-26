'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SignedIn } from "@clerk/nextjs";
import { TenantProvider } from "@/components/TenantProvider";
import { useTenant } from "@/lib/tenant-context";
import { Sidebar } from "@/components/sidebar";
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/hooks/use-sidebar-store';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { tenant, isLoading } = useTenant();
  const router = useRouter();
  const { onOpen } = useSidebarStore();

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
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Button variant="outline" size="icon" onClick={onOpen}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <h1 className="text-lg font-semibold">{tenant.name}</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
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