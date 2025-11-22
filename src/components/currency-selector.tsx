'use client';

import { SUPPORTED_CURRENCIES } from '@/lib/preferences';
import { usePreferences } from '@/app/context/preferences-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CurrencySelector() {
  const { preferences, setPreferences } = usePreferences();

  return (
    <Select
      value={preferences.currency}
      onValueChange={(value) => setPreferences({ currency: value })}
    >
      <SelectTrigger className="w-[140px] h-8 text-xs bg-muted/50 border-none focus:ring-0">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(SUPPORTED_CURRENCIES).map(([code, name]) => (
          <SelectItem key={code} value={code} className="text-xs">
            <span className="font-medium mr-2">{code}</span>
            <span className="text-muted-foreground">{name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CurrencyDisplay({ amount }: { amount: number }) {
  const { formatCurrency } = usePreferences();
  return <>{formatCurrency(amount)}</>;
}