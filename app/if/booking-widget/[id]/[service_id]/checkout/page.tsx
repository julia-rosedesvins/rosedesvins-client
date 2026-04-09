'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, Globe, Euro, CreditCard, Grape, Lock, Building2, Receipt, Loader2, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";
import { bookingService } from "@/services/booking.service";
import { createCheckoutSession } from "@/services/stripe-checkout.service";

interface BookingData {
  date: string;
  selectedTime?: string;
  adults: number;
  children: number;
  language: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  additionalInfo?: string;
}

function CheckoutContent({ id, serviceId }: { id: string, serviceId: string }) {
  const { widgetData, loading, error, colorCode } = useWidget();
  const searchParams = useSearchParams();
  const router = useRouter();
  const withLayout = searchParams.get('withLayout');
  
  // Extract booking data from URL parameters
  const bookingData: BookingData = {
    date: searchParams.get('date') || '',
    selectedTime: searchParams.get('selectedTime') || undefined,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    language: searchParams.get('language') || 'Français',
    email: searchParams.get('email') || '',
    firstName: searchParams.get('firstName') || '',
    lastName: searchParams.get('lastName') || '',
    phone: searchParams.get('phone') || '',
    additionalInfo: searchParams.get('additionalInfo') || '',
  };
  
  const [isProcessing, setIsProcessing] = useState(false);
  // Stripe checkbox state — unchecked by default even when Stripe is available
  const [useStripe, setUseStripe] = useState(false);

  // Get payment methods from widget data
  const acceptedPaymentMethods = widgetData?.paymentMethods?.methods || ['cash_on_onsite'];
  const stripeConnect = widgetData?.paymentMethods?.stripeConnect;
  // Whether Stripe is an option at all (vendor connected + charges enabled)
  const stripeAvailable =
    acceptedPaymentMethods.includes('stripe') && stripeConnect?.chargesEnabled === true;
  // On-site methods shown as informational (excludes stripe)
  const onsiteMethods = acceptedPaymentMethods.filter((m) => m !== 'stripe');
  const loadingPaymentMethods = loading;

  const pricePerPerson = widgetData?.service?.pricePerPerson ?? 0;
  const totalPrice = (bookingData?.adults ?? 0) * pricePerPerson;

  // ── Handle Stripe return URL params ──────────────────────────────────────
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const paymentCancelled = searchParams.get('payment_cancelled');
    const sessionId = searchParams.get('session_id');
    const pendingBookingId = searchParams.get('pending_booking_id');

    if (paymentSuccess === 'true' && pendingBookingId) {
      // Payment completed — navigate straight to confirmation-success
      const params = new URLSearchParams(searchParams);
      params.set('bookingId', pendingBookingId);
      params.delete('payment_success');
      params.delete('session_id');
      params.delete('pending_booking_id');
      if (withLayout) params.set('withLayout', withLayout);
      router.replace(
        `/if/booking-widget/${id}/${serviceId}/confirmation-success?${params.toString()}`,
      );
    } else if (paymentCancelled === 'true') {
      toast.error("Paiement annulé. Vous pouvez réessayer.");
      // Strip the cancelled flag from the URL cleanly
      const params = new URLSearchParams(searchParams);
      params.delete('payment_cancelled');
      router.replace(`/if/booking-widget/${id}/${serviceId}/checkout?${params.toString()}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const totalParticipants = (bookingData?.adults ?? 0) + (bookingData?.children ?? 0);

  const formatParticipants = () => {
    const adults = bookingData?.adults ?? 0;
    const children = bookingData?.children ?? 0;
    if (children > 0) {
      return `${totalParticipants} personnes (${adults} adultes, ${children} enfants)`;
    }
    return `${adults} personnes (adultes)`;
  };

  const getLanguageInFrench = (language: string) => {
    const lang = language.toLowerCase();
    if (lang === 'français' || lang === 'french') return 'Français';
    if (lang === 'anglais' || lang === 'english') return 'Anglais';
    if (lang === 'español' || lang === 'spanish') return 'Espagnol';
    if (lang === 'deutsch' || lang === 'german') return 'Allemand';
    return language;
  };

  // ── Stripe payment ────────────────────────────────────────────────────────
  const handleStripePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Create the booking first (status: payment_pending on server after session)
      const bookingPayload = {
        userId: id,
        serviceId: serviceId,
        bookingDate: bookingData.date.split('T')[0],
        bookingTime: bookingData.selectedTime || '10:00',
        participantsAdults: bookingData.adults,
        participantsEnfants: bookingData.children,
        selectedLanguage: bookingData.language,
        userContactFirstname: bookingData.firstName || '',
        userContactLastname: bookingData.lastName || '',
        customerEmail: bookingData.email || '',
        phoneNo: bookingData.phone || '',
        additionalNotes: bookingData.additionalInfo || '',
        paymentMethod: { method: 'stripe' as const },
      };

      const bookingResult = await bookingService.createBooking(bookingPayload);
      const bookingId =
        bookingResult.data?._id || (bookingResult as any)._id;

      if (!bookingId) {
        throw new Error("Impossible de créer la réservation.");
      }

      // 2. Build return URLs — pass pending_booking_id so we can redirect on success
      const currentUrl = `${window.location.origin}/if/booking-widget/${id}/${serviceId}/checkout?${new URLSearchParams(searchParams).toString()}`;
      const successUrl = `${currentUrl}&pending_booking_id=${bookingId}`;
      const cancelUrl = currentUrl;

      // 3. Create the Stripe Checkout Session
      const session = await createCheckoutSession({
        bookingId,
        vendorUserId: id,
        amountEur: totalPrice,
        successUrl,
        cancelUrl,
        customerEmail: bookingData.email || undefined,
        serviceName: widgetData?.service?.name || 'Réservation',
        participantsAdults: bookingData.adults,
        participantsEnfants: bookingData.children,
      });

      // 4. Redirect to Stripe Checkout
      window.location.href = session.sessionUrl;
    } catch (err: any) {
      console.error('Stripe payment error:', err);
      toast.error(err.message || "Erreur lors de la création du paiement Stripe.");
      setIsProcessing(false);
    }
    // Note: don't call setIsProcessing(false) on success — page redirects away
  };

  // ── Cash / on-site payment ────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const bookingPayload = {
        userId: id,
        serviceId: serviceId,
        bookingDate: bookingData.date.split('T')[0],
        bookingTime: bookingData.selectedTime || '10:00',
        participantsAdults: bookingData.adults,
        participantsEnfants: bookingData.children,
        selectedLanguage: bookingData.language,
        userContactFirstname: bookingData.firstName || '',
        userContactLastname: bookingData.lastName || '',
        customerEmail: bookingData.email || '',
        phoneNo: bookingData.phone || '',
        additionalNotes: bookingData.additionalInfo || '',
        paymentMethod: { method: 'cash_on_onsite' as const },
      };

      const result = await bookingService.createBooking(bookingPayload);

      if (result.success || result.data || (result as any)._id) {
        toast.success("Réservation créée avec succès !");
        const bookingId = result.data?._id || (result as any)._id || 'unknown';
        const params = new URLSearchParams(searchParams);
        params.set('bookingId', bookingId);
        if (withLayout) params.set('withLayout', withLayout);
        router.push(`/if/booking-widget/${id}/${serviceId}/confirmation-success?${params.toString()}`);
      } else {
        toast.error(result.message || "Erreur lors de la création de la réservation");
      }
    } catch (error: any) {
      if (error.response?.status === 201 && error.response?.data) {
        toast.success("Réservation créée avec succès !");
        const bookingId = error.response.data._id || error.response.data.data?._id || 'unknown';
        const params = new URLSearchParams(searchParams);
        params.set('bookingId', bookingId);
        if (withLayout) params.set('withLayout', withLayout);
        router.push(`/if/booking-widget/${id}/${serviceId}/confirmation-success?${params.toString()}`);
        return;
      }
      toast.error(error.message || error.response?.data?.message || "Erreur lors de la création de la réservation");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethodIcon = (method: string) => {
    const iconClass = "w-5 h-5 text-gray-600";
    switch (method.toLowerCase()) {
      case 'bank card':
      case 'bank_card':
        return <Building2 className={iconClass} />;
      case 'checks':
      case 'cheque':
        return <Receipt className={iconClass} />;
      case 'cash':
      case 'cash_on_onsite':
        return <Euro className={iconClass} />;
      case 'stripe':
        return <CreditCard className={iconClass} />;
      default:
        return <CreditCard className={iconClass} />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank card':
      case 'bank_card':
        return 'Carte bancaire';
      case 'checks':
      case 'cheque':
        return 'Chèques';
      case 'cash':
      case 'cash_on_onsite':
        return 'Espèces';
      case 'stripe':
        return 'Carte bancaire (en ligne)';
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: colorCode }}>
            Confirmation de votre réservation
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulaire de paiement */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" style={{ color: colorCode }} />
                Informations de paiement
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Methods Display */}
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Modes de paiement acceptés
                  </label>

                  {loadingPaymentMethods ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: colorCode }} />
                      <span className="ml-2 text-sm text-gray-600">Chargement des modes de paiement...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* On-site methods — informational, always shown as accepted */}
                      {onsiteMethods.map((method) => (
                        <div
                          key={method}
                          className="flex items-center space-x-2 p-3 border rounded-lg bg-white border-gray-200"
                        >
                          <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            {renderPaymentMethodIcon(method)}
                            <span className="text-gray-800">{getPaymentMethodLabel(method)}</span>
                          </div>
                        </div>
                      ))}

                      {/* Stripe — optional, selectable checkbox */}
                      {stripeAvailable && (
                        <div
                          onClick={() => setUseStripe((prev) => !prev)}
                          className={cn(
                            "flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors select-none",
                            useStripe
                              ? "border-2 bg-green-50"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          )}
                          style={useStripe ? { borderColor: colorCode } : {}}
                        >
                          {useStripe
                            ? <CheckSquare className="w-5 h-5 shrink-0" style={{ color: colorCode }} />
                            : <Square className="w-5 h-5 shrink-0 text-gray-400" />
                          }
                          <div className="flex items-center gap-2 flex-1">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                            <div>
                              <span className="text-gray-800 font-medium">Carte bancaire (en ligne)</span>
                              <p className="text-xs text-gray-500 mt-0.5">Paiement sécurisé via Stripe</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hint text */}
                  {!loadingPaymentMethods && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        {stripeAvailable && useStripe
                          ? <><strong>Paiement en ligne.</strong> Vous serez redirigé vers Stripe pour régler en toute sécurité.</>  
                          : <><strong>Note :</strong> Vous pourrez régler sur place selon le mode de paiement accepté.</>  
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <Lock className="w-4 h-4" />
                  <span>Vos informations sont sécurisées</span>
                </div>
              </form>
            </div>

            {/* Récapitulatif de la commande */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Récapitulatif de votre réservation</h2>

              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">{formatDate(bookingData?.date || new Date().toISOString())} - {displayTime}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Grape className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">{widgetData?.service?.name || 'Visite libre & dégustation'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">{formatParticipants()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">{getLanguageInFrench(bookingData?.language || "Français")}</span>
                </div>

                <hr className="my-4" />

                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-3">
                    <Euro className="w-5 h-5" style={{ color: colorCode }} />
                    <span>Total à payer</span>
                  </div>
                  <span className="text-lg">{totalPrice} €</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isProcessing}
            >
              Retour
            </Button>

            <div className="flex gap-3">
              {/* Stripe pay button — only when Stripe checkbox is checked */}
              {stripeAvailable && useStripe ? (
                <Button
                  type="button"
                  onClick={handleStripePayment}
                  disabled={isProcessing}
                  className={cn(
                    "text-white px-8 py-2",
                    isProcessing ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                  )}
                  style={{ backgroundColor: colorCode }}
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirection...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Payer par carte (en ligne)</span>
                    </div>
                  )}
                </Button>
              ) : (
                /* Normal on-site confirm — shown when Stripe is not selected */
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className={cn(
                    "text-white px-8 py-2",
                    isProcessing ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                  )}
                  style={{ backgroundColor: colorCode }}
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span>Confirmer la réservation</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Checkout = ({ params }: { params: Promise<{ id: string, service_id: string }> }) => {
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
      <CheckoutContent id={id} serviceId={service_id} />
    </WidgetProvider>
  );
};

export default Checkout;


