'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { widgetService, WidgetDataResponse, ApiError } from '@/services/widget.service';

interface WidgetContextType {
  widgetData: WidgetDataResponse['data'] | null;
  loading: boolean;
  error: string | null;
  colorCode: string;
  fetchWidgetData: (userId: string, serviceId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

interface WidgetProviderProps {
  children: ReactNode;
  userId: string;
  serviceId: string;
}

export function WidgetProvider({ children, userId, serviceId }: WidgetProviderProps) {
  const [widgetData, setWidgetData] = useState<WidgetDataResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [colorCode, setColorCode] = useState<string>('#3A7E53'); // Default color

  const fetchWidgetData = async (uid: string, sid: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching widget data for userId:', uid, 'serviceId:', sid);
      
      const response = await widgetService.getWidgetData({
        userId: uid,
        serviceId: sid,
      });
      
      console.log('Widget data response:', response);
      
      setWidgetData(response.data);
      
      // Set dynamic color from API response
      if (response.data.domainProfile.colorCode) {
        setColorCode(response.data.domainProfile.colorCode);
      }
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error type:', typeof err);
      console.error('Error constructor:', err?.constructor?.name);
      
      let errorMessage = 'Failed to fetch widget data';
      
      // Handle different error types
      if (err && typeof err === 'object') {
        const error = err as any;
        
        // Check if it's an API error response from our backend
        if (error.success === false && error.message) {
          // Handle nested message structure from backend
          if (typeof error.message === 'object' && error.message.message) {
            let message = error.message.message;
            // Provide more user-friendly messages for common errors
            if (message.includes('subscription is not active')) {
              message = 'Votre abonnement n\'est pas actif ou a expiré. Veuillez contacter l\'administrateur.';
            } else if (message.includes('User not found')) {
              message = 'Utilisateur introuvable. Veuillez vérifier l\'URL.';
            } else if (message.includes('Service not found')) {
              message = 'Service introuvable. Veuillez vérifier l\'URL.';
            }
            errorMessage = message;
          } else if (typeof error.message === 'string') {
            errorMessage = error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.statusText) {
          errorMessage = `HTTP Error: ${error.response.statusText}`;
        } else if (error.code) {
          errorMessage = `Network Error: ${error.code}`;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      console.error('Widget data fetch error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    if (userId && serviceId) {
      await fetchWidgetData(userId, serviceId);
    }
  };

  useEffect(() => {
    if (userId && serviceId) {
      fetchWidgetData(userId, serviceId);
    }
  }, [userId, serviceId]);

  return (
    <WidgetContext.Provider
      value={{
        widgetData,
        loading,
        error,
        colorCode,
        fetchWidgetData,
        refetch,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidget(): WidgetContextType {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error('useWidget must be used within a WidgetProvider');
  }
  return context;
}
