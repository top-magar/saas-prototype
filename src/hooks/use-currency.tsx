'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
  exchangeRates: Record<string, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencies = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.85 },
  GBP: { symbol: '£', rate: 0.73 },
  JPY: { symbol: '¥', rate: 110 },
  CAD: { symbol: 'C$', rate: 1.25 },
  AUD: { symbol: 'A$', rate: 1.35 },
  CHF: { symbol: 'Fr', rate: 0.92 },
  CNY: { symbol: '¥', rate: 6.45 },
  INR: { symbol: '₹', rate: 74.5 },
  NPR: { symbol: 'Rs', rate: 119.2 },
  AED: { symbol: 'د.إ', rate: 3.67 },
  BRL: { symbol: 'R$', rate: 5.2 },
  KRW: { symbol: '₩', rate: 1180 },
  MXN: { symbol: '$', rate: 18.5 },
  SGD: { symbol: '$', rate: 1.35 },
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    // Simulate real-time rate updates
    const updateRates = () => {
      const rates: Record<string, number> = {};
      Object.entries(currencies).forEach(([code, data]) => {
        // Add small random fluctuation to simulate real rates
        const fluctuation = (Math.random() - 0.5) * 0.02;
        rates[code] = data.rate * (1 + fluctuation);
      });
      setExchangeRates(rates);
    };

    updateRates();
    const interval = setInterval(updateRates, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    const rate = exchangeRates[currency] || currencies[currency as keyof typeof currencies]?.rate || 1;
    const convertedAmount = amount * rate;
    const symbol = currencies[currency as keyof typeof currencies]?.symbol || '$';
    
    const decimals = ['JPY', 'KRW'].includes(currency) ? 0 : 2;
    
    return `${symbol}${convertedAmount.toLocaleString(undefined, { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, exchangeRates }}>
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