'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelector } from "@/components/CountrySelector";
import { Clock, Users, Globe, Euro, CreditCard, Grape } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BookingData {
  date: string;
  selectedTime?: string;
  adults: number;
  children: number;
  language: string;
}

const BookingConfirmation = ({ params }: { params: Promise<{ id: string, service_id: string }> }) => {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');

  useEffect(() => {
    params.then(({ id, service_id }) => {
      setId(id);
      setServiceId(service_id);
    });
  }, [params]);
  
  // Extract booking data from URL parameters
  const bookingData: BookingData = {
    date: searchParams.get('date') || '',
    selectedTime: searchParams.get('selectedTime') || undefined,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    language: searchParams.get('language') || 'Français',
  };
  
  const [email, setEmail] = useState("juliette.dupont@gmail.com");
  const [firstName, setFirstName] = useState("Juliette");
  const [lastName, setLastName] = useState("Dupont");
  const [phone, setPhone] = useState("06 17 86 99 36");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "FR",
    name: "France", 
    flag: "🇫🇷",
    dialCode: "+33"
  });

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: fr });
  };

  const displayTime = bookingData?.selectedTime || "Aucun horaire sélectionné";
  const totalParticipants = (bookingData?.adults || 2) + (bookingData?.children || 0);
  const totalPrice = totalParticipants * 5; // 5€ per person

  const formatParticipants = () => {
    const adults = bookingData?.adults || 2;
    const children = bookingData?.children || 0;
    
    if (children > 0) {
      return `${totalParticipants} personnes (${adults} adultes, ${children} enfants)`;
    }
    return `${adults} personnes (adultes)`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: '#3A7E53' }}>
            Demande de réservation
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Informations de contact */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>
              
              <div className="space-y-4">
                <Input
                  placeholder="Adresse e-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Input
                    placeholder="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <CountrySelector
                    value={selectedCountry}
                    onSelect={setSelectedCountry}
                  />
                  <Input
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Récapitulatif de la demande */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Récapitulatif de la demande</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span>{formatDate(bookingData?.date || new Date().toISOString())} - {displayTime}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Grape className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span>Visite libre & dégustation des cuvées Tradition</span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span>{formatParticipants()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span>{bookingData?.language || "Français"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span>{totalPrice} €</span>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span className="text-sm">Paiement en ligne</span>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/if/booking-widget/${id}/booking?${new URLSearchParams({
                      date: bookingData.date,
                      selectedTime: bookingData.selectedTime || '',
                      adults: bookingData.adults.toString(),
                      children: bookingData.children.toString(),
                      language: bookingData.language,
                    }).toString()}`}
                    className="hover:opacity-75 underline text-sm"
                    style={{ color: '#3A7E53' }}
                  >
                    Modifier ma réservation
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Information supplémentaire */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">
              Une information supplémentaire à nous partager ? 
              <span className="text-muted-foreground font-normal italic"> (facultatif)</span>
            </h3>
            <Textarea
              placeholder="Dites-nous tout"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="min-h-24"
            />
          </div>

          {/* Bouton Confirmer */}
          <div className="flex justify-end mt-6">
            <Link
              href={`/if/booking-widget/${id}/${serviceId}/checkout?${new URLSearchParams({
                date: bookingData.date,
                selectedTime: bookingData.selectedTime || '',
                adults: bookingData.adults.toString(),
                children: bookingData.children.toString(),
                language: bookingData.language,
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                additionalInfo: additionalInfo,
              }).toString()}`}
            >
              <Button 
                className="hover:opacity-90 text-white px-8 py-2"
                style={{ backgroundColor: '#3A7E53' }}
                size="lg"
              >
                Confirmer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;