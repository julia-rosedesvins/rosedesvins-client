'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Clock, Users, Globe, Euro, CreditCard, Grape, Lock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BookingData {
  date: string;
  selectedTime?: string;
  adults: number;
  children: number;
  language: string;
}

const Checkout = ({ params }: { params: Promise<{ id: string }> }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [id, setId] = useState<string>('');
  
  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);
  
  // Extract booking data from URL parameters
  const bookingData: BookingData = {
    date: searchParams.get('date') || '',
    selectedTime: searchParams.get('selectedTime') || undefined,
    adults: parseInt(searchParams.get('adults') || '2'),
    children: parseInt(searchParams.get('children') || '0'),
    language: searchParams.get('language') || 'Français',
  };
  
  const [cardNumber, setCardNumber] = useState("2537 4836 5262 6363");
  const [expiryDate, setExpiryDate] = useState("09/28");
  const [cvv, setCvv] = useState("252");
  const [cardholderName, setCardholderName] = useState("Juliette Dupont");
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    console.log("=== CHECKOUT DEBUG ===");
    console.log("cardNumber:", cardNumber);
    console.log("expiryDate:", expiryDate);
    console.log("cvv:", cvv);
    console.log("cardholderName:", cardholderName);
    console.log("cardNumber length:", cardNumber.length);
    console.log("====================");
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      console.log("Validation failed - missing fields");
      toast.error("Veuillez remplir tous les champs de la carte bancaire.");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Paiement réussi ! Votre réservation a été confirmée.");
      router.push(`/if/booking-widget/${id}/confirmation-success?${searchParams.toString()}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: '#3A7E53' }}>
            Paiement sécurisé
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulaire de paiement */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" style={{ color: '#3A7E53' }} />
                Informations bancaires
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <Lock className="w-4 h-4" />
                  <span>Vos informations sont sécurisées par cryptage SSL</span>
                </div>
              </form>
            </div>

            {/* Récapitulatif de la commande */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Récapitulatif de votre réservation</h2>
              
              <Card className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span className="text-sm">{formatDate(bookingData?.date || new Date().toISOString())} - {displayTime}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Grape className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span className="text-sm">Visite libre & dégustation des cuvées Tradition</span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span className="text-sm">{formatParticipants()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5" style={{ color: '#3A7E53' }} />
                  <span className="text-sm">{bookingData?.language || "Français"}</span>
                </div>

                <hr className="my-4" />
                
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-3">
                    <Euro className="w-5 h-5" style={{ color: '#3A7E53' }} />
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
              style={{ backgroundColor: '#3A7E53' }}
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Traitement en cours...
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer {totalPrice} €
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;