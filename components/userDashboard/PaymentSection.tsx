'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, Coins, Loader2, Save, ExternalLink, CheckCircle2, AlertTriangle, Unplug } from "lucide-react";
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
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [stripeStatus, setStripeStatus] = useState<StripeConnectData | null>(null);
  const [isStripeConnecting, setIsStripeConnecting] = useState(false);
  const [isStripeDisconnecting, setIsStripeDisconnecting] = useState(false);

  const isStripeSelected = selectedMethods.includes(PAYMENT_METHOD_OPTIONS.STRIPE);

  // Handle Stripe OAuth callback params
  useEffect(() => {
    const stripeSuccess = searchParams.get('stripe_success');
    const stripeError = searchParams.get('stripe_error');

    if (stripeSuccess === 'true') {
      toast.success('Compte Stripe connecté avec succès !');
      const url = new URL(window.location.href);
      url.searchParams.delete('stripe_success');
      url.searchParams.delete('account_id');
      window.history.replaceState({}, '', url.toString());
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
    try {
      const response = await paymentMethodsService.getStripeStatus();
      setStripeStatus(response.success && response.data ? response.data : null);
    } catch {
      setStripeStatus(null);
    }
  }, []);

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
          setSelectedMethods(paymentResponse.data?.methods ?? []);
          setHasChanges(false);
        }
      } catch {
        if (isMounted) toast.error('Erreur lors du chargement des moyens de paiement');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePaymentMethods = async () => {
    setIsSaving(true);
    try {
      const methodsData: CreateOrUpdatePaymentMethodsRequest = { methods: selectedMethods };
      await paymentMethodsService.createOrUpdatePaymentMethods(methodsData);
      toast.success('Moyens de paiement sauvegardés avec succès');
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMethodToggle = (methodId: string) => {
    // Unchecking Stripe while connected → disconnect first
    if (methodId === PAYMENT_METHOD_OPTIONS.STRIPE && isStripeSelected && stripeStatus) {
      handleStripeDisconnect(true);
      return;
    }
    setSelectedMethods(prev => {
      const updated = prev.includes(methodId)
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId];
      setHasChanges(true);
      return updated;
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
      toast.error(error?.message || 'Erreur lors de la connexion Stripe');
    } finally {
      setIsStripeConnecting(false);
    }
  };

  // uncheckToo=true when called from checkbox toggle
  const handleStripeDisconnect = async (uncheckToo = false) => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter votre compte Stripe ?')) return;
    setIsStripeDisconnecting(true);
    try {
      await paymentMethodsService.disconnectStripe();
      toast.success('Compte Stripe déconnecté avec succès.');
      setStripeStatus(null);
      // Always remove stripe from selected methods
      setSelectedMethods(prev => prev.filter(m => m !== PAYMENT_METHOD_OPTIONS.STRIPE));
      setHasChanges(true);
    } catch (error: any) {
      toast.error(error?.message || 'Erreur lors de la déconnexion Stripe');
    } finally {
      setIsStripeDisconnecting(false);
    }
  };

  const standardMethods = [
    { id: PAYMENT_METHOD_OPTIONS.BANK_CARD, htmlId: 'card',  label: 'Carte bancaire', icon: <CreditCard className="h-5 w-5 text-[#3A7B59]" /> },
    { id: PAYMENT_METHOD_OPTIONS.CHECKS,    htmlId: 'check', label: 'Chèques',        icon: <Banknote   className="h-5 w-5 text-[#3A7B59]" /> },
    { id: PAYMENT_METHOD_OPTIONS.CASH,      htmlId: 'cash',  label: 'Espèces',        icon: <Coins      className="h-5 w-5 text-[#3A7B59]" /> },
  ];

  return (
    <Card className="mt-5 relative shadow-sm border-0 bg-white ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">Moyens de paiement acceptés</CardTitle>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-1">
          Sélectionnez les moyens de paiement que vous acceptez sur place et en ligne.
        </p>
      </CardHeader>
      <CardContent className="pt-2 space-y-6 lg:space-y-8">

        <div className="space-y-3">
          {/* Standard payment method checkboxes */}
          {standardMethods.map(opt => (
            <div key={opt.id} className="flex items-center space-x-4 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
              <Checkbox
                id={opt.htmlId}
                checked={selectedMethods.includes(opt.id)}
                onCheckedChange={() => handleMethodToggle(opt.id)}
                disabled={isLoading}
                className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
              />
              {opt.icon}
              <Label htmlFor={opt.htmlId} className="text-sm lg:text-base font-semibold cursor-pointer text-black">
                {opt.label}
              </Label>
            </div>
          ))}

          {/* Stripe checkbox + expandable panel */}
          <div className={`rounded-lg border transition-all duration-200 ${isStripeSelected ? 'border-[#3A7B59]/50 bg-[#3A7B59]/3' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
            {/* Checkbox row */}
            <div className="flex items-center space-x-4 p-3">
              <Checkbox
                id="stripe"
                checked={isStripeSelected}
                onCheckedChange={() => handleMethodToggle(PAYMENT_METHOD_OPTIONS.STRIPE)}
                disabled={isLoading || isStripeDisconnecting}
                className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
              />
              <CreditCard className="h-5 w-5 text-[#3A7B59]" />
              <Label htmlFor="stripe" className="text-sm lg:text-base font-semibold cursor-pointer text-black flex-1">
                Stripe — Prépaiements en ligne
              </Label>
              {/* Status badge when connected */}
              {isStripeSelected && stripeStatus && (
                stripeStatus.chargesEnabled ? (
                  <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100 text-xs font-medium shrink-0">
                    Actif
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100 text-xs font-medium shrink-0">
                    En attente
                  </Badge>
                )
              )}
            </div>

            {/* Expanded panel — only visible when Stripe is checked */}
            {isStripeSelected && (
              <div className="px-4 pb-4 pt-0 border-t border-[#3A7B59]/20">
                {stripeStatus ? (
                  /* ── Connected state ── */
                  <div className="space-y-3 pt-3">
                    <div className="flex items-center gap-3">
                      {stripeStatus.chargesEnabled ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {stripeStatus.displayName ?? 'Compte Stripe connecté'}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">{stripeStatus.stripeAccountId}</p>
                      </div>
                    </div>

                    {!stripeStatus.chargesEnabled && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                          Votre compte Stripe nécessite une vérification supplémentaire.{' '}
                          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-900">
                            Compléter la vérification →
                          </a>
                        </p>
                      </div>
                    )}

                    {stripeStatus.connectedAt && (
                      <p className="text-xs text-gray-400">
                        Connecté le {new Date(stripeStatus.connectedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStripeDisconnect()}
                        disabled={isStripeDisconnecting}
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 flex items-center gap-2"
                      >
                        {isStripeDisconnecting
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Unplug className="h-4 w-4" />
                        }
                        Déconnecter
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-gray-600 flex items-center gap-1.5">
                        <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Tableau de bord Stripe
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* ── Not connected state ── */
                  <div className="space-y-3 pt-3">
                    <p className="text-sm text-gray-500">
                      Connectez votre compte Stripe pour accepter les prépaiements lors des réservations en ligne.
                    </p>
                    <Button
                      onClick={handleStripeConnect}
                      disabled={isStripeConnecting}
                      className="bg-[#3A7B59] hover:bg-[#2d5a43] text-white flex items-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all"
                    >
                      {isStripeConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Redirection vers Stripe...
                        </>
                      ) : (
                        <>
                          Connecter à Stripe
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save button */}
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

        {/* Loading overlay */}
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
