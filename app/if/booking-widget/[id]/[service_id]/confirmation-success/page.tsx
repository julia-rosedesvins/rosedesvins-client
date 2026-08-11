'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, Grape, Users, Globe, Euro, CreditCard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";
import { useIsTranslatedToEnglish } from "@/app/if/google-translate/AutoGoogleTranslate";
import { useTranslatedText } from "@/app/if/google-translate/useTranslatedText";

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
  const withLayout = searchParams.get('withLayout');
  const cancellationPolicy = searchParams.get('cancellationPolicy') || '';
  const isEnglish = useIsTranslatedToEnglish();
  const serviceName = useTranslatedText(widgetData?.service?.name);
  
  // Get payment methods from widget data
  const acceptedPaymentMethods = widgetData?.paymentMethods?.methods || ['cash_on_onsite'];
  const stripeAvailable = acceptedPaymentMethods.includes('stripe') && widgetData?.paymentMethods?.stripeConnect?.chargesEnabled === true;
  
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

  const totalParticipants = (bookingData?.adults ?? 2) + (bookingData?.children ?? 0);
  // Calculate total price based on actual service price
  const pricePerPerson = widgetData?.service?.pricePerPerson ?? 0;
  const totalPrice = (bookingData?.adults ?? 2) * pricePerPerson;

  const formatParticipants = () => {
    const adults = bookingData?.adults ?? 2;
    const children = bookingData?.children ?? 0;
    
    if (children > 0) {
      return isEnglish
        ? `${totalParticipants} people (${adults} adults, ${children} children)`
        : `${totalParticipants} personnes (${adults} adultes, ${children} enfants)`;
    }
    return isEnglish ? `${adults} people (adults)` : `${adults} personnes (adultes)`;
  };

  const getPaymentMethodLabel = (method: string) => {
    if (isEnglish) {
      switch (method.toLowerCase()) {
        case 'bank card':
        case 'bank_card':
          return 'Bank card';
        case 'checks':
        case 'cheque':
          return 'Checks';
        case 'cash':
        case 'cash_on_onsite':
          return 'Cash';
        case 'stripe':
          return 'Bank card (Stripe)';
        default:
          return method;
      }
    }
    switch (method.toLowerCase()) {
      case 'bank card':
      case 'bank_card':
        return 'Carte bancaire';
      case 'checks':
      case 'cheque':
        return 'Chèques';
      case 'cash':
        return 'Espèces';
      case 'cash_on_onsite':
        return 'Espèces';
      case 'stripe':
        return 'Carte bancaire (Stripe)';
      default:
        return method;
    }
  };

  const formatPaymentMethods = () => {
    // Exclude stripe — it's an online method, not on-site
    const onSiteMethods = acceptedPaymentMethods.filter((m: string) => m.toLowerCase() !== 'stripe');

    if (onSiteMethods.length === 0) {
      return isEnglish ? 'Pay on-site' : 'Paiement sur place';
    }
    
    const labels = onSiteMethods.map((method: string) => getPaymentMethodLabel(method));
    const prefix = isEnglish ? 'Pay on-site' : 'Paiement sur place';
    const conjunction = isEnglish ? 'or' : 'ou';
    
    if (labels.length === 1) {
      return `${prefix} (${labels[0].toLowerCase()})`;
    } else if (labels.length === 2) {
      return `${prefix} (${labels.join(', ').toLowerCase()})`;
    } else {
      const lastLabel = labels.pop();
      return `${prefix} (${labels.join(', ').toLowerCase()} ${conjunction} ${lastLabel?.toLowerCase()})`;
    }
  };

  const getLanguageInFrench = (language: string) => {
    const lang = language.toLowerCase();
    if (isEnglish) {
      if (lang === 'français' || lang === 'french') return 'French';
      if (lang === 'anglais' || lang === 'english') return 'English';
      if (lang === 'español' || lang === 'spanish') return 'Spanish';
      if (lang === 'deutsch' || lang === 'german') return 'German';
      if (lang === 'italien' || lang === 'italian') return 'Italian';
      if (lang === 'russe' || lang === 'russian') return 'Russian';
      return language;
    }
    if (lang === 'français' || lang === 'french') return 'Français';
    if (lang === 'anglais' || lang === 'english') return 'Anglais';
    if (lang === 'español' || lang === 'spanish') return 'Espagnol';
    if (lang === 'deutsch' || lang === 'german') return 'Allemand';
    if (lang === 'italien' || lang === 'italian') return 'Italien';
    if (lang === 'russe' || lang === 'russian') return 'Russe';
    return language; // Return original if no match
  };

  const getCancellationPolicyLabel = (policy: string) => {
    if (isEnglish) {
      switch (policy) {
        case 'none': return 'No refund possible';
        case '24h': return "Full refund possible if cancelled 24h before";
        case '48h': return "Full refund possible if cancelled 48h before";
        case '72h': return "Full refund possible if cancelled 72h before";
        case '1_week': return "Full refund possible if cancelled one week before";
        default: return '';
      }
    }
    switch (policy) {
      case 'none': return 'Aucun remboursement possible';
      case '24h': return "Remboursement intégral possible en cas d'annulation 24h avant";
      case '48h': return "Remboursement intégral possible en cas d'annulation 48h avant";
      case '72h': return "Remboursement intégral possible en cas d'annulation 72h avant";
      case '1_week': return "Remboursement intégral possible en cas d'annulation une semaine avant";
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: colorCode }}>
            {isEnglish ? "Booking confirmation" : "Confirmation de réservation"}
          </h1>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {isEnglish ? "Thank you for your booking!" : "Merci pour votre réservation !"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isEnglish ? "A confirmation email has been sent to you." : "Un e-mail de confirmation vous a été envoyé."}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6">{isEnglish ? "Request summary" : "Récapitulatif de la demande"}</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: colorCode }} />
                <span>
                  {formatDate(bookingData?.date || new Date().toISOString())} - {bookingData?.selectedTime || (isEnglish ? "No time slot" : "Aucun horaire")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Grape className="w-5 h-5" style={{ color: colorCode }} />
                <span>{serviceName || (isEnglish ? "Tasting service" : "Service de dégustation")}</span>
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
                <span>{stripeAvailable ? (isEnglish ? 'Online payment' : 'Paiement en ligne') : formatPaymentMethods()}</span>
              </div>

              {stripeAvailable && cancellationPolicy && getCancellationPolicyLabel(cancellationPolicy) && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 opacity-0" />
                  <span className="text-sm text-gray-500 italic">{getCancellationPolicyLabel(cancellationPolicy)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bouton retour à l'accueil */}
          <div className="flex justify-center mt-8">
            <Link href={`/if/booking-widget/${id}/${serviceId}/reservation${withLayout ? '?withLayout=true' : ''}`}>
              <Button 
                className="hover:opacity-90 text-white px-8 py-3 flex items-center gap-2"
                style={{ backgroundColor: colorCode }}
                size="lg"
              >
                <Home className="w-5 h-5" />
                {isEnglish ? "Back" : "Retour"}
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