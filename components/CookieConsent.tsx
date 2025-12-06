'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
      // Trigger animation after mount
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-[#2d5f44] to-[#3A7B59] backdrop-blur-sm">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">
                <Cookie className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-base md:text-lg mb-1">
                  Cookies & Confidentialité
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                  analyser le trafic du site et personnaliser le contenu.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200"
              >
                Refuser
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-white text-[#3A7B59] hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Accepter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
