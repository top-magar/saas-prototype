'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SignedIn } from "@clerk/nextjs";
import { TenantProvider } from "@/components/_shared";
import { useTenant } from "@/lib/tenant-context";
import dynamic from 'next/dynamic';

const AppSidebar = dynamic(() => import("../_components/sidebar/app-sidebar").then(mod => mod.AppSidebar), { ssr: false });
const Header = dynamic(() => import('../_components/header').then(mod => mod.Header), { ssr: false });

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ErrorBoundary } from "@/components/error-boundary";
import { NavigationProgress } from "@/components/_shared";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { tenant, isLoading } = useTenant();
  const router = useRouter();

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
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <NavigationProgress />
          <Header />
          <main className="flex-1 overflow-auto">
            <ErrorBoundary>
              <div className="h-full w-full max-w-full p-4 sm:p-6">
                {children}
              </div>
            </ErrorBoundary>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
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