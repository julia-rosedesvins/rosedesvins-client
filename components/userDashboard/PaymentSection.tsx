'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, Coins, Loader2, Save } from "lucide-react";
import { toast } from 'react-hot-toast';
import { 
  paymentMethodsService, 
  PAYMENT_METHOD_OPTIONS,
  CreateOrUpdatePaymentMethodsRequest
} from "@/services/payment-methods.service";

export const PaymentSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // State for selected payment methods
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  
  // Static payment methods - all selected by default (for current implementation)
  const staticSelectedMethods = [
    PAYMENT_METHOD_OPTIONS.BANK_CARD,
    PAYMENT_METHOD_OPTIONS.CHECKS,
    PAYMENT_METHOD_OPTIONS.CASH
  ];

  // Load payment methods on component mount
  // NOTE: Keeping dynamic code for future use - currently commented out
  useEffect(() => {
    // loadPaymentMethods(); // Commented out for static implementation
    
    // For static implementation, set all methods as selected
    setSelectedMethods(staticSelectedMethods);
    setHasChanges(false);
    setIsLoading(false);
  }, []);

  // DYNAMIC CODE - Keeping for future use (currently commented out)
  /*
  const loadPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const response = await paymentMethodsService.getPaymentMethods();
      
      if (response.data && response.data.methods) {
        setSelectedMethods(response.data.methods);
        setHasChanges(false);
      } else {
        console.log('ℹ️ No payment methods found, using empty array');
        setSelectedMethods([]);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('❌ Failed to load payment methods:', error);
      toast.error('Erreur lors du chargement des moyens de paiement');
    } finally {
      setIsLoading(false);
    }
  };
  */

  // DYNAMIC CODE - Keeping for future use (currently commented out)
  /*
  const savePaymentMethods = async () => {
    setIsSaving(true);
    try {
      const methodsData: CreateOrUpdatePaymentMethodsRequest = {
        methods: selectedMethods
      };
      
      const response = await paymentMethodsService.createOrUpdatePaymentMethods(methodsData);
      
      toast.success('Moyens de paiement sauvegardés avec succès');
      setHasChanges(false);
    } catch (error: any) {
      console.error('❌ Failed to save payment methods:', error);
      toast.error(error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };
  */

  // DYNAMIC CODE - Keeping for future use (currently commented out)
  /*
  const handleMethodToggle = (method: string) => {
    setSelectedMethods(prev => {
      const newMethods = prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method];
      
      setHasChanges(true);
      return newMethods;
    });
  };
  */
  return (
    <Card className="mt-5 relative shadow-sm border-0 bg-white ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">Moyens de paiement acceptés</CardTitle>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-1">
          Sélectionnez les moyens de paiement que vous acceptez sur place.
        </p>
      </CardHeader>
      <CardContent className="pt-2 space-y-6 lg:space-y-8">        
        <div className="space-y-4">
          {/* Static Implementation - All payment methods selected with disabled checkboxes only */}
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
            <Checkbox 
              id="card" 
              checked={true}
              disabled={true}
              className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] disabled:opacity-100"
            />
            <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-[#3A7B59]" />
            <Label htmlFor="card" className="text-sm lg:text-base font-semibold cursor-pointer text-black">
              Carte bancaire
            </Label>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
            <Checkbox 
              id="check" 
              checked={true}
              disabled={true}
              className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] disabled:opacity-100"
            />
            <Banknote className="h-5 w-5 lg:h-6 lg:w-6 text-[#3A7B59]" />
            <Label htmlFor="check" className="text-sm lg:text-base font-semibold cursor-pointer text-black">
              Chèques
            </Label>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
            <Checkbox 
              id="cash" 
              checked={true}
              disabled={true}
              className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] disabled:opacity-100"
            />
            <Coins className="h-5 w-5 lg:h-6 lg:w-6 text-[#3A7B59]" />
            <Label htmlFor="cash" className="text-sm lg:text-base font-semibold cursor-pointer text-black">
              Espèces (paiement sur place)
            </Label>
          </div>
        </div>
        
        {/* DYNAMIC CODE - Save Button (keeping for future use, currently commented out) */}
        {/*
        <div className="flex justify-end">
          <Button
            onClick={savePaymentMethods}
            disabled={!hasChanges || isSaving || isLoading}
            className="bg-[#3A7B59] hover:bg-[#2d5a43] text-white px-8 py-3 flex items-center gap-2 font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Sauvegarder les moyens de paiement
              </>
            )}
          </Button>
        </div>
        */}

        {/* DYNAMIC CODE - Stripe Integration Section (keeping for future use, currently commented out) */}
        {/*
        <Separator className="my-6 lg:my-8" />

        <div className="space-y-4 lg:space-y-6">
          <h3 className="text-lg lg:text-2xl font-semibold leading-none tracking-tight text-gray-900">Prépaiements</h3>
          <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
            Le prépaiement permet de demander aux clients immédiatement au moment de la 
            réservation en ligne le paiement de la prestation afin de valider la réservation du 
            rendez-vous.
          </p>
          
          <Button 
            className="text-white hover:opacity-90 w-full sm:w-auto text-sm lg:text-base px-6 lg:px-8 py-3 lg:py-4 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            style={{ backgroundColor: '#3A7B59' }}
          >
            Connecter à Stripe
          </Button>
        </div>
        */}

        {/* DYNAMIC CODE - Loading Overlay (keeping for future use, currently commented out) */}
        {/*
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-3 text-[#3A7B59] bg-white px-6 py-3 rounded-lg shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Chargement des moyens de paiement...</span>
            </div>
          </div>
        )}
        */}
        
      </CardContent>
    </Card>
  );
};