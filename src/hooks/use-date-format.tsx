'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface DateFormatContextType {
  dateFormat: string;
  timezone: string;
  setDateFormat: (format: string) => void;
  setTimezone: (timezone: string) => void;
  formatDate: (date: Date | string) => string;
  formatDateTime: (date: Date | string) => string;
}

const DateFormatContext = createContext<DateFormatContextType | undefined>(undefined);

export function DateFormatProvider({ children }: { children: ReactNode }) {
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timezone, setTimezone] = useState('UTC');

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const formatted = d.toLocaleDateString('en-US', options);
    
    switch (dateFormat) {
      case 'DD/MM/YYYY':
        const [month, day, year] = formatted.split('/');
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        const [m, d, y] = formatted.split('/');
        return `${y}-${m}-${d}`;
      default:
        return formatted;
    }
  };

  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    return d.toLocaleString('en-US', options);
  };

  return (
    <DateFormatContext.Provider value={{ 
      dateFormat, 
      timezone, 
      setDateFormat, 
      setTimezone, 
      formatDate, 
      formatDateTime 
    }}>
      {children}
    </DateFormatContext.Provider>
  );
}

export function useDateFormat() {
  const context = useContext(DateFormatContext);
  if (!context) {
    throw new Error('useDateFormat must be used within DateFormatProvider');
  }
  return context;
}