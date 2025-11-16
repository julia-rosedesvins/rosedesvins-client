'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast } from 'react-hot-toast';
import { 
  notificationPreferencesService, 
  NOTIFICATION_OPTIONS,
  CreateOrUpdateNotificationPreferencesRequest
} from "@/services/notification-preferences.service";

export const NotificationSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // State for notification preferences
  const [preferences, setPreferences] = useState<CreateOrUpdateNotificationPreferencesRequest>({
    customerNotificationBefore: NOTIFICATION_OPTIONS.DAY_BEFORE,
    providerNotificationBefore: NOTIFICATION_OPTIONS.TWO_HOURS,
    bookingAdvanceLimit: NOTIFICATION_OPTIONS.LAST_MINUTE,
  });

  // Load notification preferences on component mount
  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    setIsLoading(true);
    try {
      const response = await notificationPreferencesService.getNotificationPreferences();
      
      if (response.data) {
        // Validate and set preferences with fallbacks
        setPreferences({
          customerNotificationBefore: response.data.customerNotificationBefore || NOTIFICATION_OPTIONS.DAY_BEFORE,
          providerNotificationBefore: response.data.providerNotificationBefore || NOTIFICATION_OPTIONS.TWO_HOURS,
          bookingAdvanceLimit: response.data.bookingAdvanceLimit || NOTIFICATION_OPTIONS.LAST_MINUTE,
        });
        setHasChanges(false);
      } else {
        console.log('ℹ️ No notification preferences found, using defaults');
        // Set defaults explicitly
        setPreferences({
          customerNotificationBefore: NOTIFICATION_OPTIONS.DAY_BEFORE,
          providerNotificationBefore: NOTIFICATION_OPTIONS.TWO_HOURS,
          bookingAdvanceLimit: NOTIFICATION_OPTIONS.LAST_MINUTE,
        });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('❌ Failed to load notification preferences:', error);
      toast.error('Erreur lors du chargement des préférences');
      // Set defaults on error to prevent undefined state
      setPreferences({
        customerNotificationBefore: NOTIFICATION_OPTIONS.DAY_BEFORE,
        providerNotificationBefore: NOTIFICATION_OPTIONS.TWO_HOURS,
        bookingAdvanceLimit: NOTIFICATION_OPTIONS.LAST_MINUTE,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotificationPreferences = async () => {
    setIsSaving(true);
    try {
      const response = await notificationPreferencesService.createOrUpdateNotificationPreferences(preferences);
      
      toast.success('Préférences de notification sauvegardées avec succès');
      setHasChanges(false);
    } catch (error: any) {
      console.error('❌ Failed to save notification preferences:', error);
      toast.error(error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = (field: keyof typeof preferences, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };
  return (
    <Card className="mb-6 lg:mb-8 relative shadow-sm border-0 bg-white ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">Préférences de notifications</CardTitle>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-1">
          Configurez vos préférences de notification pour les réservations.
        </p>
      </CardHeader>
      <CardContent className="pt-2 space-y-6 lg:space-y-8">        
        <div className="space-y-6 lg:space-y-8">
          {/* Customer Notification Section */}
          <div className="space-y-4">
            <Label className="text-base lg:text-lg font-semibold text-gray-800">
              Combien de temps avant le début de la réservation pour le client ?
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="client-1hour" 
                  checked={preferences.customerNotificationBefore === NOTIFICATION_OPTIONS.ONE_HOUR}
                  onCheckedChange={() => handlePreferenceChange('customerNotificationBefore', NOTIFICATION_OPTIONS.ONE_HOUR)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="client-1hour" className="text-sm lg:text-base font-medium cursor-pointer">1 heure</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="client-2hours" 
                  checked={preferences.customerNotificationBefore === NOTIFICATION_OPTIONS.TWO_HOURS}
                  onCheckedChange={() => handlePreferenceChange('customerNotificationBefore', NOTIFICATION_OPTIONS.TWO_HOURS)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="client-2hours" className="text-sm lg:text-base font-medium cursor-pointer">2 heures</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="client-veille" 
                  checked={preferences.customerNotificationBefore === NOTIFICATION_OPTIONS.DAY_BEFORE}
                  onCheckedChange={() => handlePreferenceChange('customerNotificationBefore', NOTIFICATION_OPTIONS.DAY_BEFORE)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="client-veille" className="text-sm lg:text-base font-medium cursor-pointer">La veille</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="client-jamais" 
                  checked={preferences.customerNotificationBefore === NOTIFICATION_OPTIONS.NEVER}
                  onCheckedChange={() => handlePreferenceChange('customerNotificationBefore', NOTIFICATION_OPTIONS.NEVER)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="client-jamais" className="text-sm lg:text-base font-medium cursor-pointer">Jamais</Label>
              </div>
            </div>
          </div>

          {/* Provider Notification Section */}
          <div className="space-y-4">
            <Label className="text-base lg:text-lg font-semibold text-gray-800">
              Combien de temps avant le début de la réservation pour vous ?
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="owner-1hour" 
                  checked={preferences.providerNotificationBefore === NOTIFICATION_OPTIONS.ONE_HOUR}
                  onCheckedChange={() => handlePreferenceChange('providerNotificationBefore', NOTIFICATION_OPTIONS.ONE_HOUR)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="owner-1hour" className="text-sm lg:text-base font-medium cursor-pointer">1 heure</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="owner-2hours" 
                  checked={preferences.providerNotificationBefore === NOTIFICATION_OPTIONS.TWO_HOURS}
                  onCheckedChange={() => handlePreferenceChange('providerNotificationBefore', NOTIFICATION_OPTIONS.TWO_HOURS)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="owner-2hours" className="text-sm lg:text-base font-medium cursor-pointer">2 heures</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="owner-veille" 
                  checked={preferences.providerNotificationBefore === NOTIFICATION_OPTIONS.DAY_BEFORE}
                  onCheckedChange={() => handlePreferenceChange('providerNotificationBefore', NOTIFICATION_OPTIONS.DAY_BEFORE)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="owner-veille" className="text-sm lg:text-base font-medium cursor-pointer">La veille</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="owner-jamais" 
                  checked={preferences.providerNotificationBefore === NOTIFICATION_OPTIONS.NEVER}
                  onCheckedChange={() => handlePreferenceChange('providerNotificationBefore', NOTIFICATION_OPTIONS.NEVER)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="owner-jamais" className="text-sm lg:text-base font-medium cursor-pointer">Jamais</Label>
              </div>
            </div>
          </div>

          {/* Booking Advance Limit Section */}
          <div className="space-y-4">
            <Label className="text-base lg:text-lg font-semibold text-gray-800">
              Jusqu'à quel moment un client peut-il réserver avant le début d'une visite ?
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="reservation-1hour" 
                  checked={preferences.bookingAdvanceLimit === NOTIFICATION_OPTIONS.ONE_HOUR}
                  onCheckedChange={() => handlePreferenceChange('bookingAdvanceLimit', NOTIFICATION_OPTIONS.ONE_HOUR)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="reservation-1hour" className="text-sm lg:text-base font-medium cursor-pointer">1 heure</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="reservation-2hours" 
                  checked={preferences.bookingAdvanceLimit === NOTIFICATION_OPTIONS.TWO_HOURS}
                  onCheckedChange={() => handlePreferenceChange('bookingAdvanceLimit', NOTIFICATION_OPTIONS.TWO_HOURS)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="reservation-2hours" className="text-sm lg:text-base font-medium cursor-pointer">2 heures</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="reservation-veille" 
                  checked={preferences.bookingAdvanceLimit === NOTIFICATION_OPTIONS.DAY_BEFORE}
                  onCheckedChange={() => handlePreferenceChange('bookingAdvanceLimit', NOTIFICATION_OPTIONS.DAY_BEFORE)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="reservation-veille" className="text-sm lg:text-base font-medium cursor-pointer">La veille</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <Checkbox 
                  id="reservation-derniere" 
                  checked={preferences.bookingAdvanceLimit === NOTIFICATION_OPTIONS.LAST_MINUTE}
                  onCheckedChange={() => handlePreferenceChange('bookingAdvanceLimit', NOTIFICATION_OPTIONS.LAST_MINUTE)}
                  className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59]"
                />
                <Label htmlFor="reservation-derniere" className="text-sm lg:text-base font-medium cursor-pointer">Dernière minute</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={saveNotificationPreferences}
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
                Sauvegarder les préférences
              </>
            )}
          </Button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-3 text-[#3A7B59] bg-white px-6 py-3 rounded-lg shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Chargement des préférences...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};