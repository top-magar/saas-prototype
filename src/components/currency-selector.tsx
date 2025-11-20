'use client';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import CurrencyFlag from 'react-currency-flags';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'US' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'EU' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'JP' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'AU' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', country: 'CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'CN' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'IN' },
  { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee', country: 'NP' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', country: 'AE' },
  { code: 'AFN', symbol: '؋', name: 'Afghan Afghani', country: 'AF' },
  { code: 'ALL', symbol: 'L', name: 'Albanian Lek', country: 'AL' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram', country: 'AM' },
  { code: 'ANG', symbol: 'ƒ', name: 'Netherlands Antillean Guilder', country: 'AN' },
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza', country: 'AO' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', country: 'AR' },
  { code: 'AWG', symbol: 'ƒ', name: 'Aruban Florin', country: 'AW' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat', country: 'AZ' },
  { code: 'BAM', symbol: 'KM', name: 'Bosnia-Herzegovina Convertible Mark', country: 'BA' },
  { code: 'BBD', symbol: '$', name: 'Barbadian Dollar', country: 'BB' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', country: 'BD' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', country: 'BG' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', country: 'BH' },
  { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc', country: 'BI' },
  { code: 'BMD', symbol: '$', name: 'Bermudan Dollar', country: 'BM' },
  { code: 'BND', symbol: '$', name: 'Brunei Dollar', country: 'BN' },
  { code: 'BOB', symbol: '$b', name: 'Bolivian Boliviano', country: 'BO' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', country: 'BR' },
  { code: 'BSD', symbol: '$', name: 'Bahamian Dollar', country: 'BS' },
  { code: 'BTN', symbol: 'Nu.', name: 'Bhutanese Ngultrum', country: 'BT' },
  { code: 'BWP', symbol: 'P', name: 'Botswanan Pula', country: 'BW' },
  { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble', country: 'BY' },
  { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar', country: 'BZ' },
  { code: 'CDF', symbol: 'FC', name: 'Congolese Franc', country: 'CD' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', country: 'CL' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', country: 'CO' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón', country: 'CR' },
  { code: 'CUP', symbol: '₱', name: 'Cuban Peso', country: 'CU' },
  { code: 'CVE', symbol: '$', name: 'Cape Verdean Escudo', country: 'CV' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Republic Koruna', country: 'CZ' },
  { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc', country: 'DJ' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', country: 'DK' },
  { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso', country: 'DO' },
  { code: 'DZD', symbol: 'دج', name: 'Algerian Dinar', country: 'DZ' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound', country: 'EG' },
  { code: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa', country: 'ER' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', country: 'ET' },
  { code: 'FJD', symbol: '$', name: 'Fijian Dollar', country: 'FJ' },
  { code: 'FKP', symbol: '£', name: 'Falkland Islands Pound', country: 'FK' },
  { code: 'GEL', symbol: '₾', name: 'Georgian Lari', country: 'GE' },
  { code: 'GGP', symbol: '£', name: 'Guernsey Pound', country: 'GG' },
  { code: 'GHS', symbol: '¢', name: 'Ghanaian Cedi', country: 'GH' },
  { code: 'GIP', symbol: '£', name: 'Gibraltar Pound', country: 'GI' },
  { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi', country: 'GM' },
  { code: 'GNF', symbol: 'FG', name: 'Guinean Franc', country: 'GN' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal', country: 'GT' },
  { code: 'GYD', symbol: '$', name: 'Guyanaese Dollar', country: 'GY' },
  { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar', country: 'HK' },
  { code: 'HNL', symbol: 'L', name: 'Honduran Lempira', country: 'HN' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', country: 'HR' },
  { code: 'HTG', symbol: 'G', name: 'Haitian Gourde', country: 'HT' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', country: 'HU' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', country: 'ID' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Sheqel', country: 'IL' },
  { code: 'IMP', symbol: '£', name: 'Manx pound', country: 'IM' },
  { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar', country: 'IQ' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial', country: 'IR' },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna', country: 'IS' },
  { code: 'JEP', symbol: '£', name: 'Jersey Pound', country: 'JE' },
  { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar', country: 'JM' },
  { code: 'JOD', symbol: 'JD', name: 'Jordanian Dinar', country: 'JO' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', country: 'KE' },
  { code: 'KGS', symbol: 'лв', name: 'Kyrgystani Som', country: 'KG' },
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel', country: 'KH' },
  { code: 'KMF', symbol: 'CF', name: 'Comorian Franc', country: 'KM' },
  { code: 'KPW', symbol: '₩', name: 'North Korean Won', country: 'KP' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', country: 'KR' },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar', country: 'KW' },
  { code: 'KYD', symbol: '$', name: 'Cayman Islands Dollar', country: 'KY' },
  { code: 'KZT', symbol: 'лв', name: 'Kazakhstani Tenge', country: 'KZ' },
  { code: 'LAK', symbol: '₭', name: 'Laotian Kip', country: 'LA' },
  { code: 'LBP', symbol: '£', name: 'Lebanese Pound', country: 'LB' },
  { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee', country: 'LK' },
  { code: 'LRD', symbol: '$', name: 'Liberian Dollar', country: 'LR' },
  { code: 'LSL', symbol: 'M', name: 'Lesotho Loti', country: 'LS' },
  { code: 'LYD', symbol: 'LD', name: 'Libyan Dinar', country: 'LY' },
  { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham', country: 'MA' },
  { code: 'MDL', symbol: 'lei', name: 'Moldovan Leu', country: 'MD' },
  { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary', country: 'MG' },
  { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar', country: 'MK' },
  { code: 'MMK', symbol: 'K', name: 'Myanma Kyat', country: 'MM' },
  { code: 'MNT', symbol: '₮', name: 'Mongolian Tugrik', country: 'MN' },
  { code: 'MOP', symbol: 'MOP$', name: 'Macanese Pataca', country: 'MO' },
  { code: 'MRU', symbol: 'UM', name: 'Mauritanian Ouguiya', country: 'MR' },
  { code: 'MUR', symbol: '₨', name: 'Mauritian Rupee', country: 'MU' },
  { code: 'MVR', symbol: 'Rf', name: 'Maldivian Rufiyaa', country: 'MV' },
  { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha', country: 'MW' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', country: 'MX' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'MY' },
  { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical', country: 'MZ' },
  { code: 'NAD', symbol: '$', name: 'Namibian Dollar', country: 'NA' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', country: 'NG' },
  { code: 'NIO', symbol: 'C$', name: 'Nicaraguan Córdoba', country: 'NI' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', country: 'NO' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar', country: 'NZ' },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial', country: 'OM' },
  { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa', country: 'PA' },
  { code: 'PEN', symbol: 'S/.', name: 'Peruvian Nuevo Sol', country: 'PE' },
  { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina', country: 'PG' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', country: 'PH' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', country: 'PK' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', country: 'PL' },
  { code: 'PYG', symbol: 'Gs', name: 'Paraguayan Guarani', country: 'PY' },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Rial', country: 'QA' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', country: 'RO' },
  { code: 'RSD', symbol: 'Дин.', name: 'Serbian Dinar', country: 'RS' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', country: 'RU' },
  { code: 'RWF', symbol: 'R₣', name: 'Rwandan Franc', country: 'RW' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', country: 'SA' },
  { code: 'SBD', symbol: '$', name: 'Solomon Islands Dollar', country: 'SB' },
  { code: 'SCR', symbol: '₨', name: 'Seychellois Rupee', country: 'SC' },
  { code: 'SDG', symbol: 'LS', name: 'Sudanese Pound', country: 'SD' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', country: 'SE' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar', country: 'SG' },
  { code: 'SHP', symbol: '£', name: 'Saint Helena Pound', country: 'SH' },
  { code: 'SLE', symbol: 'Le', name: 'Sierra Leonean Leone', country: 'SL' },
  { code: 'SOS', symbol: 'S', name: 'Somali Shilling', country: 'SO' },
  { code: 'SRD', symbol: '$', name: 'Surinamese Dollar', country: 'SR' },
  { code: 'STN', symbol: 'Db', name: 'São Tomé and Príncipe Dobra', country: 'ST' },
  { code: 'SVC', symbol: '$', name: 'Salvadoran Colón', country: 'SV' },
  { code: 'SYP', symbol: '£', name: 'Syrian Pound', country: 'SY' },
  { code: 'SZL', symbol: 'E', name: 'Swazi Lilangeni', country: 'SZ' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', country: 'TH' },
  { code: 'TJS', symbol: 'SM', name: 'Tajikistani Somoni', country: 'TJ' },
  { code: 'TMT', symbol: 'T', name: 'Turkmenistani Manat', country: 'TM' },
  { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar', country: 'TN' },
  { code: 'TOP', symbol: 'T$', name: 'Tongan Paʻanga', country: 'TO' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', country: 'TR' },
  { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar', country: 'TT' },
  { code: 'TVD', symbol: '$', name: 'Tuvaluan Dollar', country: 'TV' },
  { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', country: 'TW' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', country: 'TZ' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', country: 'UA' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', country: 'UG' },
  { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', country: 'UY' },
  { code: 'UZS', symbol: 'лв', name: 'Uzbekistan Som', country: 'UZ' },
  { code: 'VED', symbol: 'Bs', name: 'Venezuelan Bolívar', country: 'VE' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', country: 'VN' },
  { code: 'VUV', symbol: 'VT', name: 'Vanuatu Vatu', country: 'VU' },
  { code: 'WST', symbol: 'WS$', name: 'Samoan Tala', country: 'WS' },
  { code: 'XAF', symbol: 'FCFA', name: 'CFA Franc BEAC', country: 'CM' },
  { code: 'XCD', symbol: '$', name: 'East Caribbean Dollar', country: 'AG' },
  { code: 'XDR', symbol: 'SDR', name: 'Special Drawing Rights', country: 'XX' },
  { code: 'XOF', symbol: 'CFA', name: 'CFA Franc BCEAO', country: 'BF' },
  { code: 'XPF', symbol: '₣', name: 'CFP Franc', country: 'PF' },
  { code: 'YER', symbol: '﷼', name: 'Yemeni Rial', country: 'YE' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', country: 'ZA' },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha', country: 'ZM' },
  { code: 'ZWL', symbol: 'Z$', name: 'Zimbabwean Dollar', country: 'ZW' },
];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  const selectedCurrency = currencies.find(c => c.code === currency);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2">
              <CurrencyFlag currency={selectedCurrency.code} size="sm" />
              <span>{selectedCurrency.symbol} {selectedCurrency.code}</span>
            </div>
          ) : (
            "Select currency..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((curr) => (
                <CommandItem
                  key={curr.code}
                  value={`${curr.code} ${curr.name}`}
                  onSelect={() => {
                    setCurrency(curr.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currency === curr.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <CurrencyFlag currency={curr.code} size="sm" />
                    <span>{curr.symbol} {curr.code}</span>
                    <span className="text-muted-foreground text-sm">- {curr.name}</span>
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

export function CurrencyDisplay({ amount }: { amount: number }) {
  const { formatCurrency } = useCurrency();
  return <span>{formatCurrency(amount)}</span>;
}