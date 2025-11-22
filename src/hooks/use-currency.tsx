'use client';
import { createContext, useContext, ReactNode } from 'react';
import { usePreferences } from '@/app/context/preferences-context';

// Legacy context interface for backward compatibility
interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
  convertPrice: (amount: number) => number;
  currencySymbol: string;
  exchangeRates: Record<string, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { preferences, setPreferences, formatCurrency, convertPrice, currencySymbol, exchangeRates } = usePreferences();

  const currency = preferences.currency;
  const setCurrency = (newCurrency: string) => {
    setPreferences({ currency: newCurrency });
  };

  // We don't need to manage state here anymore, just pass through from preferences

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatCurrency,
      convertPrice,
      currencySymbol,
      exchangeRates: exchangeRates || {}
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}