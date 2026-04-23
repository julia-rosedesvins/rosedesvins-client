'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelector } from "@/components/CountrySelector";
import {
  Clock, Users, Globe, Euro, CreditCard, Grape, Lock,
  Loader2, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
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
import { createPaymentIntent, confirmPaymentOnServer } from "@/services/stripe-checkout.service";
// bookingService.cancelBookingAsGuest is used to roll back on card failure

// ─────────────────────────────────────────────────────────────────────────────
// Stripe card form — must live inside <Elements>
// ─────────────────────────────────────────────────────────────────────────────
interface StripeCardFormProps {
  colorCode: string;
  totalPrice: number;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  onSuccess: (bookingId: string) => void;
  getClientSecret: () => Promise<{ clientSecret: string; bookingId: string }>;
}

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
  // Track the bookingId so we can cancel it if payment fails
  const pendingBookingIdRef = React.useRef<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements || isProcessing) return;
    if (!cardholderName.trim()) {
      setCardError("Veuillez entrer le nom du titulaire de la carte.");
      return;
    }
    setCardError(null);
    setIsProcessing(true);
    pendingBookingIdRef.current = null;

    try {
      const { clientSecret, bookingId } = await getClientSecret();
      // Store so we can roll back on failure
      pendingBookingIdRef.current = bookingId;

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardholderName.trim() },
        },
      });

      if (error) {
        // Roll back the booking that was created before the payment attempt
        if (pendingBookingIdRef.current) {
          bookingService.cancelBookingAsGuest(pendingBookingIdRef.current).catch(() => {});
          pendingBookingIdRef.current = null;
        }
        setCardError(error.message || "Le paiement a échoué. Veuillez réessayer.");
        setIsProcessing(false);
      } else if (paymentIntent?.status === "succeeded") {
        // Notify server: verify PI, mark booking confirmed, send emails
        await confirmPaymentOnServer(paymentIntent.id).catch(() => {});
        toast.success("Paiement réussi !");
        onSuccess(bookingId);
      }
    } catch (err: any) {
      // Roll back if booking was created but payment threw an exception
      if (pendingBookingIdRef.current) {
        bookingService.cancelBookingAsGuest(pendingBookingIdRef.current).catch(() => {});
        pendingBookingIdRef.current = null;
      }
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
      className="mt-4 p-4 border-2 rounded-xl space-y-4 bg-gray-50"
      style={{ borderColor: colorCode }}
    >
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4" style={{ color: colorCode }} />
        <span className="text-sm font-semibold" style={{ color: colorCode }}>
          Paiement par carte (en ligne)
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none disabled:opacity-60"
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
          <label className="block text-xs font-medium text-gray-600 mb-1">CVV / CVC</label>
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
// Main page content
// ─────────────────────────────────────────────────────────────────────────────
function BookingConfirmationContent({ id, serviceId }: { id: string; serviceId: string }) {
  const { widgetData, loading, error, colorCode } = useWidget();
  const searchParams = useSearchParams();
  const router = useRouter();
  const withLayout = searchParams.get("withLayout") === "true";

  const bookingData = {
    date: searchParams.get("date") || "",
    selectedTime: searchParams.get("selectedTime") || undefined,
    adults: parseInt(searchParams.get("adults") || "2"),
    children: parseInt(searchParams.get("children") || "0"),
    language: searchParams.get("language") || "Français",
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
    dialCode: "+33",
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Stripe availability ────────────────────────────────────────────────────
  const acceptedPaymentMethods = widgetData?.paymentMethods?.methods || ["cash_on_onsite"];
  const stripeConnect = widgetData?.paymentMethods?.stripeConnect;
  const stripeAvailable =
    acceptedPaymentMethods.includes("stripe") && stripeConnect?.chargesEnabled === true;

  const pricePerPerson = widgetData?.service?.pricePerPerson ?? 0;
  const totalPrice = (bookingData?.adults ?? 0) * pricePerPerson;
  const cancellationPolicy: string = widgetData?.paymentMethods?.cancellationPolicy ?? '';

  const stripePromise = useMemo(() => {
    const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pubKey || !stripeConnect?.stripeAccountId || !stripeAvailable) return null;
    return loadStripe(pubKey, { stripeAccount: stripeConnect.stripeAccountId });
  }, [stripeConnect?.stripeAccountId, stripeAvailable]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPhone = (v: string) => /^[+]?[\d\s\-()]{8,}$/.test(v.trim());

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!email.trim()) errors.push("L'adresse e-mail est requise");
    else if (!isValidEmail(email)) errors.push("Veuillez saisir une adresse e-mail valide");
    if (!firstName.trim()) errors.push("Le prénom est requis");
    if (!lastName.trim()) errors.push("Le nom est requis");
    if (!phone.trim()) errors.push("Le numéro de téléphone est requis");
    else if (!isValidPhone(phone)) errors.push("Veuillez saisir un numéro de téléphone valide");
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // ── Build booking payload helper ───────────────────────────────────────────
  const buildPayload = (method: "cash_on_onsite" | "stripe") => ({
    userId: id,
    serviceId,
    bookingDate: bookingData.date.split("T")[0],
    bookingTime: bookingData.selectedTime || "10:00",
    participantsAdults: bookingData.adults,
    participantsEnfants: bookingData.children,
    selectedLanguage: bookingData.language,
    userContactFirstname: firstName,
    userContactLastname: lastName,
    customerEmail: email,
    phoneNo: phone,
    additionalNotes: additionalInfo,
    paymentMethod: { method },
  });

  const navigateToSuccess = (bookingId: string) => {
    const params = new URLSearchParams({
      date: bookingData.date,
      selectedTime: bookingData.selectedTime || "",
      adults: bookingData.adults.toString(),
      children: bookingData.children.toString(),
      language: bookingData.language,
      email,
      firstName,
      lastName,
      phone,
      bookingId,
    });
    if (cancellationPolicy) params.set("cancellationPolicy", cancellationPolicy);
    if (withLayout) params.set("withLayout", "true");
    router.push(`/if/booking-widget/${id}/${serviceId}/confirmation-success?${params.toString()}`);
  };

  // ── Stripe: called by StripeCardForm ──────────────────────────────────────
  const getStripeClientSecret = async (): Promise<{
    clientSecret: string;
    bookingId: string;
  }> => {
    const result = await bookingService.createBooking(buildPayload("stripe"));
    const bookingId = result.data?._id || (result as any)._id;
    if (!bookingId) throw new Error("Impossible de créer la réservation.");

    const pi = await createPaymentIntent({
      bookingId,
      vendorUserId: id,
      amountEur: totalPrice,
      customerEmail: email || undefined,
      serviceName: widgetData?.service?.name || "Réservation",
      participantsAdults: bookingData.adults,
      participantsEnfants: bookingData.children,
    });

    return { clientSecret: pi.clientSecret, bookingId };
  };

  // ── On-site / cash confirmation ────────────────────────────────────────────
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await bookingService.createBooking(buildPayload("cash_on_onsite"));
      const bookingId = result.data?._id || (result as any)._id || "unknown";
      toast.success("Réservation créée avec succès !");
      navigateToSuccess(bookingId);
    } catch (err: any) {
      if (err.response?.status === 201 && err.response?.data) {
        const bookingId =
          err.response.data._id || err.response.data.data?._id || "unknown";
        toast.success("Réservation créée avec succès !");
        navigateToSuccess(bookingId);
        return;
      }
      toast.error(
        err.message || err.response?.data?.message || "Erreur lors de la création de la réservation",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Stripe card form submit (validate contact first) ──────────────────────
  const validateAndGetSecret = async (): Promise<{
    clientSecret: string;
    bookingId: string;
  }> => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      throw new Error("Veuillez corriger les erreurs du formulaire.");
    }
    return getStripeClientSecret();
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatDate = (d: string) => format(new Date(d), "dd/MM/yyyy", { locale: fr });
  const displayTime = bookingData?.selectedTime || "Aucun horaire sélectionné";
  const totalParticipants = (bookingData?.adults ?? 2) + (bookingData?.children ?? 0);

  const formatParticipants = () => {
    const a = bookingData?.adults ?? 2;
    const c = bookingData?.children ?? 0;
    if (c > 0) return `${totalParticipants} personnes (${a} adultes, ${c} enfants)`;
    return `${a} personnes (adultes)`;
  };

  const getLanguageInFrench = (language: string) => {
    const l = language.toLowerCase();
    if (l === "français" || l === "french") return "Français";
    if (l === "anglais" || l === "english") return "Anglais";
    if (l === "español" || l === "spanish") return "Espagnol";
    if (l === "deutsch" || l === "german") return "Allemand";
    return language;
  };

  const getCancellationPolicyLabel = (policy: string) => {
    switch (policy) {
      case 'none': return 'Aucun remboursement possible';
      case '24h': return "Remboursement intégral possible en cas d'annulation 24h avant";
      case '48h': return "Remboursement intégral possible en cas d'annulation 48h avant";
      case '72h': return "Remboursement intégral possible en cas d'annulation 72h avant";
      case '1_week': return "Remboursement intégral possible en cas d'annulation une semaine avant";
      default: return '';
    }
  };

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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: colorCode }}>
            Demande de réservation
          </h1>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium mb-2">
                Veuillez corriger les erreurs suivantes :
              </h3>
              <ul className="text-red-700 space-y-1">
                {validationErrors.map((e, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* ── Contact information ───────────────────────────────────── */}
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
                  <CountrySelector value={selectedCountry} onSelect={setSelectedCountry} />
                  <Input
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1"
                  />
                </div>

                {/* ── Stripe card form (only when Stripe is available) ─────── */}
                {stripeAvailable && stripePromise && (
                  <Elements stripe={stripePromise}>
                    <StripeCardForm
                      colorCode={colorCode}
                      totalPrice={totalPrice}
                      isProcessing={isSubmitting}
                      setIsProcessing={setIsSubmitting}
                      onSuccess={navigateToSuccess}
                      getClientSecret={validateAndGetSecret}
                    />
                  </Elements>
                )}
              </div>
            </div>

            {/* ── Booking summary ───────────────────────────────────────── */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Récapitulatif de la demande</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: colorCode }} />
                  <span>
                    {formatDate(bookingData?.date || new Date().toISOString())} -{" "}
                    {displayTime}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Grape className="w-5 h-5" style={{ color: colorCode }} />
                  <span>
                    {widgetData?.service?.name || "Visite libre & dégustation"}
                  </span>
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
                  <span>
                    {(() => {
                      const onSiteMethods = acceptedPaymentMethods.filter((m: string) => m !== 'stripe');
                      const methodLabels: Record<string, string> = {
                        'bank card': 'carte bancaire',
                        'bank_card': 'carte bancaire',
                        'checks': 'chèques',
                        'cheque': 'chèques',
                        'cash': 'espèces',
                        'cash_on_onsite': 'espèces',
                      };
                      const labels = onSiteMethods.map((m: string) => methodLabels[m.toLowerCase()] || m.toLowerCase());
                      const onSiteText = labels.length === 0
                        ? ''
                        : labels.length === 1
                          ? ` (${labels[0]})`
                          : ` (${labels.slice(0, -1).join(', ')} ou ${labels[labels.length - 1]})`;
                      return stripeAvailable
                        ? `Paiement en ligne`
                        : `Paiement sur place${onSiteText}`;
                    })()}
                  </span>
                </div>

                {stripeAvailable && cancellationPolicy && getCancellationPolicyLabel(cancellationPolicy) && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 opacity-0" />
                    <span className="text-sm text-gray-500 italic">{getCancellationPolicyLabel(cancellationPolicy)}</span>
                  </div>
                )}

                <div className="mt-6">
                  <Link
                    href={`/if/booking-widget/${id}/${serviceId}/booking?${new URLSearchParams({
                      date: bookingData.date,
                      selectedTime: bookingData.selectedTime || "",
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

          {/* ── Additional info ───────────────────────────────────────────── */}
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

          {/* ── Confirm button — only for on-site flow ────────────────────── */}
          {!stripeAvailable && (
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={cn(
                  "text-white px-8 py-2",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90",
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
                  "Confirmer la réservation"
                )}
              </Button>
            </div>
          )}

          {/* ── Pay on-site button — shown alongside Stripe option ───────── */}
          {/* {stripeAvailable && (
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                variant="outline"
                className={cn(
                  "px-6",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "",
                )}
                style={{ borderColor: colorCode, color: colorCode }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Traitement...
                  </>
                ) : (
                  "Payer sur place"
                )}
              </Button>
            </div>
          )} */}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page wrapper
// ─────────────────────────────────────────────────────────────────────────────
const BookingConfirmation = ({
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
      <BookingConfirmationContent id={id} serviceId={service_id} />
    </WidgetProvider>
  );
};

export default BookingConfirmation;
