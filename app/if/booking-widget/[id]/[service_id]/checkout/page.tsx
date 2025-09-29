'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Users, Globe, Euro, CreditCard, Grape, Lock, Building2, Receipt } from "lucide-react";
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
  
  // Payment method selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  // Bank card details
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState(bookingData.firstName && bookingData.lastName ? `${bookingData.firstName} ${bookingData.lastName}` : "");
  
  // Bank details for bank card
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState(cardholderName);
  const [accountNumber, setAccountNumber] = useState("");
  
  // Cheque details
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeBankName, setChequeBankName] = useState("");
  const [chequeIssueDate, setChequeIssueDate] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Set default payment method when widget data loads
  useEffect(() => {
    if (!selectedPaymentMethod) {
      console.log('Setting default payment method', widgetData);
      if (widgetData?.paymentMethods?.methods && widgetData.paymentMethods.methods.length > 0) {
        const normalizedMethod = normalizePaymentMethod(widgetData.paymentMethods.methods[0]);
        console.log('Normalized method:', normalizedMethod);
        setSelectedPaymentMethod(normalizedMethod);
      }
      // Don't set a default payment method if none are available from API
    }
  }, [widgetData, selectedPaymentMethod]);

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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) { // MM/YY
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      toast.error("Veuillez sélectionner un mode de paiement.");
      return;
    }

    // Validate payment method specific fields
    if (selectedPaymentMethod === 'bank_card') {
      if (!bankName || !accountName || !accountNumber) {
        toast.error("Veuillez remplir tous les champs bancaires.");
        return;
      }
    } else if (selectedPaymentMethod === 'cheque') {
      if (!chequeNumber || !chequeBankName || !chequeIssueDate) {
        toast.error("Veuillez remplir tous les champs du chèque.");
        return;
      }
    }
    // cash_on_onsite and stripe don't need additional validation

    setIsProcessing(true);
    
    try {
      // Prepare booking data
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
        phoneNo: bookingData.phone || '',
        additionalNotes: bookingData.additionalInfo || '',
        paymentMethod: {
          method: selectedPaymentMethod as 'bank_card' | 'cheque' | 'stripe' | 'cash_on_onsite',
          ...(selectedPaymentMethod === 'bank_card' && {
            bankCardDetails: {
              bankName,
              accountName,
              accountNumber,
            }
          }),
          ...(selectedPaymentMethod === 'cheque' && {
            chequeDetails: {
              chequeNumber,
              bankName: chequeBankName,
              issueDate: chequeIssueDate,
            }
          })
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
    switch (method.toLowerCase()) {
      case 'bank card':
      case 'bank_card':
        return <Building2 className="w-5 h-5" />;
      case 'checks':
      case 'cheque':
        return <Receipt className="w-5 h-5" />;
      case 'cash':
        return <Euro className="w-5 h-5" />;
      case 'cash_on_onsite':
        return <Euro className="w-5 h-5" />;
      case 'stripe':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank card':
      case 'bank_card':
        return 'Virement bancaire';
      case 'checks':
      case 'cheque':
        return 'Paiement par chèque';
      case 'cash':
        return 'Paiement en espèces';
      case 'cash_on_onsite':
        return 'Paiement sur place';
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
            Paiement sécurisé
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulaire de paiement */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" style={{ color: colorCode }} />
                Informations de paiement
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                {widgetData?.paymentMethods?.methods && widgetData.paymentMethods.methods.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Mode de paiement
                    </label>
                    <RadioGroup value={selectedPaymentMethod} onValueChange={(value) => {
                      console.log('Payment method selected:', value);
                      setSelectedPaymentMethod(value);
                    }}>
                      {widgetData.paymentMethods.methods.map((method) => {
                        const normalizedMethod = normalizePaymentMethod(method);
                        return (
                          <div key={method} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value={normalizedMethod} id={normalizedMethod} />
                            <Label htmlFor={normalizedMethod} className="flex items-center gap-2 cursor-pointer flex-1">
                              {renderPaymentMethodIcon(method)}
                              <span>{getPaymentMethodLabel(method)}</span>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                ) : (
                  // Show message when no payment methods are configured
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          Aucun mode de paiement configuré
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Les modes de paiement n'ont pas encore été configurés pour ce service. 
                          Veuillez contacter l'administrateur.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Card Details */}
                {selectedPaymentMethod === 'bank_card' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations bancaires</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom de la banque *
                      </label>
                      <Input
                        placeholder="Ex: BNP Paribas"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom du titulaire du compte *
                      </label>
                      <Input
                        placeholder="Prénom et Nom"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Numéro de compte *
                      </label>
                      <Input
                        placeholder="Numéro de compte bancaire"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Cash on Onsite Payment */}
                {selectedPaymentMethod === 'cash_on_onsite' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Paiement sur place</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Le paiement en espèces sera effectué sur place au moment de votre visite.
                        Veuillez prévoir le montant exact : <strong>{totalPrice} €</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Cheque Details */}
                {selectedPaymentMethod === 'cheque' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations du chèque</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Numéro de chèque *
                      </label>
                      <Input
                        placeholder="Ex: 0123456"
                        value={chequeNumber}
                        onChange={(e) => setChequeNumber(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Banque émettrice *
                      </label>
                      <Input
                        placeholder="Ex: Crédit Agricole"
                        value={chequeBankName}
                        onChange={(e) => setChequeBankName(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date d'émission *
                      </label>
                      <Input
                        type="date"
                        value={chequeIssueDate}
                        onChange={(e) => setChequeIssueDate(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Stripe Payment */}
                {selectedPaymentMethod === 'stripe' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations de carte bancaire</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom du porteur de la carte
                      </label>
                      <Input
                        placeholder="Prénom et Nom"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Numéro de carte
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Date d'expiration
                        </label>
                        <Input
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          CVV
                        </label>
                        <Input
                          placeholder="123"
                          value={cvv}
                          onChange={handleCvvChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                  {selectedPaymentMethod ? renderPaymentMethodIcon(selectedPaymentMethod) : <Lock className="w-5 h-5" style={{ color: colorCode }} />}
                  <span className="text-sm" style={{ color: colorCode }}>
                    {selectedPaymentMethod ? 
                      getPaymentMethodLabel(selectedPaymentMethod) : 
                      (widgetData?.paymentMethods?.methods && widgetData.paymentMethods.methods.length === 0 ? 
                        'Aucun mode de paiement configuré' : 
                        'Mode de paiement non sélectionné'
                      )
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
              className="hover:opacity-90 text-white px-8 py-2"
              style={{ backgroundColor: colorCode }}
              size="lg"
              disabled={isProcessing || !selectedPaymentMethod || (widgetData?.paymentMethods?.methods && widgetData.paymentMethods.methods.length === 0)}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Traitement en cours...
                </div>
              ) : !selectedPaymentMethod || (widgetData?.paymentMethods?.methods && widgetData.paymentMethods.methods.length === 0) ? (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Modes de paiement non configurés</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {renderPaymentMethodIcon(selectedPaymentMethod)}
                  <span>
                    {selectedPaymentMethod === 'bank_card' ? 'Confirmer le virement' :
                     selectedPaymentMethod === 'cheque' ? 'Confirmer le chèque' :
                     selectedPaymentMethod === 'cash_on_onsite' ? 'Confirmer la réservation' :
                     selectedPaymentMethod === 'stripe' ? `Payer ${totalPrice} €` :
                     `Confirmer ${totalPrice} €`}
                  </span>
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