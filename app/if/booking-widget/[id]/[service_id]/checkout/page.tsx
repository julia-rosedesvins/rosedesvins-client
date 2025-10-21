'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Users, Globe, Euro, CreditCard, Grape, Lock, Building2, Receipt, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";
import { bookingService } from "@/services/booking.service";

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
  
  // Payment method is fixed to cash_on_onsite
  const selectedPaymentMethod = 'cash_on_onsite';
  
  const [isProcessing, setIsProcessing] = useState(false);
  // Get payment methods from widget data (already loaded)
  const acceptedPaymentMethods = widgetData?.paymentMethods?.methods || ['cash_on_onsite'];
  const loadingPaymentMethods = loading;





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
  const totalParticipants = (bookingData?.adults || 2) + (bookingData?.children || 0);
  const pricePerPerson = widgetData?.service?.pricePerPerson || 5;
  const totalPrice = totalParticipants * pricePerPerson;

  const formatParticipants = () => {
    const adults = bookingData?.adults || 2;
    const children = bookingData?.children || 0;
    
    if (children > 0) {
      return `${totalParticipants} personnes (${adults} adultes, ${children} enfants)`;
    }
    return `${adults} personnes (adultes)`;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing) return; // Prevent double clicks

    setIsProcessing(true);
    
    try {
      // Prepare booking data - ALWAYS use cash_on_onsite payment method regardless of displayed options
      // The displayed payment methods are for information only, actual payment is always cash_on_onsite
      const bookingPayload = {
        userId: id,
        serviceId: serviceId,
        bookingDate: bookingData.date.split('T')[0], // Extract date part
        bookingTime: bookingData.selectedTime || '10:00',
        participantsAdults: bookingData.adults,
        participantsEnfants: bookingData.children,
        selectedLanguage: bookingData.language,
        userContactFirstname: bookingData.firstName || '',
        userContactLastname: bookingData.lastName || '',
        customerEmail: bookingData.email || '',
        phoneNo: bookingData.phone || '',
        additionalNotes: bookingData.additionalInfo || '',
        paymentMethod: {
          method: 'cash_on_onsite' as const // Fixed payment method - not user selectable
        }
      };

      console.log('Sending booking payload:', bookingPayload);
      
      const result = await bookingService.createBooking(bookingPayload);
      console.log('Booking API response:', result);
      
      // Check for successful response - either result.success is true OR result has data (201 created)
      if (result.success || result.data || (result as any)._id) {
        toast.success("Réservation créée avec succès !");
        const bookingId = result.data?._id || (result as any)._id || 'unknown';
        router.push(`/if/booking-widget/${id}/${serviceId}/confirmation-success?bookingId=${bookingId}&${searchParams.toString()}`);
      } else {
        console.error('Unexpected response structure:', result);
        toast.error(result.message || "Erreur lors de la création de la réservation");
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      
      // Check if it's actually a successful response (201) but wrapped in an error
      if (error.response?.status === 201 && error.response?.data) {
        console.log('201 response detected in error handler:', error.response.data);
        toast.success("Réservation créée avec succès !");
        const bookingId = error.response.data._id || error.response.data.data?._id || 'unknown';
        router.push(`/if/booking-widget/${id}/${serviceId}/confirmation-success?bookingId=${bookingId}&${searchParams.toString()}`);
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
        return <Euro className={iconClass} />;
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
        return 'Espèces (paiement sur place)';
      case 'cash_on_onsite':
        return 'Espèces (paiement sur place)';
      case 'stripe':
        return 'Carte bancaire (Stripe)';
      default:
        return method;
    }
  };

  // Normalize payment method name for form display
  const normalizePaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank card':
        return 'bank_card';
      case 'checks':
        return 'cheque';
      case 'cash':
        return 'cash_on_onsite'; // Normalize 'cash' to 'cash_on_onsite'
      case 'cash_on_onsite':
        return 'cash_on_onsite';
      case 'stripe':
        return 'stripe';
      default:
        return method.toLowerCase().replace(/\s+/g, '_');
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
                {/* Payment Methods Display - Dynamic */}
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
                      {acceptedPaymentMethods.map((method) => (
                        <div key={method} className="flex items-center space-x-2 p-3 border rounded-lg bg-white border-gray-200">
                          <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            {renderPaymentMethodIcon(method)}
                            <span className="text-gray-800">{getPaymentMethodLabel(method)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> {acceptedPaymentMethods.length > 1 
                        ? 'Tous les modes de paiement sont acceptés. Vous pourrez choisir votre méthode de paiement préférée lors de votre visite.'
                        : 'Vous pourrez effectuer votre paiement selon la méthode acceptée lors de votre visite.'
                      }
                    </p>
                  </div>
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
                  <span className="text-sm">{widgetData?.service?.name || 'Visite libre & dégustation des cuvées Tradition'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">{formatParticipants()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm">{bookingData?.language || "Français"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5" style={{ color: colorCode }} />
                  <span className="text-sm" style={{ color: colorCode }}>
                    {acceptedPaymentMethods.length > 1 
                      ? `${acceptedPaymentMethods.length} modes de paiement acceptés`
                      : 'Mode de paiement accepté'
                    }
                  </span>
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
            
            <Button 
              onClick={handleSubmit}
              disabled={isProcessing}
              className={cn(
                "text-white px-8 py-2",
                isProcessing 
                  ? "opacity-70 cursor-not-allowed" 
                  : "hover:opacity-90"
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