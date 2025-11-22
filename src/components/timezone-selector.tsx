'use client';

import { SUPPORTED_TIMEZONES } from '@/lib/preferences';
import { usePreferences } from '@/app/context/preferences-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TimezoneSelector() {
  const { preferences, setPreferences } = usePreferences();

  return (
    <Select
      value={preferences.timezone}
      onValueChange={(value) => setPreferences({ timezone: value })}
    >
      <SelectTrigger className="w-full rounded-lg">
        <SelectValue placeholder="Select Timezone" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_TIMEZONES.map((tz) => (
          <SelectItem key={tz} value={tz}>
            {tz}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}