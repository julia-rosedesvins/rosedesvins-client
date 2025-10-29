'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelector } from "@/components/CountrySelector";
import { Clock, Users, Globe, Euro, CreditCard, Grape, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";

interface BookingData {
  date: string;
  selectedTime?: string;
  adults: number;
  children: number;
  language: string;
}

function BookingConfirmationContent({ id, serviceId }: { id: string, serviceId: string }) {
  const { widgetData, loading, error, colorCode } = useWidget();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract booking data from URL parameters
  const bookingData: BookingData = {
    date: searchParams.get('date') || '',
    selectedTime: searchParams.get('selectedTime') || undefined,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    language: searchParams.get('language') || 'Français',
  };

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    dialCode: "+33"
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation helper
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
    return phoneRegex.test(phone.trim());
  };

  // Validation function
  const validateBookingConfirmation = (): boolean => {
    const errors: string[] = [];

    if (!email.trim()) {
      errors.push("L'adresse e-mail est requise");
    } else if (!isValidEmail(email)) {
      errors.push("Veuillez saisir une adresse e-mail valide");
    }

    if (!firstName.trim()) {
      errors.push("Le prénom est requis");
    }

    if (!lastName.trim()) {
      errors.push("Le nom est requis");
    }

    if (!phone.trim()) {
      errors.push("Le numéro de téléphone est requis");
    } else if (!isValidPhone(phone)) {
      errors.push("Veuillez saisir un numéro de téléphone valide");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle booking confirmation
  const handleBookingConfirmation = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double clicks

    if (!validateBookingConfirmation()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // If validation passes, navigate to checkout using Next.js router
      const query = new URLSearchParams({
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
      });

      router.push(`/if/booking-widget/${id}/${serviceId}/checkout?${query.toString()}`);
    } catch (error) {
      // Reset loading state if something goes wrong
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: colorCode }}></div>
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Erreur</h1>
          <p className="text-lg text-gray-600 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  // Format date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: fr });
  };

  const displayTime = bookingData?.selectedTime || "Aucun horaire sélectionné";
  const totalParticipants = (bookingData?.adults ?? 2) + (bookingData?.children ?? 0);
  const pricePerPerson = widgetData?.service?.pricePerPerson ?? 0;
  const totalPrice = totalParticipants * pricePerPerson;

  const formatParticipants = () => {
    const adults = bookingData?.adults ?? 2;
    const children = bookingData?.children ?? 0;

    if (children > 0) {
      return `${totalParticipants} personnes (${adults} adultes, ${children} enfants)`;
    }
    return `${adults} personnes (adultes)`;
  };

  // Function to convert language to French display name
  const getLanguageInFrench = (language: string) => {
    const lang = language.toLowerCase();
    if (lang === 'français' || lang === 'french') return 'Français';
    if (lang === 'anglais' || lang === 'english') return 'Anglais';
    if (lang === 'español' || lang === 'spanish') return 'Espagnol';
    if (lang === 'deutsch' || lang === 'german') return 'Allemand';
    return language; // Return original if no match
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: colorCode }}>
            Demande de réservation
          </h1>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium mb-2">Veuillez corriger les erreurs suivantes :</h3>
              <ul className="text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                  <Clock className="w-5 h-5" style={{ color: colorCode }} />
                  <span>{formatDate(bookingData?.date || new Date().toISOString())} - {displayTime}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Grape className="w-5 h-5" style={{ color: colorCode }} />
                  <span>{widgetData?.service?.name || 'Visite libre & dégustation des cuvées Tradition'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{ color: colorCode }} />
                  <span>{formatParticipants()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: colorCode }} />
                  <span>{getLanguageInFrench(bookingData?.language || "Français")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5" style={{ color: colorCode }} />
                  <span>{totalPrice} €</span>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">Paiement sur place</span>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/if/booking-widget/${id}/${serviceId}/booking?${new URLSearchParams({
                      date: bookingData.date,
                      selectedTime: bookingData.selectedTime || '',
                      adults: bookingData.adults.toString(),
                      children: bookingData.children.toString(),
                      language: bookingData.language,
                    }).toString()}`}
                    className="hover:opacity-75 underline text-sm"
                    style={{ color: colorCode }}
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
            <Button
              onClick={handleBookingConfirmation}
              disabled={isSubmitting}
              className={cn(
                "text-white px-8 py-2",
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90"
              )}
              style={{ backgroundColor: colorCode }}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Traitement...
                </>
              ) : (
                "Confirmer"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const BookingConfirmation = ({ params }: { params: Promise<{ id: string, service_id: string }> }) => {
  const [resolvedParams, setResolvedParams] = useState<{ id: string, service_id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7E53] mx-auto mb-4"></div>
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  const { id, service_id } = resolvedParams;

  return (
    <WidgetProvider userId={id} serviceId={service_id}>
      <BookingConfirmationContent id={id} serviceId={service_id} />
    </WidgetProvider>
  );
};

export default BookingConfirmation;