'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

function prefersEnglish(): boolean {
  if (typeof navigator === 'undefined') return false;
  const candidates = [
    ...(navigator.languages || []),
    navigator.language,
  ].filter(Boolean);
  return candidates.some((lang) => lang.toLowerCase().startsWith('en'));
}

function setGoogTransCookie(value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `googtrans=${value};path=/;max-age=${maxAge}`;
  // Also set without domain for iframe / localhost edge cases
  try {
    const host = window.location.hostname;
    if (host && host !== 'localhost') {
      document.cookie = `googtrans=${value};path=/;domain=${host};max-age=${maxAge}`;
    }
  } catch {
    // ignore
  }
}

const SCRIPT_ID = 'google-translate-element-script';
const STYLE_ID = 'google-translate-hide-banner';

/**
 * When the browser prefers English, auto-apply Google Website Translator (fr → en).
 * Otherwise leave the French source UI alone. Banner/gadget UI is hidden for embeds.
 */
export function AutoGoogleTranslate() {
  useEffect(() => {
    if (!prefersEnglish()) return;

    setGoogTransCookie('/fr/en');

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-te-gadget {
          display: none !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
        iframe.goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      // Avoid double-init if script reloads
      const host = document.getElementById('google_translate_element');
      if (host && host.childElementCount > 0) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'fr',
          includedLanguages: 'en,fr',
          autoDisplay: false,
        },
        'google_translate_element',
      );
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
      }}
    />
  );
}
