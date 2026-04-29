'use client';

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock, Users, Globe, Euro, CreditCard, Grape, Lock,
  Building2, Receipt, Loader2, CheckSquare, Square, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe as useStripeHook,
  useElements,
} from "@stripe/react-stripe-js";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";
import { bookingService } from "@/services/booking.service";
import { createPaymentIntent } from "@/services/stripe-checkout.service";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
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

interface StripeCardFormProps {
  colorCode: string;
  totalPrice: number;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  onSuccess: (bookingId: string) => void;
  getClientSecret: () => Promise<{ clientSecret: string; bookingId: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stripe card form — must live inside <Elements>
// ─────────────────────────────────────────────────────────────────────────────
function StripeCardForm({
  colorCode,
  totalPrice,
  isProcessing,
  setIsProcessing,
  onSuccess,
  getClientSecret,
}: StripeCardFormProps) {
  const stripe = useStripeHook();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements || isProcessing) return;
    if (!cardholderName.trim()) {
      setCardError("Veuillez entrer le nom du titulaire de la carte.");
      return;
    }
    setCardError(null);
    setIsProcessing(true);

    try {
      const { clientSecret, bookingId } = await getClientSecret();
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardholderName.trim() },
        },
      });

      if (error) {
        setCardError(error.message || "Le paiement a échoué. Veuillez réessayer.");
        setIsProcessing(false);
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Paiement réussi !");
        onSuccess(bookingId);
      }
    } catch (err: any) {
      setCardError(err.message || "Erreur lors du paiement. Veuillez réessayer.");
      setIsProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#374151",
        fontFamily: '"Inter", system-ui, sans-serif',
        "::placeholder": { color: "#9CA3AF" },
      },
      invalid: { color: "#EF4444" },
    },
  };

  return (
    <div
      className="mt-3 p-4 border-2 rounded-xl space-y-4 bg-gray-50 transition-all"
      style={{ borderColor: colorCode }}
    >
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4" style={{ color: colorCode }} />
        <span className="text-sm font-semibold" style={{ color: colorCode }}>
          Paiement par carte
        </span>
      </div>

      {/* Cardholder name */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Nom du titulaire
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Jean Dupont"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-60"
          disabled={isProcessing}
          autoComplete="cc-name"
        />
      </div>

      {/* Card number */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Numéro de carte
        </label>
        <div className="px-3 py-3 border border-gray-300 rounded-lg bg-white">
          <CardNumberElement options={elementOptions} />
        </div>
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Date d&apos;expiration
          </label>
          <div className="px-3 py-3 border border-gray-300 rounded-lg bg-white">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            CVV / CVC
          </label>
          <div className="px-3 py-3 border border-gray-300 rounded-lg bg-white">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      {/* Card error */}
      {cardError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{cardError}</p>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <span>Paiement sécurisé — données chiffrées par Stripe</span>
      </div>

      {/* Pay button */}
      <Button
        type="button"
        onClick={handlePay}
        disabled={isProcessing || !stripe}
        className="w-full text-white"
        style={{ backgroundColor: colorCode }}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Traitement du paiement...
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <Lock className="w-4 h-4" />
            Payer {totalPrice} €
          </div>
        )}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main checkout content
// ─────────────────────────────────────────────────────────────────────────────
function CheckoutContent({ id, serviceId }: { id: string; serviceId: string }) {
  const { widgetData, loading, error, colorCode } = useWidget();
  const searchParams = useSearchParams();
  const router = useRouter();
  const withLayout = searchParams.get("withLayout");

  const bookingData: BookingData = {
    date: searchParams.get("date") || "",
    selectedTime: searchParams.get("selectedTime") || undefined,
    adults: parseInt(searchParams.get("adults") || "2"),
    children: parseInt(searchParams.get("children") || "0"),
    language: searchParams.get("language") || "Français",
    email: searchParams.get("email") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    phone: searchParams.get("phone") || "",
    additionalInfo: searchParams.get("additionalInfo") || "",
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [useStripe, setUseStripe] = useState(false);

  const acceptedPaymentMethods = widgetData?.paymentMethods?.methods || ["cash_on_onsite"];
  const stripeConnect = widgetData?.paymentMethods?.stripeConnect;
  const stripeAvailable =
    acceptedPaymentMethods.includes("stripe") && stripeConnect?.chargesEnabled === true;
  const onsiteMethods = acceptedPaymentMethods.filter((m) => m !== "stripe");

  const pricePerPerson = widgetData?.service?.pricePerPerson ?? 0;
  const totalPrice = (bookingData?.adults ?? 0) * pricePerPerson;

  // Load Stripe scoped to the vendor's connected account
  const stripePromise = useMemo(() => {
    const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pubKey || !stripeConnect?.stripeAccountId || !stripeAvailable) return null;
    return loadStripe(pubKey, { stripeAccount: stripeConnect.stripeAccountId });
  }, [stripeConnect?.stripeAccountId, stripeAvailable]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
            style={{ borderColor: colorCode }}
          />
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

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd/MM/yyyy", { locale: fr });

  const displayTime = bookingData?.selectedTime || "Aucun horaire sélectionné";
  const totalParticipants = (bookingData?.adults ?? 0) + (bookingData?.children ?? 0);

  const formatParticipants = () => {
    const adults = bookingData?.adults ?? 0;
    const children = bookingData?.children ?? 0;
    if (children > 0)
      return `${totalParticipants} personnes (${adults} adultes, ${children} enfants)`;
    return `${adults} personnes (adultes)`;
  };

  const getLanguageInFrench = (language: string) => {
    const lang = language.toLowerCase();
    if (lang === "français" || lang === "french") return "Français";
    if (lang === "anglais" || lang === "english") return "Anglais";
    if (lang === "español" || lang === "spanish") return "Espagnol";
    if (lang === "deutsch" || lang === "german") return "Allemand";
    if (lang === "italien" || lang === "italian") return "Italien";
    if (lang === "russe" || lang === "russian") return "Russe";
    return language;
  };

  // Called by StripeCardForm — creates booking then PaymentIntent, returns clientSecret
  const getStripeClientSecret = async (): Promise<{
    clientSecret: string;
    bookingId: string;
  }> => {
    const bookingPayload = {
      userId: id,
      serviceId,
      bookingDate: bookingData.date.split("T")[0],
      bookingTime: bookingData.selectedTime || "10:00",
      participantsAdults: bookingData.adults,
      participantsEnfants: bookingData.children,
      selectedLanguage: bookingData.language,
      userContactFirstname: bookingData.firstName || "",
      userContactLastname: bookingData.lastName || "",
      customerEmail: bookingData.email || "",
      phoneNo: bookingData.phone || "",
      additionalNotes: bookingData.additionalInfo || "",
      paymentMethod: { method: "stripe" as const },
    };

    const bookingResult = await bookingService.createBooking(bookingPayload);
    const bookingId = bookingResult.data?._id || (bookingResult as any)._id;
    if (!bookingId) throw new Error("Impossible de créer la réservation.");

    const pi = await createPaymentIntent({
      bookingId,
      vendorUserId: id,
      amountEur: totalPrice,
      customerEmail: bookingData.email || undefined,
      serviceName: widgetData?.service?.name || "Réservation",
      participantsAdults: bookingData.adults,
      participantsEnfants: bookingData.children,
    });

    return { clientSecret: pi.clientSecret, bookingId };
  };

  const handleStripeSuccess = (bookingId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("bookingId", bookingId);
    if (withLayout) params.set("withLayout", withLayout);
    router.push(
      `/if/booking-widget/${id}/${serviceId}/confirmation-success?${params.toString()}`,
    );
  };

  // On-site / cash payment
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const bookingPayload = {
        userId: id,
        serviceId,
        bookingDate: bookingData.date.split("T")[0],
        bookingTime: bookingData.selectedTime || "10:00",
        participantsAdults: bookingData.adults,
        participantsEnfants: bookingData.children,
        selectedLanguage: bookingData.language,
        userContactFirstname: bookingData.firstName || "",
        userContactLastname: bookingData.lastName || "",
        customerEmail: bookingData.email || "",
        phoneNo: bookingData.phone || "",
        additionalNotes: bookingData.additionalInfo || "",
        paymentMethod: { method: "cash_on_onsite" as const },
      };

      const result = await bookingService.createBooking(bookingPayload);

      if (result.success || result.data || (result as any)._id) {
        toast.success("Réservation créée avec succès !");
        const bookingId = result.data?._id || (result as any)._id || "unknown";
        const params = new URLSearchParams(searchParams);
        params.set("bookingId", bookingId);
        if (withLayout) params.set("withLayout", withLayout);
        router.push(
          `/if/booking-widget/${id}/${serviceId}/confirmation-success?${params.toString()}`,
        );
      } else {
        toast.error(result.message || "Erreur lors de la création de la réservation");
      }
    } catch (error: any) {
      if (error.response?.status === 201 && error.response?.data) {
        toast.success("Réservation créée avec succès !");
        const bookingId =
          error.response.data._id || error.response.data.data?._id || "unknown";
        const params = new URLSearchParams(searchParams);
        params.set("bookingId", bookingId);
        if (withLayout) params.set("withLayout", withLayout);
        router.push(
          `/if/booking-widget/${id}/${serviceId}/confirmation-success?${params.toString()}`,
        );
        return;
      }
      toast.error(
        error.message ||
          error.response?.data?.message ||
          "Erreur lors de la création de la réservation",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethodIcon = (method: string) => {
    const cls = "w-5 h-5 text-gray-600";
    switch (method.toLowerCase()) {
      case "bank card":
      case "bank_card":
        return <Building2 className={cls} />;
      case "checks":
      case "cheque":
        return <Receipt className={cls} />;
      case "cash":
      case "cash_on_onsite":
        return <Euro className={cls} />;
      default:
        return <CreditCard className={cls} />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank card":
      case "bank_card":
        return "Carte bancaire";
      case "checks":
      case "cheque":
        return "Chèques";
      case "cash":
      case "cash_on_onsite":
        return "Espèces";
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
            {/* ── Payment section ───────────────────────────────────────── */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" style={{ color: colorCode }} />
                Informations de paiement
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Modes de paiement acceptés
                  </label>

                  {loading ? (
                    <div className="flex items-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: colorCode }} />
                      <span className="ml-2 text-sm text-gray-600">Chargement...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* On-site methods — informational */}
                      {onsiteMethods.map((method) => (
                        <div
                          key={method}
                          className="flex items-center space-x-2 p-3 border rounded-lg bg-white border-gray-200"
                        >
                          <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            {renderPaymentMethodIcon(method)}
                            <span className="text-gray-800">{getPaymentMethodLabel(method)}</span>
                          </div>
                        </div>
                      ))}

                      {/* Stripe — toggleable checkbox row + inline card form */}
                      {stripeAvailable && (
                        <>
                          <div
                            onClick={() => !isProcessing && setUseStripe((p) => !p)}
                            className={cn(
                              "flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors select-none",
                              useStripe
                                ? "border-2 bg-green-50"
                                : "border-gray-200 bg-white hover:bg-gray-50",
                              isProcessing && "opacity-60 cursor-not-allowed",
                            )}
                            style={useStripe ? { borderColor: colorCode } : {}}
                          >
                            {useStripe ? (
                              <CheckSquare className="w-5 h-5 shrink-0" style={{ color: colorCode }} />
                            ) : (
                              <Square className="w-5 h-5 shrink-0 text-gray-400" />
                            )}
                            <div className="flex items-center gap-2 flex-1">
                              <CreditCard className="w-5 h-5 text-gray-600" />
                              <div>
                                <span className="text-gray-800 font-medium">
                                  Carte bancaire (en ligne)
                                </span>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Paiement sécurisé via Stripe
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Inline card form — slides in when Stripe is selected */}
                          {useStripe && stripePromise && (
                            <Elements stripe={stripePromise}>
                              <StripeCardForm
                                colorCode={colorCode}
                                totalPrice={totalPrice}
                                isProcessing={isProcessing}
                                setIsProcessing={setIsProcessing}
                                onSuccess={handleStripeSuccess}
                                getClientSecret={getStripeClientSecret}
                              />
                            </Elements>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* On-site hint — only when Stripe card form is hidden */}
                  {!loading && !useStripe && onsiteMethods.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note :</strong> Vous pourrez régler sur place selon le mode
                        de paiement accepté.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Vos informations sont sécurisées</span>
                </div>
              </div>
            </div>

            {/* ── Order summary ─────────────────────────────────────────── */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Récapitulatif de votre réservation</h2>

              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">
                    {formatDate(bookingData?.date || new Date().toISOString())} - {displayTime}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Grape className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">
                    {widgetData?.service?.name || "Visite libre & dégustation"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">{formatParticipants()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">
                    {getLanguageInFrench(bookingData?.language || "Français")}
                  </span>
                </div>

                <hr />

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

          {/* ── Action buttons ────────────────────────────────────────────── */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isProcessing}
            >
              Retour
            </Button>

            {/* Confirm button — hidden while Stripe card form is active (has its own pay button) */}
            {!useStripe && (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={cn(
                  "text-white px-8 py-2",
                  isProcessing && "opacity-70 cursor-not-allowed",
                )}
                style={{ backgroundColor: colorCode }}
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Traitement...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4" />
                    Confirmer la réservation
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page wrapper
// ─────────────────────────────────────────────────────────────────────────────
const Checkout = ({
  params,
}: {
  params: Promise<{ id: string; service_id: string }>;
}) => {
  const [resolvedParams, setResolvedParams] = useState<{
    id: string;
    service_id: string;
  } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7E53] mx-auto mb-4" />
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
