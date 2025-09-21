import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  // Pays européens
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", dialCode: "+49" },
  { code: "IT", name: "Italie", flag: "🇮🇹", dialCode: "+39" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", dialCode: "+34" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", dialCode: "+44" },
  { code: "NL", name: "Pays-Bas", flag: "🇳🇱", dialCode: "+31" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", dialCode: "+32" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", dialCode: "+41" },
  { code: "AT", name: "Autriche", flag: "🇦🇹", dialCode: "+43" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  
  // États-Unis
  { code: "US", name: "États-Unis", flag: "🇺🇸", dialCode: "+1" },
  
  // Pays asiatiques
  { code: "CN", name: "Chine", flag: "🇨🇳", dialCode: "+86" },
  { code: "JP", name: "Japon", flag: "🇯🇵", dialCode: "+81" },
  { code: "KR", name: "Corée du Sud", flag: "🇰🇷", dialCode: "+82" },
  { code: "IN", name: "Inde", flag: "🇮🇳", dialCode: "+91" },
  { code: "TH", name: "Thaïlande", flag: "🇹🇭", dialCode: "+66" },
  { code: "SG", name: "Singapour", flag: "🇸🇬", dialCode: "+65" },
  
  // Australie
  { code: "AU", name: "Australie", flag: "🇦🇺", dialCode: "+61" }
];

interface PhoneSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const PhoneSelector = ({ value = "", onChange, className }: PhoneSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // France par défaut
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      const fullNumber = `${country.dialCode} ${phoneNumber}`;
      onChange?.(fullNumber);
    }
  };

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone);
    const fullNumber = `${selectedCountry.dialCode} ${phone}`;
    onChange?.(fullNumber);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[140px]">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm">{selectedCountry.dialCode}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background border border-border">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{country.flag}</span>
                <span className="text-sm">{country.dialCode}</span>
                <span className="text-sm">{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        type="tel"
        placeholder="06 12 34 56 78"
        value={phoneNumber}
        onChange={(e) => handlePhoneChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};