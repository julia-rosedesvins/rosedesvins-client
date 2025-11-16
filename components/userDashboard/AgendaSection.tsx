"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CalendarDays, CalendarCheck, CalendarClock, User, Lock, AlertCircle, Unplug } from "lucide-react";
import { useState, useEffect } from "react";
import { connectorService, ApiError } from "@/services/connector.service";
import toast from 'react-hot-toast';

export const AgendaSection = () => {
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isOrangeLoginOpen, setIsOrangeLoginOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicrosoftConnecting, setIsMicrosoftConnecting] = useState(false);
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);
  const [orangeConnectionStatus, setOrangeConnectionStatus] = useState<any>(null);
  const [microsoftConnectionStatus, setMicrosoftConnectionStatus] = useState<any>(null);
  const [googleConnectionStatus, setGoogleConnectionStatus] = useState<any>(null);
  const [connectedProvider, setConnectedProvider] = useState<string>('none');
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const [orangeCredentials, setOrangeCredentials] = useState({
    username: "",
    password: ""
  });

  // Check connection status on component mount
  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined') return;
    
    checkConnectedProvider();
    checkOrangeConnectionStatus();
    checkMicrosoftConnectionStatus();
    checkGoogleConnectionStatus();
    
    try {
      // Check for Microsoft OAuth callback success or error
      const urlParams = new URLSearchParams(window.location.search);
      const microsoftConnected = urlParams.get('microsoft_connected');
      const microsoftError = urlParams.get('microsoft_error');
      const googleConnected = urlParams.get('google_connected');
      const googleError = urlParams.get('google_error');
      
      if (microsoftConnected === 'true') {
        // Remove the parameter from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('microsoft_connected');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Show success message and refresh status
        toast.success('🎉 Microsoft Calendar connecté avec succès!');
        setTimeout(() => {
          checkConnectedProvider();
          checkMicrosoftConnectionStatus();
        }, 1000);
      } else if (microsoftError) {
        // Remove the parameter from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('microsoft_error');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Show error message
        toast.error(`❌ Erreur Microsoft: ${decodeURIComponent(microsoftError)}`);
      }

      if (googleConnected === 'true') {
        // Remove the parameter from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('google_connected');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Show success message and refresh status
        toast.success('🎉 Google Calendar connecté avec succès!');
        setTimeout(() => {
          checkConnectedProvider();
          checkGoogleConnectionStatus();
        }, 1000);
      } else if (googleError) {
        // Remove the parameter from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('google_error');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Show error message
        toast.error(`❌ Erreur Google: ${decodeURIComponent(googleError)}`);
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
    }
  }, []);

  const checkOrangeConnectionStatus = async () => {
    try {
      const result = await connectorService.getOrangeCalendarStatus();
      
      // Check if orange credentials exist and are not null
      const isConnected = result.data && 
                         result.data.connector_creds && 
                         result.data.connector_creds.orange !== null;
      
      if (isConnected && result.data && result.data.connector_creds.orange) {
        // Set the orange credentials data for display
        setOrangeConnectionStatus(result.data.connector_creds.orange);
      } else {
        // No connection
        setOrangeConnectionStatus(null);
      }
      
      console.log('🔍 Orange connection status:', isConnected ? '✅ Connected' : '❌ Not connected');
      console.log('📋 Full connector data:', result.data);
    } catch (error) {
      console.error('Error checking Orange connection status:', error);
      // Don't show error to user for status check - just log it
      setOrangeConnectionStatus(null);
    }
  };

  const checkMicrosoftConnectionStatus = async () => {
    try {
      const result = await connectorService.getMicrosoftCalendarStatus();
      
      // Check if microsoft credentials exist and are not null
      const isConnected = result.data && 
                         result.data.connector_creds && 
                         result.data.connector_creds.microsoft !== null;
      
      if (isConnected && result.data && result.data.connector_creds.microsoft) {
        // Set the microsoft credentials data for display
        setMicrosoftConnectionStatus(result.data.connector_creds.microsoft);
      } else {
        // No connection
        setMicrosoftConnectionStatus(null);
      }
      
      console.log('🔍 Microsoft connection status:', isConnected ? '✅ Connected' : '❌ Not connected');
      console.log('📋 Full connector data:', result.data);
    } catch (error) {
      console.error('Error checking Microsoft connection status:', error);
      // Don't show error to user for status check - just log it
      setMicrosoftConnectionStatus(null);
    }
  };

  const checkGoogleConnectionStatus = async () => {
    try {
      const result = await connectorService.getGoogleCalendarStatus();
      
      // Check if google credentials exist and are not null
      const isConnected = result.data && 
                         result.data.connector_creds && 
                         result.data.connector_creds.google !== null;
      
      if (isConnected && result.data && result.data.connector_creds.google) {
        // Set the google credentials data for display
        setGoogleConnectionStatus(result.data.connector_creds.google);
      } else {
        // No connection
        setGoogleConnectionStatus(null);
      }
      
      console.log('🔍 Google connection status:', isConnected ? '✅ Connected' : '❌ Not connected');
      console.log('📋 Full connector data:', result.data);
    } catch (error) {
      console.error('Error checking Google connection status:', error);
      // Don't show error to user for status check - just log it
      setGoogleConnectionStatus(null);
    }
  };

  const checkConnectedProvider = async () => {
    try {
      const result = await connectorService.getConnectedProvider();
      setConnectedProvider(result.data.provider);
      console.log('🔍 Connected provider:', result.data.provider);
    } catch (error) {
      console.error('Error checking connected provider:', error);
      setConnectedProvider('none');
    }
  };

  // Clear specific field error when user starts typing
  const clearFieldError = (field: 'username' | 'password') => {
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined,
        general: undefined // Also clear general error when user makes changes
      }));
    }
  };

  const handleCalendarConnect = (calendarType: string) => {
    const targetProvider = calendarType.toLowerCase();
    
    if (calendarType === 'Orange') {
      // If already connected, disconnect instead of connecting
      if (orangeConnectionStatus) {
        handleOrangeDisconnect();
        setIsCalendarDialogOpen(false);
      } else {
        // Check if another provider is connected
        if (connectedProvider !== 'none' && connectedProvider !== 'orange') {
          const providerNames = {
            'microsoft': 'Microsoft Calendar',
            'google': 'Google Calendar',
            'ovh': 'Calendrier OVH'
          };
          const currentProviderName = providerNames[connectedProvider as keyof typeof providerNames] || connectedProvider;
          
          if (window.confirm(`⚠️ Attention: ${currentProviderName} est actuellement connecté. Le connecter à Orange Calendar le déconnectera automatiquement. Voulez-vous continuer ?`)) {
            setIsCalendarDialogOpen(false);
            setIsOrangeLoginOpen(true);
            setFormErrors({});
          }
        } else {
          setIsCalendarDialogOpen(false);
          setIsOrangeLoginOpen(true);
          setFormErrors({});
        }
      }
    } else if (calendarType === 'Microsoft') {
      // If already connected, disconnect instead of connecting
      if (microsoftConnectionStatus) {
        handleMicrosoftDisconnect();
        setIsCalendarDialogOpen(false);
      } else {
        // Check if another provider is connected
        if (connectedProvider !== 'none' && connectedProvider !== 'microsoft') {
          const providerNames = {
            'orange': 'Orange Calendar',
            'google': 'Google Calendar',
            'ovh': 'Calendrier OVH'
          };
          const currentProviderName = providerNames[connectedProvider as keyof typeof providerNames] || connectedProvider;
          
          if (window.confirm(`⚠️ Attention: ${currentProviderName} est actuellement connecté. Le connecter à Microsoft Calendar le déconnectera automatiquement. Voulez-vous continuer ?`)) {
            handleMicrosoftConnect();
            setIsCalendarDialogOpen(false);
          }
        } else {
          handleMicrosoftConnect();
          setIsCalendarDialogOpen(false);
        }
      }
    } else if (calendarType === 'Google') {
      // If already connected, disconnect instead of connecting
      if (googleConnectionStatus) {
        handleGoogleDisconnect();
        setIsCalendarDialogOpen(false);
      } else {
        // Check if another provider is connected
        if (connectedProvider !== 'none' && connectedProvider !== 'google') {
          const providerNames = {
            'orange': 'Orange Calendar',
            'microsoft': 'Microsoft Calendar',
            'ovh': 'Calendrier OVH'
          };
          const currentProviderName = providerNames[connectedProvider as keyof typeof providerNames] || connectedProvider;
          
          if (window.confirm(`⚠️ Attention: ${currentProviderName} est actuellement connecté. Le connecter à Google Calendar le déconnectera automatiquement. Voulez-vous continuer ?`)) {
            handleGoogleConnect();
            setIsCalendarDialogOpen(false);
          }
        } else {
          handleGoogleConnect();
          setIsCalendarDialogOpen(false);
        }
      }
    } else {
      console.log(`Connecting to ${calendarType} calendar`);
      setIsCalendarDialogOpen(false);
    }
  };

  const handleOrangeDisconnect = async () => {
    setIsConnecting(true);
    try {
      await connectorService.disconnectOrangeCalendar();
      
      // Update local state
      setOrangeConnectionStatus(null);
      checkConnectedProvider(); // Refresh connected provider status
      toast.success('🔌 Calendrier Orange déconnecté avec succès!');
      
    } catch (error) {
      console.error('❌ Failed to disconnect Orange calendar:', error);
      
      // Handle API errors from service
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erreur lors de la déconnexion du calendrier Orange';
        toast.error(errorMessage);
      } else {
        toast.error('Erreur lors de la déconnexion du calendrier Orange');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMicrosoftConnect = async () => {
    setIsMicrosoftConnecting(true);
    try {
      console.log('🔗 Initiating Microsoft OAuth flow...');
      
      // Get OAuth URL from backend
      const oauthResult = await connectorService.getMicrosoftOAuthUrl();
      
      if (oauthResult.success && oauthResult.data.authUrl) {
        console.log('✅ OAuth URL generated, redirecting to Microsoft...');
        toast.success('🔗 Redirection vers Microsoft...');
        
        // Redirect to Microsoft OAuth - don't set state after this as we're navigating away
        window.location.href = oauthResult.data.authUrl;
        return; // Exit early to avoid finally block
      } else {
        throw new Error('Failed to generate OAuth URL');
      }
      
    } catch (error) {
      console.error('❌ Failed to connect Microsoft calendar:', error);
      
      // Handle API errors from service
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erreur lors de la connexion à Microsoft';
        toast.error(errorMessage);
      } else {
        toast.error('Erreur lors de la connexion à Microsoft');
      }
      
      // Only reset state if we didn't navigate away
      setIsMicrosoftConnecting(false);
    }
  };

  const handleMicrosoftDisconnect = async () => {
    setIsMicrosoftConnecting(true);
    try {
      await connectorService.disconnectMicrosoftCalendar();
      
      // Update local state
      setMicrosoftConnectionStatus(null);
      checkConnectedProvider(); // Refresh connected provider status
      toast.success('🔌 Calendrier Microsoft déconnecté avec succès!');
      
    } catch (error) {
      console.error('❌ Failed to disconnect Microsoft calendar:', error);
      
      // Handle API errors from service
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erreur lors de la déconnexion du calendrier Microsoft';
        toast.error(errorMessage);
      } else {
        toast.error('Erreur lors de la déconnexion du calendrier Microsoft');
      }
    } finally {
      setIsMicrosoftConnecting(false);
    }
  };

  const handleGoogleConnect = async () => {
    setIsGoogleConnecting(true);
    try {
      console.log('🔗 Initiating Google OAuth flow...');
      
      // Get OAuth URL from backend
      const oauthResult = await connectorService.getGoogleOAuthUrl();
      
      if (oauthResult.success && oauthResult.data.authUrl) {
        console.log('✅ OAuth URL generated, redirecting to Google...');
        toast.success('🔗 Redirection vers Google...');
        
        // Redirect to Google OAuth - don't set state after this as we're navigating away
        window.location.href = oauthResult.data.authUrl;
        return; // Exit early to avoid finally block
      } else {
        throw new Error('Failed to generate OAuth URL');
      }
      
    } catch (error) {
      console.error('❌ Failed to connect Google calendar:', error);
      
      // Handle API errors from service
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erreur lors de la connexion à Google';
        toast.error(errorMessage);
      } else {
        toast.error('Erreur lors de la connexion à Google');
      }
      
      // Only reset state if we didn't navigate away
      setIsGoogleConnecting(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    setIsGoogleConnecting(true);
    try {
      await connectorService.disconnectGoogleCalendar();
      
      // Update local state
      setGoogleConnectionStatus(null);
      checkConnectedProvider(); // Refresh connected provider status
      toast.success('🔌 Calendrier Google déconnecté avec succès!');
      
    } catch (error) {
      console.error('❌ Failed to disconnect Google calendar:', error);
      
      // Handle API errors from service
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Erreur lors de la déconnexion du calendrier Google';
        toast.error(errorMessage);
      } else {
        toast.error('Erreur lors de la déconnexion du calendrier Google');
      }
    } finally {
      setIsGoogleConnecting(false);
    }
  };

  const handleOrangeLogin = async () => {
    // Clear previous errors
    setFormErrors({});

    // Validate form before submitting
    const newErrors: typeof formErrors = {};

    if (!orangeCredentials.username.trim()) {
      newErrors.username = 'L\'adresse email est requise';
    } else {
      // Validate email format (Orange uses email as username)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(orangeCredentials.username)) {
        newErrors.username = 'Veuillez saisir une adresse email valide';
      }
    }

    if (!orangeCredentials.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }

    // If there are validation errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsConnecting(true);
    
    try {
      console.log('🔐 Attempting Orange login with:', { 
        username: orangeCredentials.username, 
        usernameLength: orangeCredentials.username.length,
        passwordLength: orangeCredentials.password.length,
        usernameBytes: new TextEncoder().encode(orangeCredentials.username),
        passwordBytes: new TextEncoder().encode(orangeCredentials.password)
      });
      
      const result = await connectorService.connectOrangeCalendar(orangeCredentials);

      console.log('✅ Orange calendar connected successfully:', result.data);
      toast.success('🎉 Calendrier Orange connecté avec succès!');
      setOrangeCredentials({ username: "", password: "" });
      setFormErrors({});
      setIsOrangeLoginOpen(false);
      setIsCalendarDialogOpen(false);
      
      // Refresh connection status
      await checkOrangeConnectionStatus();
      await checkConnectedProvider();
    } catch (error) {
      console.error('❌ Failed to connect Orange calendar:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', error ? Object.keys(error) : 'null');
      
      // Handle API errors from service
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        const apiError = error as ApiError;
        
        // Handle field-specific errors
        if (apiError.errors && apiError.errors.length > 0) {
          const fieldErrors: typeof formErrors = {};
          apiError.errors.forEach((err: any) => {
            if (err.field === 'username') {
              fieldErrors.username = err.message;
            } else if (err.field === 'password') {
              fieldErrors.password = err.message;
            } else {
              fieldErrors.general = err.message;
            }
          });
          setFormErrors(fieldErrors);
          toast.error('Erreurs de validation détectées');
        } else {
          // General API error
          const errorMessage = apiError.message || 'Échec de la connexion au calendrier Orange';
          setFormErrors({ general: errorMessage });
          toast.error(errorMessage);
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        // Handle Error objects
        const errorMessage = (error as Error).message;
        setFormErrors({ general: errorMessage });
        toast.error(errorMessage);
      } else {
        // Handle unknown errors
        const fallbackMessage = 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
        setFormErrors({ general: fallbackMessage });
        toast.error('Erreur inattendue');
        console.error('Unknown error structure:', error);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Card className="mb-6 lg:mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
            <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>Agenda</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          <p className="text-muted-foreground text-sm lg:text-base">
            Connectez votre agenda personnel (Google Agenda, Outlook, etc.) pour synchroniser automatiquement vos disponibilités et éviter les doublons de réservation.
          </p>
          <Button 
            className="text-white hover:opacity-90 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6 py-3 lg:py-2"
            style={{ backgroundColor: (orangeConnectionStatus || microsoftConnectionStatus || googleConnectionStatus) ? '#16a34a' : '#3A7B59' }}
            onClick={() => setIsCalendarDialogOpen(true)}
          >
            {(orangeConnectionStatus || microsoftConnectionStatus || googleConnectionStatus) ? (
              <>
                <CalendarCheck size={16} className="mr-2" />
                Agenda connecté
              </>
            ) : (
              <>
                <Calendar size={16} className="mr-2" />
                Connecter mon agenda
              </>
            )}
          </Button>
          
            {orangeConnectionStatus && (
              <div className="flex items-center justify-between gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={16} className="text-green-600" />
                  <p className="text-sm text-green-700">
                    Orange Calendar connecté ({orangeConnectionStatus.username})
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOrangeDisconnect}
                  disabled={isConnecting}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 text-xs px-3 py-1"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <Unplug size={12} className="mr-1" />
                      Déconnecter
                    </>
                  )}
                </Button>
              </div>
            )}

            {microsoftConnectionStatus && (
              <div className="flex items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={16} className="text-blue-600" />
                  <p className="text-sm text-blue-700">
                    Microsoft Calendar connecté ({microsoftConnectionStatus.displayName || microsoftConnectionStatus.mail})
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMicrosoftDisconnect}
                  disabled={isMicrosoftConnecting}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 text-xs px-3 py-1"
                >
                  {isMicrosoftConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <Unplug size={12} className="mr-1" />
                      Déconnecter
                    </>
                  )}
                </Button>
              </div>
            )}

            {googleConnectionStatus && (
              <div className="flex items-center justify-between gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mt-2">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={16} className="text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Google Calendar connecté ({googleConnectionStatus.name || googleConnectionStatus.email})
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGoogleDisconnect}
                  disabled={isGoogleConnecting}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 text-xs px-3 py-1"
                >
                  {isGoogleConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <Unplug size={12} className="mr-1" />
                      Déconnecter
                    </>
                  )}
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Calendar Connection Dialog */}
      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md h-auto overflow-hidden flex flex-col rounded-xl shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
          {/* Enhanced Header */}
          <DialogHeader className="relative text-white p-4 sm:p-6 -mx-6 -mt-6 mb-4 sm:mb-6 rounded-t-xl bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] shrink-0">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
                Connecter votre agenda
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Calendar Options */}
          <div className="flex-1 px-6 py-2">
            <div className="space-y-4 w-full">
              <p className="text-sm text-gray-600 text-center mb-6">
                Choisissez votre fournisseur de calendrier pour synchroniser vos disponibilités
              </p>

              {/* Orange Calendar */}
              <Button
                onClick={() => handleCalendarConnect('Orange')}
                variant="outline"
                disabled={isConnecting}
                className={`w-full flex items-center justify-start p-4 h-auto border-2 transition-all duration-200 ${
                  orangeConnectionStatus 
                    ? 'border-red-300 hover:border-red-500 hover:bg-red-50' 
                    : 'border-gray-200 hover:border-[#3A7B59] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                      orangeConnectionStatus 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      {orangeConnectionStatus ? (
                        <Unplug className="w-5 h-5 text-red-600" />
                      ) : (
                        <CalendarDays className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`font-medium ${orangeConnectionStatus ? 'text-red-700' : 'text-gray-700'}`}>
                        Calendrier Orange
                      </span>
                      {orangeConnectionStatus && (
                        <span className="text-xs text-green-600">
                          Connecté ({orangeConnectionStatus.username})
                        </span>
                      )}
                    </div>
                  </div>
                  {isConnecting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  )}
                </div>
              </Button>

              {/* OVH Calendar */}
              {/* <Button
                onClick={() => handleCalendarConnect('OVH')}
                variant="outline"
                className="w-full flex items-center justify-start p-4 h-auto border-2 border-gray-200 hover:border-[#3A7B59] hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Calendrier OVH</span>
                </div>
              </Button> */}

              {/* Microsoft Calendar */}
              <Button
                onClick={() => handleCalendarConnect('Microsoft')}
                variant="outline"
                disabled={isMicrosoftConnecting}
                className={`w-full flex items-center justify-start p-4 h-auto border-2 transition-all duration-200 ${
                  microsoftConnectionStatus 
                    ? 'border-red-300 hover:border-red-500 hover:bg-red-50' 
                    : 'border-gray-200 hover:border-[#3A7B59] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                      microsoftConnectionStatus 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      {microsoftConnectionStatus ? (
                        <Unplug className="w-5 h-5 text-red-600" />
                      ) : (
                        <CalendarClock className="w-5 h-5 text-blue-700" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`font-medium ${microsoftConnectionStatus ? 'text-red-700' : 'text-gray-700'}`}>
                        Calendrier Microsoft / OVH
                      </span>
                      {microsoftConnectionStatus && (
                        <span className="text-xs text-green-600">
                          Connecté ({microsoftConnectionStatus.displayName || microsoftConnectionStatus.mail})
                        </span>
                      )}
                    </div>
                  </div>
                  {isMicrosoftConnecting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  )}
                </div>
              </Button>

              {/* Google Calendar */}
              <Button
                onClick={() => handleCalendarConnect('Google')}
                variant="outline"
                disabled={isGoogleConnecting}
                className={`w-full flex items-center justify-start p-4 h-auto border-2 transition-all duration-200 ${
                  googleConnectionStatus 
                    ? 'border-red-300 hover:border-red-500 hover:bg-red-50' 
                    : 'border-gray-200 hover:border-[#3A7B59] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                      googleConnectionStatus 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      {googleConnectionStatus ? (
                        <Unplug className="w-5 h-5 text-red-600" />
                      ) : (
                        <CalendarCheck className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`font-medium ${googleConnectionStatus ? 'text-red-700' : 'text-gray-700'}`}>
                        Google Calendar
                      </span>
                      {googleConnectionStatus && (
                        <span className="text-xs text-green-600">
                          Connecté ({googleConnectionStatus.name || googleConnectionStatus.email})
                        </span>
                      )}
                    </div>
                  </div>
                  {isGoogleConnecting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex justify-center pt-4 sm:pt-6 px-6 pb-6 border-t border-gray-200 -mx-6 -mb-6">
            <Button 
              onClick={() => setIsCalendarDialogOpen(false)}
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border-2 border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Orange Login Modal */}
      <Dialog open={isOrangeLoginOpen} onOpenChange={setIsOrangeLoginOpen}>
        <DialogContent className="w-[95vw] max-w-md h-auto overflow-hidden flex flex-col rounded-xl shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
          {/* Enhanced Header */}
          <DialogHeader className="relative text-white p-4 sm:p-6 -mx-6 -mt-6 mb-4 sm:mb-6 rounded-t-xl bg-gradient-to-r from-orange-500 to-orange-600 shrink-0">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
                Connexion Orange Calendar
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Login Form */}
          <div className="flex-1 px-6 py-2">
            <div className="space-y-6 w-full">
              <p className="text-sm text-gray-600 text-center mb-6">
                Connectez-vous à votre compte Orange pour synchroniser votre calendrier
              </p>

              {/* General Error Message */}
              {formErrors.general && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <AlertCircle size={16} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{formErrors.general}</p>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User size={14} className="shrink-0" />
                  Email Orange *
                </Label>
                <Input
                  type="email"
                  value={orangeCredentials.username}
                  onChange={(e) => {
                    setOrangeCredentials(prev => ({ ...prev, username: e.target.value }));
                    clearFieldError('username');
                  }}
                  placeholder="votre.email@orange.fr"
                  className={`w-full text-sm sm:text-base border-2 focus:border-orange-500 rounded-lg h-11 sm:h-auto ${
                    formErrors.username ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  disabled={isConnecting}
                />
                {formErrors.username && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle size={14} />
                    <p className="text-xs">{formErrors.username}</p>
                  </div>
                )}
                {!formErrors.username && (
                  <p className="text-xs text-gray-500">
                    Utilisez votre adresse email Orange complète
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock size={14} className="shrink-0" />
                  Mot de passe *
                </Label>
                <Input
                  type="password"
                  value={orangeCredentials.password}
                  onChange={(e) => {
                    setOrangeCredentials(prev => ({ ...prev, password: e.target.value }));
                    clearFieldError('password');
                  }}
                  placeholder="Votre mot de passe Orange"
                  className={`w-full text-sm sm:text-base border-2 focus:border-orange-500 rounded-lg h-11 sm:h-auto ${
                    formErrors.password ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  disabled={isConnecting}
                />
                {formErrors.password && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle size={14} />
                    <p className="text-xs">{formErrors.password}</p>
                  </div>
                )}
                {!formErrors.password && (
                  <p className="text-xs text-gray-500">
                    Mot de passe de votre compte Orange Mail
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 px-6 pb-6 border-t border-gray-200 -mx-6 -mb-6">
            <Button 
              onClick={() => setIsOrangeLoginOpen(false)}
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border-2 border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base"
            >
              Annuler
            </Button>
            
            <Button 
              onClick={handleOrangeLogin}
              disabled={!orangeCredentials.username || !orangeCredentials.password || isConnecting}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </>
              ) : (
                'Connecter'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};