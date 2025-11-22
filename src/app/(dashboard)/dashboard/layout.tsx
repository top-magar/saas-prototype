'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { TenantProvider } from "@/components/_shared";
import { useTenant } from "@/lib/tenant-context";
import dynamic from 'next/dynamic';

const AppSidebar = dynamic(() => import("../_components/sidebar/app-sidebar").then(mod => mod.AppSidebar), { ssr: false });
const Header = dynamic(() => import('../_components/header').then(mod => mod.Header), { ssr: false });

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ErrorBoundary } from "@/components/error-boundary";
import { NavigationProgress } from "@/components/_shared";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { CurrencyProvider } from "@/hooks/use-currency";
import { DateFormatProvider } from "@/hooks/use-date-format";
import { LanguageProvider } from "@/hooks/use-language";
import { PreferencesProvider } from "@/app/context/preferences-context";
import { MobileNav } from "@/components/mobile-nav";


function DashboardContent({ children }: { children: React.ReactNode }) {
  const { tenant, isLoading } = useTenant();


  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <>

        <div className="flex h-screen w-full items-center justify-center bg-background">
          <p className="text-muted-foreground">Setting up your store...</p>
        </div>
      </>
    );
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <NavigationProgress />
          <Header />
          <SmoothScroll className="flex-1 overflow-auto">
            <main>
              <ErrorBoundary>
                <div className="h-full w-full max-w-full p-4 sm:p-6 pb-20 md:pb-6">
                  {children}
                </div>
              </ErrorBoundary>
            </main>
          </SmoothScroll>
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <LanguageProvider>
      <PreferencesProvider>
        <CurrencyProvider>
          <DateFormatProvider>
            <TenantProvider>
              <DashboardContent>
                {children}
              </DashboardContent>
            </TenantProvider>
          </DateFormatProvider>
        </CurrencyProvider>
      </PreferencesProvider>
    </LanguageProvider>
  );
}