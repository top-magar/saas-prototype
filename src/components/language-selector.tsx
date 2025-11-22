'use client';

import { SUPPORTED_LANGUAGES } from '@/lib/preferences';
import { usePreferences } from '@/app/context/preferences-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSelector() {
  const { preferences, setPreferences } = usePreferences();

  return (
    <Select
      value={preferences.language}
      onValueChange={(value) => setPreferences({ language: value })}
    >
      <SelectTrigger className="w-full rounded-lg">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}