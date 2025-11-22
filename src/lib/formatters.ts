export function formatCurrency(
    amount: number, // in minor units (cents) or standard units depending on usage. 
    // Note: The previous implementation used standard units (e.g. 100 for 100 rupees). 
    // The guide suggested minor units. For consistency with existing app, we might need to handle this carefully.
    // Let's assume standard units for now to match existing useCurrency, or we adapt.
    // The guide says "amount_minor_units BIGINT". 
    // If we pass standard units here, we shouldn't divide by 100.
    // Let's stick to standard units for the UI helper for now to avoid breaking changes, 
    // or explicitly document that input is standard units.
    currency: string,
    locale: string = 'en-US' // Default fallback
): string {
    try {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: ['JPY', 'KRW'].includes(currency) ? 0 : 2,
            maximumFractionDigits: ['JPY', 'KRW'].includes(currency) ? 0 : 2
        });

        return formatter.format(amount);
    } catch (error) {
        console.error(`Error formatting currency: ${currency}`, error);
        return `${currency} ${amount}`;
    }
}

export function formatDate(
    date: Date | string | number,
    timezone: string,
    locale: string = 'en-US'
): string {
    try {
        const d = new Date(date);
        const formatter = new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return formatter.format(d);
    } catch (error) {
        console.error(`Error formatting date`, error);
        return new Date(date).toLocaleDateString();
    }
}

export function formatDateTime(
    date: Date | string | number,
    timezone: string,
    locale: string = 'en-US'
): string {
    try {
        const d = new Date(date);
        const formatter = new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return formatter.format(d);
    } catch (error) {
        console.error(`Error formatting datetime`, error);
        return new Date(date).toLocaleString();
    }
}

export function formatNumber(
    number: number,
    locale: string = 'en-US'
): string {
    try {
        return new Intl.NumberFormat(locale).format(number);
    } catch (error) {
        return number.toString();
    }
}
