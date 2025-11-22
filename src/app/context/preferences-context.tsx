'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/lib/preferences';
import { formatCurrency as formatCurrencyHelper, formatDateTime as formatDateTimeHelper, formatDate as formatDateHelper } from '@/lib/formatters';

interface PreferencesContextType {
    preferences: UserPreferences;
    setPreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
    isLoading: boolean;
    formatCurrency: (amount: number) => string;
    formatDateTime: (date: Date | string | number) => string;
    formatDate: (date: Date | string | number) => string;
    // Helper to get symbol for current currency
    currencySymbol: string;
    // Helper to convert price (placeholder for now until we have real rates)
    convertPrice: (amount: number) => number;
    exchangeRates: Record<string, number>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferencesState] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const [isLoading, setIsLoading] = useState(true);
    // We'll keep a simple exchange rate map for now, similar to useCurrency
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
        NPR: 1,
        USD: 0.0075,
        EUR: 0.0069,
        JPY: 1.13,
        INR: 0.62,
        GBP: 0.0059,
        AUD: 0.011
    });

    // Load preferences on mount
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                // 1. Try to get from localStorage first for immediate render
                const stored = localStorage.getItem('userPreferences');
                if (stored) {
                    setPreferencesState(JSON.parse(stored));
                } else {
                    // 2. If nothing stored, try to detect timezone
                    try {
                        const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                        setPreferencesState(prev => ({ ...prev, timezone: detectedTz }));
                    } catch (e) {
                        // Ignore detection errors
                    }
                }

                // 3. If authenticated, fetch from API (TODO: Implement API)
                // const response = await fetch('/api/user/preferences');
                // if (response.ok) { ... }

            } catch (error) {
                console.error('Failed to load preferences:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPreferences();
    }, []);

    const setPreferences = async (newPrefs: Partial<UserPreferences>) => {
        const updated = { ...preferences, ...newPrefs };
        setPreferencesState(updated);

        // Store locally
        localStorage.setItem('userPreferences', JSON.stringify(updated));

        // Sync to database if authenticated (TODO: Implement API)
        /*
        try {
          await fetch('/api/user/preferences', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPrefs)
          });
        } catch (error) {
          console.error('Failed to save preferences:', error);
        }
        */
    };

    const formatCurrency = (amount: number) => {
        // First convert to selected currency
        // Base assumption: Input amount is in NPR (since we are Nepal-first)
        // If input is USD, we need a different conversion logic.
        // For this prototype, let's assume base prices are in NPR for now, 
        // OR we keep the existing logic where base was USD?
        // The previous useCurrency had base NPR = 1.

        const rate = exchangeRates[preferences.currency] || 1;
        const convertedAmount = amount * rate;

        // Use the locale from preferences, or fallback to 'en-US' if 'en'
        const localeMap: Record<string, string> = {
            'en': 'en-US',
            'ne': 'ne-NP',
            'ja': 'ja-JP',
            'es': 'es-ES'
        };
        const locale = localeMap[preferences.language] || 'en-US';

        return formatCurrencyHelper(convertedAmount, preferences.currency, locale);
    };

    const convertPrice = (amount: number) => {
        const rate = exchangeRates[preferences.currency] || 1;
        return amount * rate;
    };

    // Helper to get symbol
    const currencySymbol = (function () {
        try {
            return (0).toLocaleString(
                preferences.language === 'ne' ? 'ne-NP' : 'en-US',
                { style: 'currency', currency: preferences.currency }
            ).replace(/\d+[\.,]?\d*/, '').trim();
        } catch {
            return '$';
        }
    })();

    const formatDate = (date: Date | string | number) => {
        const localeMap: Record<string, string> = {
            'en': 'en-US',
            'ne': 'ne-NP',
            'ja': 'ja-JP',
            'es': 'es-ES'
        };
        const locale = localeMap[preferences.language] || 'en-US';
        return formatDateHelper(date, preferences.timezone, locale);
    };

    const formatDateTime = (date: Date | string | number) => {
        const localeMap: Record<string, string> = {
            'en': 'en-US',
            'ne': 'ne-NP',
            'ja': 'ja-JP',
            'es': 'es-ES'
        };
        const locale = localeMap[preferences.language] || 'en-US';
        return formatDateTimeHelper(date, preferences.timezone, locale);
    };

    return (
        <PreferencesContext.Provider value={{
            preferences,
            setPreferences,
            isLoading,
            formatCurrency,
            formatDate,
            formatDateTime,
            convertPrice,
            currencySymbol,
            exchangeRates
        }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within PreferencesProvider');
    }
    return context;
}
