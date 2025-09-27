import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", dialCode: "+34" },
  { code: "IT", name: "Italie", flag: "🇮🇹", dialCode: "+39" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", dialCode: "+49" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", dialCode: "+44" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", dialCode: "+1" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", dialCode: "+32" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", dialCode: "+41" },
  { code: "NL", name: "Pays-Bas", flag: "🇳🇱", dialCode: "+31" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
];

interface CountrySelectorProps {
  value?: Country;
  onSelect: (country: Country) => void;
}

export const CountrySelector = ({ value, onSelect }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const selectedCountry = value || countries[0]; // France par défaut

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[140px] justify-between h-10 px-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-background border shadow-md">
        <Command>
          <CommandInput placeholder="Rechercher un pays..." />
          <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {countries.map((country) => (
              <CommandItem
                key={country.code}
                value={`${country.name} ${country.dialCode}`}
                onSelect={() => {
                  onSelect(country);
                  setOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent"
              >
                <span className="text-lg">{country.flag}</span>
                <span className="flex-1">{country.name}</span>
                <span className="text-sm text-muted-foreground">{country.dialCode}</span>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};