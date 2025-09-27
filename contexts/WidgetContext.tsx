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
      
      const response = await widgetService.getWidgetData({
        userId: uid,
        serviceId: sid,
      });
      
      setWidgetData(response.data);
      
      // Set dynamic color from API response
      if (response.data.domainProfile.colorCode) {
        setColorCode(response.data.domainProfile.colorCode);
      }
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to fetch widget data');
      console.error('Widget data fetch error:', error);
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
