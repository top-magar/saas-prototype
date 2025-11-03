'use client';
import { TenantProvider } from './tenant-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TenantProvider>
        {children}
      </TenantProvider>
    </ThemeProvider>
  );
}