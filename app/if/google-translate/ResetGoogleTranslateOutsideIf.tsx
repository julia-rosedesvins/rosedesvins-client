'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  GOOG_TRANS_ACTIVE_FLAG,
  clearGoogTransCookie,
  teardownGoogleTranslateArtifacts,
} from '@/app/if/google-translate/AutoGoogleTranslate';

const RELOAD_FLAG = 'rdv-gt-reset-reload';

/**
 * Google Translate (used only under /if) sets a site-wide googtrans cookie and mutates the DOM.
 * When the user navigates back to the main site, clear that state so pages stay French.
 */
export function ResetGoogleTranslateOutsideIf() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/if')) return;

    let flagActive = false;
    try {
      flagActive = sessionStorage.getItem(GOOG_TRANS_ACTIVE_FLAG) === '1';
    } catch {
      // ignore
    }

    const cookieMatch = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    const googtrans = cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
    const cookieForcesEnglish = /\/en\b/i.test(googtrans);
    const domTranslated =
      document.documentElement.classList.contains('translated-ltr') ||
      document.documentElement.classList.contains('translated-rtl');

    const needsFrenchRestore = flagActive || cookieForcesEnglish || domTranslated;

    clearGoogTransCookie();
    teardownGoogleTranslateArtifacts();
    try {
      sessionStorage.removeItem(GOOG_TRANS_ACTIVE_FLAG);
    } catch {
      // ignore
    }

    if (!needsFrenchRestore) return;

    // Full reload is required: soft navigation keeps Google's mutated DOM.
    // Guard against a reload loop with sessionStorage.
    try {
      if (sessionStorage.getItem(RELOAD_FLAG) === '1') {
        sessionStorage.removeItem(RELOAD_FLAG);
        return;
      }
      sessionStorage.setItem(RELOAD_FLAG, '1');
    } catch {
      // If sessionStorage is unavailable, still attempt a single replace.
    }
    window.location.replace(window.location.href);
  }, [pathname]);

  return null;
}
