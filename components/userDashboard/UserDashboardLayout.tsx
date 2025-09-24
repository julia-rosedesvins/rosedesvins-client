"use client"

import { ReactNode, useEffect, useState } from "react"
import { Header } from "./Header"
import { Navigation } from "./Navigation"
import { useUser } from "@/contexts/UserContext"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface UserDashboardLayoutProps {
  children: ReactNode
  title?: string
}

export default function UserDashboardLayout({ children, title }: UserDashboardLayoutProps) {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to check if subscription needs warning
  const shouldShowSubscriptionWarning = () => {
    if (!mounted || !user?.subscription) return false;
    
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    // Show warning if subscription is inactive or expired
    return !user.subscription.isActive || now > endDate;
  };

  // Get warning message based on subscription status
  const getWarningMessage = () => {
    if (!user?.subscription) return '';
    
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    if (!user.subscription.isActive) {
      return 'Votre abonnement est actuellement inactif. Contactez notre équipe pour le réactiver.';
    } else if (now > endDate) {
      const daysExpired = Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Votre abonnement a expiré il y a ${daysExpired} jour${daysExpired > 1 ? 's' : ''}. Renouvelez votre abonnement pour continuer à utiliser nos services.`;
    }
    
    return '';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-6 py-4" style={{ backgroundColor: '#3A7B59', color: 'white' }}>
          <div className="container mx-auto">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white/20 rounded"></div>
              <h1 className="text-lg font-semibold">Rose des Vins</h1>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header />
      
      {/* Navigation Component */}
      <Navigation />

      {/* Subscription Warning Alert */}
      {shouldShowSubscriptionWarning() && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">
                  {getWarningMessage()}
                </p>
                <div className="mt-2">
                  <Link 
                    href="/dashboard/my-account"
                    className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                  >
                    Voir mon abonnement →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  )
}
