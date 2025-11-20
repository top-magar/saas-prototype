'use client';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactCountryFlag from 'react-country-flag';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', country: 'US' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', country: 'ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', country: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', country: 'DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', country: 'IT' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', country: 'PT' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', country: 'RU' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', country: 'JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', country: 'KR' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', country: 'CN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', country: 'SA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', country: 'IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', country: 'NP' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', country: 'BD' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', country: 'TH' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', country: 'VN' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', country: 'TR' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', country: 'PL' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', country: 'NL' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', country: 'SE' },
];

interface LanguageSelectorProps {
  value: string;
  onValueChange: (language: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ value, onValueChange, disabled }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedLanguage = languages.find(lang => lang.code === value);

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
          {selectedLanguage ? (
            <div className="flex items-center gap-2">
              <ReactCountryFlag countryCode={selectedLanguage.country} svg style={{ width: '1rem', height: '1rem' }} />
              <span>{selectedLanguage.nativeName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Select language...</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={`${lang.name} ${lang.nativeName}`}
                  onSelect={() => {
                    onValueChange(lang.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === lang.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag countryCode={lang.country} svg style={{ width: '1rem', height: '1rem' }} />
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground text-sm">- {lang.name}</span>
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