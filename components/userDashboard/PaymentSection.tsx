'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, Coins, Loader2, Save, ExternalLink, CheckCircle2, AlertTriangle, XCircle, Unplug } from "lucide-react";
import { toast } from 'react-hot-toast';
import { 
  paymentMethodsService, 
  PAYMENT_METHOD_OPTIONS,
  CreateOrUpdatePaymentMethodsRequest,
  StripeConnectData,
} from "@/services/payment-methods.service";

export const PaymentSection = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // State for selected payment methods
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  // Stripe Connect state
  const [stripeStatus, setStripeStatus] = useState<StripeConnectData | null>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isStripeConnecting, setIsStripeConnecting] = useState(false);
  const [isStripeDisconnecting, setIsStripeDisconnecting] = useState(false);

  // Handle stripe callback URL params (after OAuth redirect)
  useEffect(() => {
    const stripeSuccess = searchParams.get('stripe_success');
    const stripeError = searchParams.get('stripe_error');

    if (stripeSuccess === 'true') {
      toast.success('Compte Stripe connecté avec succès !');
      // Remove query params from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete('stripe_success');
      window.history.replaceState({}, '', url.toString());
      // Reload stripe status
      loadStripeStatus();
    } else if (stripeError) {
      const errorMessages: Record<string, string> = {
        'access_denied': 'Connexion Stripe annulée.',
        'callback_failed': 'Erreur lors de la connexion Stripe. Veuillez réessayer.',
      };
      toast.error(errorMessages[stripeError] || 'Erreur Stripe. Veuillez réessayer.');
      const url = new URL(window.location.href);
      url.searchParams.delete('stripe_error');
      window.history.replaceState({}, '', url.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadStripeStatus = useCallback(async () => {
    setIsStripeLoading(true);
    try {
      const response = await paymentMethodsService.getStripeStatus();
      if (response.success && response.data) {
        setStripeStatus(response.data);
      } else {
        setStripeStatus(null);
      }
    } catch (error) {
      console.error('Failed to load Stripe status:', error);
      setStripeStatus(null);
    } finally {
      setIsStripeLoading(false);
    }
  }, []);

  // Load payment methods on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [paymentResponse] = await Promise.all([
          paymentMethodsService.getPaymentMethods(),
          loadStripeStatus(),
        ]);
        
        if (isMounted) {
          if (paymentResponse.data && paymentResponse.data.methods) {
            setSelectedMethods(paymentResponse.data.methods);
            setHasChanges(false);
          } else {
            setSelectedMethods([]);
            setHasChanges(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('❌ Failed to load payment methods:', error);
          toast.error('Erreur lors du chargement des moyens de paiement');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePaymentMethods = async () => {
    setIsSaving(true);
    try {
      const methodsData: CreateOrUpdatePaymentMethodsRequest = {
        methods: selectedMethods
      };
      
      await paymentMethodsService.createOrUpdatePaymentMethods(methodsData);
      toast.success('Moyens de paiement sauvegardés avec succès');
      setHasChanges(false);
    } catch (error: any) {
      console.error('❌ Failed to save payment methods:', error);
      toast.error(error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMethodToggle = (methodId: string) => {
    setSelectedMethods(prev => {
      const newMethods = prev.includes(methodId)
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId];
      
      setHasChanges(true);
      return newMethods;
    });
  };

  const handleStripeConnect = async () => {
    setIsStripeConnecting(true);
    try {
      const response = await paymentMethodsService.getStripeAuthUrl();
      if (response.success && response.data?.authUrl) {
        window.location.href = response.data.authUrl;
      } else {
        toast.error('Impossible de générer le lien Stripe. Veuillez réessayer.');
      }
    } catch (error: any) {
      console.error('Failed to get Stripe auth URL:', error);
      toast.error(error?.message || 'Erreur lors de la connexion Stripe');
    } finally {
      setIsStripeConnecting(false);
    }
  };

  const handleStripeDisconnect = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter votre compte Stripe ? Les prépaiements en ligne ne seront plus disponibles.')) return;
    setIsStripeDisconnecting(true);
    try {
      await paymentMethodsService.disconnectStripe();
      toast.success('Compte Stripe déconnecté avec succès.');
      setStripeStatus(null);
    } catch (error: any) {
      console.error('Failed to disconnect Stripe:', error);
      toast.error(error?.message || 'Erreur lors de la déconnexion Stripe');
    } finally {
      setIsStripeDisconnecting(false);
    }
  };

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
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
            <Checkbox 
              id="card" 
              checked={selectedMethods.includes(PAYMENT_METHOD_OPTIONS.BANK_CARD)}
              onCheckedChange={() => handleMethodToggle(PAYMENT_METHOD_OPTIONS.BANK_CARD)}
              disabled={isLoading}
              className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
            />
            <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-[#3A7B59]" />
            <Label htmlFor="card" className="text-sm lg:text-base font-semibold cursor-pointer text-black">
              Carte bancaire
            </Label>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
            <Checkbox 
              id="check" 
              checked={selectedMethods.includes(PAYMENT_METHOD_OPTIONS.CHECKS)}
              onCheckedChange={() => handleMethodToggle(PAYMENT_METHOD_OPTIONS.CHECKS)}
              disabled={isLoading}
              className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
            />
            <Banknote className="h-5 w-5 lg:h-6 lg:w-6 text-[#3A7B59]" />
            <Label htmlFor="check" className="text-sm lg:text-base font-semibold cursor-pointer text-black">
              Chèques
            </Label>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
            <Checkbox 
              id="cash" 
              checked={selectedMethods.includes(PAYMENT_METHOD_OPTIONS.CASH)}
              onCheckedChange={() => handleMethodToggle(PAYMENT_METHOD_OPTIONS.CASH)}
              disabled={isLoading}
              className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
            />
            <Coins className="h-5 w-5 lg:h-6 lg:w-6 text-[#3A7B59]" />
            <Label htmlFor="cash" className="text-sm lg:text-base font-semibold cursor-pointer text-black">
              Espèces
            </Label>
          </div>
        </div>
        
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

        {/* ───── Stripe Connect Section ───── */}
        <Separator className="my-2" />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Prépaiements en ligne</h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-1">
              Connectez votre compte Stripe pour accepter les prépaiements en ligne lors des réservations.
              Les clients pourront payer directement au moment de réserver un rendez-vous.
            </p>
          </div>

          {isStripeLoading ? (
            <div className="flex items-center gap-3 text-gray-500 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <Loader2 className="h-5 w-5 animate-spin text-[#3A7B59]" />
              <span className="text-sm font-medium">Vérification du compte Stripe...</span>
            </div>
          ) : stripeStatus ? (
            /* ── Connected State ── */
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {stripeStatus.chargesEnabled ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">
                      {stripeStatus.displayName ?? 'Compte Stripe connecté'}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{stripeStatus.stripeAccountId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {stripeStatus.chargesEnabled ? (
                    <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100 text-xs font-medium">
                      Actif
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100 text-xs font-medium">
                      En attente de vérification
                    </Badge>
                  )}
                </div>
              </div>

              {!stripeStatus.chargesEnabled && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Votre compte Stripe nécessite une vérification supplémentaire avant de pouvoir accepter des paiements.
                    Connectez-vous à votre{' '}
                    <a
                      href="https://dashboard.stripe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-amber-900"
                    >
                      tableau de bord Stripe
                    </a>{' '}
                    pour compléter la vérification.
                  </p>
                </div>
              )}

              {stripeStatus.connectedAt && (
                <p className="text-xs text-gray-400">
                  Connecté le {new Date(stripeStatus.connectedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStripeDisconnect}
                  disabled={isStripeDisconnecting}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 flex items-center gap-2"
                >
                  {isStripeDisconnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unplug className="h-4 w-4" />
                  )}
                  Déconnecter Stripe
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                >
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Tableau de bord Stripe
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            /* ── Not Connected State ── */
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center gap-3 text-gray-500">
                <XCircle className="h-5 w-5 text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-gray-600">Aucun compte Stripe connecté</span>
              </div>

              <Button
                onClick={handleStripeConnect}
                disabled={isStripeConnecting}
                className="bg-[#635BFF] hover:bg-[#4f49d0] text-white flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
              >
                {isStripeConnecting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirection vers Stripe...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" aria-label="Stripe logo">
                      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.03 6.26c.42.44.98.78 1.94.78 1.52 0 2.54-1.65 2.54-3.93 0-2.2-1.05-3.92-2.54-3.92zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.87zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.84zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="currentColor"/>
                    </svg>
                    Connecter à Stripe
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-3 text-[#3A7B59] bg-white px-6 py-3 rounded-lg shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Chargement des moyens de paiement...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};