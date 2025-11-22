export interface UserPreferences {
    language: string; // 'en', 'ja', 'es', 'ne'
    timezone: string; // 'Asia/Kathmandu', 'UTC', 'Europe/London'
    currency: string; // 'USD', 'NPR', 'JPY'
}

// Default preferences (Nepal-first approach)
export const DEFAULT_PREFERENCES: UserPreferences = {
    language: 'en', // Defaulting to English for UI, but can be 'ne'
    timezone: 'Asia/Kathmandu',
    currency: 'NPR'
};

export const SUPPORTED_LANGUAGES = {
    en: 'English',
    ne: 'नेपाली',
    es: 'Español',
    ja: '日本語',
};

export const SUPPORTED_TIMEZONES = [
    'Asia/Kathmandu',
    'Asia/Tokyo',
    'UTC',
    'Europe/London',
    'America/New_York',
    'Australia/Sydney'
];

export const SUPPORTED_CURRENCIES = {
    NPR: 'Nepali Rupee',
    USD: 'US Dollar',
    EUR: 'Euro',
    JPY: 'Japanese Yen',
    INR: 'Indian Rupee',
    GBP: 'British Pound',
    AUD: 'Australian Dollar'
};
