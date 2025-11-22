'use client';
import { TenantProvider } from '../providers/tenant-provider';
import { CurrencyProvider } from '@/hooks/use-currency';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { PreferencesProvider } from '@/app/context/preferences-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TenantProvider>
        <PreferencesProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </PreferencesProvider>
      </TenantProvider>
    </ThemeProvider>
  );
}