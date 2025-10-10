'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, Grape, Users, Globe, Euro, CreditCard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";

interface BookingData {
  date: string;
  selectedTime?: string;
  adults: number;
  children: number;
  language: string;
}

function ConfirmationSuccessContent({ id, serviceId }: { id: string, serviceId: string }) {
  const { widgetData, loading, error, colorCode } = useWidget();
  const searchParams = useSearchParams();
  
  // Extract booking data from URL parameters
  const bookingData: BookingData = {
    date: searchParams.get('date') || '',
    selectedTime: searchParams.get('selectedTime') || undefined,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    language: searchParams.get('language') || 'Français',
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: fr });
  };

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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: colorCode }}>
            Confirmation de réservation
          </h1>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Merci pour votre réservation !
            </h2>
            <p className="text-lg text-muted-foreground">
              Un e-mail de confirmation vous a été envoyé.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">Récapitulatif de la demande</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: colorCode }} />
                <span>
                  {formatDate(bookingData?.date || new Date().toISOString())} - {bookingData?.selectedTime || "Aucun horaire"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Grape className="w-5 h-5" style={{ color: colorCode }} />
                <span>{widgetData?.service?.name || "Service de dégustation"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" style={{ color: colorCode }} />
                <span>{formatParticipants()}</span>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" style={{ color: colorCode }} />
                <span>{bookingData?.language || "Français"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Euro className="w-5 h-5" style={{ color: colorCode }} />
                <span>{totalPrice} €</span>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" style={{ color: colorCode }} />
                <span>Paiement sur place (cartes, chèques, espèces)</span>
              </div>
            </div>
          </div>

          {/* Bouton retour à l'accueil */}
          <div className="flex justify-center mt-8">
            <Link href={`/if/booking-widget/${id}/${serviceId}/reservation`}>
              <Button 
                className="hover:opacity-90 text-white px-8 py-3 flex items-center gap-2"
                style={{ backgroundColor: colorCode }}
                size="lg"
              >
                <Home className="w-5 h-5" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const ConfirmationSuccess = ({ params }: { params: Promise<{ id: string, service_id: string }> }) => {
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
      <ConfirmationSuccessContent id={id} serviceId={service_id} />
    </WidgetProvider>
  );
};

export default ConfirmationSuccess;