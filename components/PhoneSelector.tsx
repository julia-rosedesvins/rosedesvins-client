import { useState, useEffect } from "react";
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
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", dialCode: "+93" },
  { code: "AL", name: "Albanie", flag: "🇦🇱", dialCode: "+355" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿", dialCode: "+213" },
  { code: "AD", name: "Andorre", flag: "🇦🇩", dialCode: "+376" },
  { code: "AO", name: "Angola", flag: "🇦🇴", dialCode: "+244" },
  { code: "AG", name: "Antigua-et-Barbuda", flag: "🇦🇬", dialCode: "+1-268" },
  { code: "AR", name: "Argentine", flag: "🇦🇷", dialCode: "+54" },
  { code: "AM", name: "Arménie", flag: "🇦🇲", dialCode: "+374" },
  { code: "AU", name: "Australie", flag: "🇦🇺", dialCode: "+61" },
  { code: "AT", name: "Autriche", flag: "🇦🇹", dialCode: "+43" },
  { code: "AZ", name: "Azerbaïdjan", flag: "🇦🇿", dialCode: "+994" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", dialCode: "+1-242" },
  { code: "BH", name: "Bahreïn", flag: "🇧🇭", dialCode: "+973" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", dialCode: "+880" },
  { code: "BB", name: "Barbade", flag: "🇧🇧", dialCode: "+1-246" },
  { code: "BY", name: "Biélorussie", flag: "🇧🇾", dialCode: "+375" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", dialCode: "+32" },
  { code: "BZ", name: "Belize", flag: "🇧🇿", dialCode: "+501" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯", dialCode: "+229" },
  { code: "BT", name: "Bhoutan", flag: "🇧🇹", dialCode: "+975" },
  { code: "BO", name: "Bolivie", flag: "🇧🇴", dialCode: "+591" },
  { code: "BA", name: "Bosnie-Herzégovine", flag: "🇧🇦", dialCode: "+387" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", dialCode: "+267" },
  { code: "BR", name: "Brésil", flag: "🇧🇷", dialCode: "+55" },
  { code: "BN", name: "Brunei", flag: "🇧🇳", dialCode: "+673" },
  { code: "BG", name: "Bulgarie", flag: "🇧🇬", dialCode: "+359" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", dialCode: "+226" },
  { code: "BI", name: "Burundi", flag: "🇧🇮", dialCode: "+257" },
  { code: "CV", name: "Cap-Vert", flag: "🇨🇻", dialCode: "+238" },
  { code: "KH", name: "Cambodge", flag: "🇰🇭", dialCode: "+855" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", dialCode: "+237" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "CF", name: "République centrafricaine", flag: "🇨🇫", dialCode: "+236" },
  { code: "TD", name: "Tchad", flag: "🇹🇩", dialCode: "+235" },
  { code: "CL", name: "Chili", flag: "🇨🇱", dialCode: "+56" },
  { code: "CN", name: "Chine", flag: "🇨🇳", dialCode: "+86" },
  { code: "CO", name: "Colombie", flag: "🇨🇴", dialCode: "+57" },
  { code: "KM", name: "Comores", flag: "🇰🇲", dialCode: "+269" },
  { code: "CG", name: "Congo", flag: "🇨🇬", dialCode: "+242" },
  { code: "CD", name: "RD Congo", flag: "🇨🇩", dialCode: "+243" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", dialCode: "+506" },
  { code: "HR", name: "Croatie", flag: "🇭🇷", dialCode: "+385" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", dialCode: "+53" },
  { code: "CY", name: "Chypre", flag: "🇨🇾", dialCode: "+357" },
  { code: "CZ", name: "République tchèque", flag: "🇨🇿", dialCode: "+420" },
  { code: "DK", name: "Danemark", flag: "🇩🇰", dialCode: "+45" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", dialCode: "+253" },
  { code: "DM", name: "Dominique", flag: "🇩🇲", dialCode: "+1-767" },
  { code: "DO", name: "République dominicaine", flag: "🇩🇴", dialCode: "+1-809" },
  { code: "EC", name: "Équateur", flag: "🇪🇨", dialCode: "+593" },
  { code: "EG", name: "Égypte", flag: "🇪🇬", dialCode: "+20" },
  { code: "SV", name: "Salvador", flag: "🇸🇻", dialCode: "+503" },
  { code: "GQ", name: "Guinée équatoriale", flag: "🇬🇶", dialCode: "+240" },
  { code: "ER", name: "Érythrée", flag: "🇪🇷", dialCode: "+291" },
  { code: "EE", name: "Estonie", flag: "🇪🇪", dialCode: "+372" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", dialCode: "+268" },
  { code: "ET", name: "Éthiopie", flag: "🇪🇹", dialCode: "+251" },
  { code: "FJ", name: "Fidji", flag: "🇫🇯", dialCode: "+679" },
  { code: "FI", name: "Finlande", flag: "🇫🇮", dialCode: "+358" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", dialCode: "+241" },
  { code: "GM", name: "Gambie", flag: "🇬🇲", dialCode: "+220" },
  { code: "GE", name: "Géorgie", flag: "🇬🇪", dialCode: "+995" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", dialCode: "+49" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", dialCode: "+233" },
  { code: "GR", name: "Grèce", flag: "🇬🇷", dialCode: "+30" },
  { code: "GD", name: "Grenade", flag: "🇬🇩", dialCode: "+1-473" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", dialCode: "+502" },
  { code: "GN", name: "Guinée", flag: "🇬🇳", dialCode: "+224" },
  { code: "GW", name: "Guinée-Bissau", flag: "🇬🇼", dialCode: "+245" },
  { code: "GY", name: "Guyana", flag: "🇬🇾", dialCode: "+592" },
  { code: "HT", name: "Haïti", flag: "🇭🇹", dialCode: "+509" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", dialCode: "+504" },
  { code: "HU", name: "Hongrie", flag: "🇭🇺", dialCode: "+36" },
  { code: "IS", name: "Islande", flag: "🇮🇸", dialCode: "+354" },
  { code: "IN", name: "Inde", flag: "🇮🇳", dialCode: "+91" },
  { code: "ID", name: "Indonésie", flag: "🇮🇩", dialCode: "+62" },
  { code: "IR", name: "Iran", flag: "🇮🇷", dialCode: "+98" },
  { code: "IQ", name: "Irak", flag: "🇮🇶", dialCode: "+964" },
  { code: "IE", name: "Irlande", flag: "🇮🇪", dialCode: "+353" },
  { code: "IL", name: "Israël", flag: "🇮🇱", dialCode: "+972" },
  { code: "IT", name: "Italie", flag: "🇮🇹", dialCode: "+39" },
  { code: "JM", name: "Jamaïque", flag: "🇯🇲", dialCode: "+1-876" },
  { code: "JP", name: "Japon", flag: "🇯🇵", dialCode: "+81" },
  { code: "JO", name: "Jordanie", flag: "🇯🇴", dialCode: "+962" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", dialCode: "+7" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", dialCode: "+254" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮", dialCode: "+686" },
  { code: "KP", name: "Corée du Nord", flag: "🇰🇵", dialCode: "+850" },
  { code: "KR", name: "Corée du Sud", flag: "🇰🇷", dialCode: "+82" },
  { code: "KW", name: "Koweït", flag: "🇰🇼", dialCode: "+965" },
  { code: "KG", name: "Kirghizistan", flag: "🇰🇬", dialCode: "+996" },
  { code: "LA", name: "Laos", flag: "🇱🇦", dialCode: "+856" },
  { code: "LV", name: "Lettonie", flag: "🇱🇻", dialCode: "+371" },
  { code: "LB", name: "Liban", flag: "🇱🇧", dialCode: "+961" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", dialCode: "+266" },
  { code: "LR", name: "Libéria", flag: "🇱🇷", dialCode: "+231" },
  { code: "LY", name: "Libye", flag: "🇱🇾", dialCode: "+218" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", dialCode: "+423" },
  { code: "LT", name: "Lituanie", flag: "🇱🇹", dialCode: "+370" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", dialCode: "+352" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", dialCode: "+261" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", dialCode: "+265" },
  { code: "MY", name: "Malaisie", flag: "🇲🇾", dialCode: "+60" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", dialCode: "+960" },
  { code: "ML", name: "Mali", flag: "🇲🇱", dialCode: "+223" },
  { code: "MT", name: "Malte", flag: "🇲🇹", dialCode: "+356" },
  { code: "MH", name: "Îles Marshall", flag: "🇲🇭", dialCode: "+692" },
  { code: "MR", name: "Mauritanie", flag: "🇲🇷", dialCode: "+222" },
  { code: "MU", name: "Maurice", flag: "🇲🇺", dialCode: "+230" },
  { code: "MX", name: "Mexique", flag: "🇲🇽", dialCode: "+52" },
  { code: "FM", name: "Micronésie", flag: "🇫🇲", dialCode: "+691" },
  { code: "MD", name: "Moldavie", flag: "🇲🇩", dialCode: "+373" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", dialCode: "+377" },
  { code: "MN", name: "Mongolie", flag: "🇲🇳", dialCode: "+976" },
  { code: "ME", name: "Monténégro", flag: "🇲🇪", dialCode: "+382" },
  { code: "MA", name: "Maroc", flag: "🇲🇦", dialCode: "+212" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", dialCode: "+258" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", dialCode: "+95" },
  { code: "NA", name: "Namibie", flag: "🇳🇦", dialCode: "+264" },
  { code: "NR", name: "Nauru", flag: "🇳🇷", dialCode: "+674" },
  { code: "NP", name: "Népal", flag: "🇳🇵", dialCode: "+977" },
  { code: "NL", name: "Pays-Bas", flag: "🇳🇱", dialCode: "+31" },
  { code: "NZ", name: "Nouvelle-Zélande", flag: "🇳🇿", dialCode: "+64" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", dialCode: "+505" },
  { code: "NE", name: "Niger", flag: "🇳🇪", dialCode: "+227" },
  { code: "NG", name: "Nigéria", flag: "🇳🇬", dialCode: "+234" },
  { code: "MK", name: "Macédoine du Nord", flag: "🇲🇰", dialCode: "+389" },
  { code: "NO", name: "Norvège", flag: "🇳🇴", dialCode: "+47" },
  { code: "OM", name: "Oman", flag: "🇴🇲", dialCode: "+968" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", dialCode: "+92" },
  { code: "PW", name: "Palaos", flag: "🇵🇼", dialCode: "+680" },
  { code: "PA", name: "Panama", flag: "🇵🇦", dialCode: "+507" },
  { code: "PG", name: "Papouasie-Nouvelle-Guinée", flag: "🇵🇬", dialCode: "+675" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", dialCode: "+595" },
  { code: "PE", name: "Pérou", flag: "🇵🇪", dialCode: "+51" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63" },
  { code: "PL", name: "Pologne", flag: "🇵🇱", dialCode: "+48" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", dialCode: "+974" },
  { code: "RO", name: "Roumanie", flag: "🇷🇴", dialCode: "+40" },
  { code: "RU", name: "Russie", flag: "🇷🇺", dialCode: "+7" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", dialCode: "+250" },
  { code: "KN", name: "Saint-Kitts-et-Nevis", flag: "🇰🇳", dialCode: "+1-869" },
  { code: "LC", name: "Sainte-Lucie", flag: "🇱🇨", dialCode: "+1-758" },
  { code: "VC", name: "Saint-Vincent-et-les-Grenadines", flag: "🇻🇨", dialCode: "+1-784" },
  { code: "WS", name: "Samoa", flag: "🇼🇸", dialCode: "+685" },
  { code: "SM", name: "Saint-Marin", flag: "🇸🇲", dialCode: "+378" },
  { code: "ST", name: "Sao Tomé-et-Principe", flag: "🇸🇹", dialCode: "+239" },
  { code: "SA", name: "Arabie saoudite", flag: "🇸🇦", dialCode: "+966" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳", dialCode: "+221" },
  { code: "RS", name: "Serbie", flag: "🇷🇸", dialCode: "+381" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", dialCode: "+248" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", dialCode: "+232" },
  { code: "SG", name: "Singapour", flag: "🇸🇬", dialCode: "+65" },
  { code: "SK", name: "Slovaquie", flag: "🇸🇰", dialCode: "+421" },
  { code: "SI", name: "Slovénie", flag: "🇸🇮", dialCode: "+386" },
  { code: "SB", name: "Îles Salomon", flag: "🇸🇧", dialCode: "+677" },
  { code: "SO", name: "Somalie", flag: "🇸🇴", dialCode: "+252" },
  { code: "ZA", name: "Afrique du Sud", flag: "🇿🇦", dialCode: "+27" },
  { code: "SS", name: "Soudan du Sud", flag: "🇸🇸", dialCode: "+211" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", dialCode: "+34" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", dialCode: "+94" },
  { code: "SD", name: "Soudan", flag: "🇸🇩", dialCode: "+249" },
  { code: "SR", name: "Suriname", flag: "🇸🇷", dialCode: "+597" },
  { code: "SE", name: "Suède", flag: "🇸🇪", dialCode: "+46" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", dialCode: "+41" },
  { code: "SY", name: "Syrie", flag: "🇸🇾", dialCode: "+963" },
  { code: "TW", name: "Taïwan", flag: "🇹🇼", dialCode: "+886" },
  { code: "TJ", name: "Tadjikistan", flag: "🇹🇯", dialCode: "+992" },
  { code: "TZ", name: "Tanzanie", flag: "🇹🇿", dialCode: "+255" },
  { code: "TH", name: "Thaïlande", flag: "🇹🇭", dialCode: "+66" },
  { code: "TL", name: "Timor oriental", flag: "🇹🇱", dialCode: "+670" },
  { code: "TG", name: "Togo", flag: "🇹🇬", dialCode: "+228" },
  { code: "TO", name: "Tonga", flag: "🇹🇴", dialCode: "+676" },
  { code: "TT", name: "Trinité-et-Tobago", flag: "🇹🇹", dialCode: "+1-868" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳", dialCode: "+216" },
  { code: "TR", name: "Turquie", flag: "🇹🇷", dialCode: "+90" },
  { code: "TM", name: "Turkménistan", flag: "🇹🇲", dialCode: "+993" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻", dialCode: "+688" },
  { code: "UG", name: "Ouganda", flag: "🇺🇬", dialCode: "+256" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", dialCode: "+380" },
  { code: "AE", name: "Émirats arabes unis", flag: "🇦🇪", dialCode: "+971" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", dialCode: "+44" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", dialCode: "+1" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", dialCode: "+598" },
  { code: "UZ", name: "Ouzbékistan", flag: "🇺🇿", dialCode: "+998" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺", dialCode: "+678" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", dialCode: "+58" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84" },
  { code: "YE", name: "Yémen", flag: "🇾🇪", dialCode: "+967" },
  { code: "ZM", name: "Zambie", flag: "🇿🇲", dialCode: "+260" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", dialCode: "+263" },
];

interface PhoneSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const PhoneSelector = ({ value = "", onChange, className }: PhoneSelectorProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // France par défaut
  const [phoneNumber, setPhoneNumber] = useState("");

  // Parse the incoming value to set country and phone number
  useEffect(() => {
    if (value && value.trim() !== "") {
      // Find the matching country by dial code
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        // Extract the phone number part (remove dial code and any leading spaces)
        const phoneNumberPart = value.substring(country.dialCode.length).trim();
        setPhoneNumber(phoneNumberPart);
      } else {
        // If no country match found, try to parse manually
        // Look for patterns like "+49 3170288817" or "+33 612345678"
        const match = value.match(/^(\+\d{1,4})\s*(.*)$/);
        if (match) {
          const dialCode = match[1];
          const phone = match[2];
          const country = countries.find(c => c.dialCode === dialCode);
          if (country) {
            setSelectedCountry(country);
            setPhoneNumber(phone);
          }
        }
      }
    }
  }, [value]);

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