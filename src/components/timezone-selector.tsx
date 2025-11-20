'use client';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import moment from 'moment-timezone';

const popularTimezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Asia/Kathmandu',
  'Australia/Sydney',
];

const allTimezones = moment.tz.names().map(tz => ({
  value: tz,
  label: tz.replace(/_/g, ' '),
  offset: moment.tz(tz).format('Z'),
  city: tz.split('/').pop()?.replace(/_/g, ' ') || tz,
}));

const popularTimezoneData = popularTimezones.map(tz => 
  allTimezones.find(t => t.value === tz)!
);

interface TimezoneSelectorProps {
  value: string;
  onValueChange: (timezone: string) => void;
  disabled?: boolean;
}

export function TimezoneSelector({ value, onValueChange, disabled }: TimezoneSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedTimezone = allTimezones.find(tz => tz.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedTimezone ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{selectedTimezone.city} ({selectedTimezone.offset})</span>
            </div>
          ) : (
            "Select timezone..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search timezone..." />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            <CommandGroup heading="Popular Timezones">
              {popularTimezoneData.map((tz) => (
                <CommandItem
                  key={tz.value}
                  value={`${tz.city} ${tz.value} ${tz.offset}`}
                  onSelect={() => {
                    onValueChange(tz.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === tz.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{tz.city}</span>
                    <span className="text-muted-foreground text-sm">{tz.offset}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="All Timezones">
              {allTimezones.map((tz) => (
                <CommandItem
                  key={tz.value}
                  value={`${tz.city} ${tz.value} ${tz.offset}`}
                  onSelect={() => {
                    onValueChange(tz.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === tz.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{tz.city}</span>
                    <span className="text-muted-foreground text-sm">{tz.offset}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}