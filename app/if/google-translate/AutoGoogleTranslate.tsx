'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GOOGLE_TRANSLATE_ENABLED } from './config';

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

export function prefersEnglish(): boolean {
  if (typeof navigator === 'undefined') return false;
  // Only the PRIMARY language matters here — navigator.languages is a full
  // fallback preference list and very commonly includes English (en, en-US,
  // en-GB, ...) even when the browser's actual UI/primary language is French.
  // Checking the whole list with .some(...) caused false positives: a user
  // with languages = ['fr', 'en-GB', 'en-US', 'en', 'ur'] would incorrectly
  // be detected as preferring English.
  const primary = navigator.language || navigator.languages?.[0];
  const result = !!primary && primary.toLowerCase().startsWith('en');
  console.log('[gt-debug] prefersEnglish()', { primary, languages: navigator.languages, result });
  return result;
}

function isDomTranslatedToEnglish(): boolean {
  if (typeof document === 'undefined') return false;
  const ltr = document.documentElement.classList.contains('translated-ltr');
  const rtl = document.documentElement.classList.contains('translated-rtl');
  const result = ltr || rtl;
  console.log('[gt-debug] isDomTranslatedToEnglish()', { ltr, rtl, result });
  return result;
}

/**
 * Whether the page should use English UI strings (calendar labels, CTA copy, etc.).
 * When Google Translate is disabled, this always returns false (French source UI).
 */
export function useIsTranslatedToEnglish(): boolean {
  const [translated, setTranslated] = useState(
    () =>
      GOOGLE_TRANSLATE_ENABLED &&
      (prefersEnglish() || isDomTranslatedToEnglish()),
  );

  useEffect(() => {
    if (!GOOGLE_TRANSLATE_ENABLED) {
      setTranslated(false);
      return;
    }

    const update = () => {
      const next = prefersEnglish() || isDomTranslatedToEnglish();
      console.log('[gt-debug] useIsTranslatedToEnglish update()', { next, cookie: document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/)?.[1] });
      setTranslated(next);
    };
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return translated;
}

function setGoogTransCookie(value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `googtrans=${value};path=/;max-age=${maxAge}`;
  try {
    const host = window.location.hostname;
    if (host && host !== 'localhost') {
      document.cookie = `googtrans=${value};path=/;domain=${host};max-age=${maxAge}`;
    }
  } catch {
    // ignore
  }
}

/** Clear googtrans so translation does not leak onto the main (French) site. */
export function clearGoogTransCookie() {
  const expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const clear = (extra = '') => {
    document.cookie = `googtrans=;path=/;expires=${expire}${extra}`;
    document.cookie = `googtrans=;path=/;max-age=0${extra}`;
  };
  clear();
  try {
    const host = window.location.hostname;
    if (host && host !== 'localhost') {
      clear(`;domain=${host}`);
      const parts = host.split('.');
      if (parts.length >= 2) {
        clear(`;domain=.${parts.slice(-2).join('.')}`);
      }
    }
  } catch {
    // ignore
  }
}

const SCRIPT_ID = 'google-translate-element-script';
const STYLE_ID = 'google-translate-hide-banner';
export const GOOG_TRANS_ACTIVE_FLAG = 'rdv-gt-active';

/** Remove Google Translate chrome/script leftovers from the document. */
export function teardownGoogleTranslateArtifacts() {
  document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
  document.body.classList.remove('translated-ltr', 'translated-rtl');
  document.body.style.removeProperty('top');

  document
    .querySelectorAll(
      'iframe.goog-te-banner-frame, iframe.skiptranslate, body > .skiptranslate, #goog-gt-tt, .goog-te-spinner-pos, .goog-te-balloon-frame',
    )
    .forEach((el) => el.remove());

  document.getElementById(SCRIPT_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();

  try {
    delete window.googleTranslateElementInit;
  } catch {
    // ignore
  }
}

/**
 * Guards against overlapping retranslation attempts.
 */
let retranslateLock = false;

/**
 * Best-effort, one-directional nudge for Google's Website Translator after a
 * route change. Deliberately never toggles back to the source language first:
 * doing so (even briefly) causes a visible French flash mid-cycle, which is
 * worse than an occasional missed retranslation. If the combo already reads
 * `en` this is a no-op — screens are expected to translate their own dynamic
 * content manually (see the `isEnglish`/`useIsTranslatedToEnglish` pattern)
 * rather than depend on Google re-scanning React-driven DOM updates.
 */
function forceRetranslate(targetLang = 'en') {
  if (retranslateLock) return;
  const combo = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
  if (!combo || combo.value === targetLang) return;

  retranslateLock = true;
  combo.value = targetLang;
  combo.dispatchEvent(new Event('change', { bubbles: true }));
  setTimeout(() => {
    retranslateLock = false;
  }, 250);
}

/**
 * Google's Website Translator script + widget bootstrap asynchronously, so the
 * hidden `select.goog-te-combo` may not exist yet right after a route change.
 * Poll for it (script bootstrap can be slow on a cold iframe load) and apply
 * the one-directional nudge once it's available.
 */
function waitForComboAndRetranslate(targetLang = 'en', attemptsLeft = 30, intervalMs = 200) {
  const combo = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
  if (combo) {
    forceRetranslate(targetLang);
    return;
  }
  if (attemptsLeft <= 0) return;
  setTimeout(() => waitForComboAndRetranslate(targetLang, attemptsLeft - 1, intervalMs), intervalMs);
}

/**
 * When enabled and the browser prefers English, auto-apply Google Website Translator (fr → en).
 * When disabled, clears any stale translate state and renders nothing.
 */
export function AutoGoogleTranslate() {
  const pathname = usePathname();
  const isFirstPathnameRef = useRef(true);

  useEffect(() => {
    console.log('[gt-debug] AutoGoogleTranslate mount', {
      GOOGLE_TRANSLATE_ENABLED,
      navigatorLanguage: typeof navigator !== 'undefined' ? navigator.language : undefined,
      navigatorLanguages: typeof navigator !== 'undefined' ? navigator.languages : undefined,
      existingCookie: document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/)?.[1],
    });

    if (!GOOGLE_TRANSLATE_ENABLED) {
      clearGoogTransCookie();
      teardownGoogleTranslateArtifacts();
      try {
        sessionStorage.removeItem(GOOG_TRANS_ACTIVE_FLAG);
      } catch {
        // ignore
      }
      return;
    }

    if (!prefersEnglish()) {
      // Browser no longer prefers English (e.g. user switched language, or a
      // stale cookie/class survived from a previous English session). Clear
      // any leftover googtrans cookie and translated-* markup so the page
      // renders in French and useIsTranslatedToEnglish doesn't get fooled by
      // a stale `translated-ltr` class left over from before.
      console.log('[gt-debug] Browser does not prefer English — clearing googtrans cookie/artifacts, staying French');
      clearGoogTransCookie();
      teardownGoogleTranslateArtifacts();
      try {
        sessionStorage.removeItem(GOOG_TRANS_ACTIVE_FLAG);
      } catch {
        // ignore
      }
      return;
    }

    console.log('[gt-debug] Browser prefers English — setting googtrans=/fr/en cookie');
    setGoogTransCookie('/fr/en');
    try {
      sessionStorage.setItem(GOOG_TRANS_ACTIVE_FLAG, '1');
    } catch {
      // ignore
    }

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
        .goog-te-spinner-pos,
        .goog-te-spinner,
        .goog-te-spinner-animation,
        .goog-te-gadget-icon {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        body {
          top: 0 !important;
        }
        body > .skiptranslate {
          display: none !important;
        }
        iframe.goog-te-banner-frame,
        iframe.skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
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

    const hideTranslateChrome = () => {
      document
        .querySelectorAll(
          '.goog-te-spinner-pos, .goog-te-spinner, .goog-te-spinner-animation, iframe.goog-te-banner-frame, body > .skiptranslate',
        )
        .forEach((el) => {
          const node = el as HTMLElement;
          if (node.style.display === 'none') return;
          node.style.setProperty('display', 'none', 'important');
          node.style.setProperty('visibility', 'hidden', 'important');
          node.style.setProperty('opacity', '0', 'important');
          node.style.setProperty('pointer-events', 'none', 'important');
        });
      if (document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0', 'important');
      }
    };

    hideTranslateChrome();
    let hideScheduled = false;
    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((m) =>
        Array.from(m.addedNodes).some((node) => {
          if (!(node instanceof HTMLElement)) return false;
          return (
            node.matches?.(
              '.goog-te-spinner-pos, .goog-te-spinner, .goog-te-spinner-animation, iframe.goog-te-banner-frame, .skiptranslate',
            ) ||
            !!node.querySelector?.(
              '.goog-te-spinner-pos, .goog-te-spinner, .goog-te-spinner-animation, iframe.goog-te-banner-frame',
            )
          );
        }),
      );
      if (!relevant || hideScheduled) return;
      hideScheduled = true;
      requestAnimationFrame(() => {
        hideScheduled = false;
        hideTranslateChrome();
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

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

    return () => {
      observer.disconnect();
      clearGoogTransCookie();
      teardownGoogleTranslateArtifacts();
    };
  }, []);

  useEffect(() => {
    if (!GOOGLE_TRANSLATE_ENABLED) return;

    if (isFirstPathnameRef.current) {
      isFirstPathnameRef.current = false;
      return;
    }
    if (!prefersEnglish()) return;

    // One-directional nudge only — never toggles back to French first, so this
    // can never cause a visible language flash. Widget screens are expected to
    // translate their own dynamic content manually (isEnglish pattern).
    const timer = setTimeout(() => waitForComboAndRetranslate(), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!GOOGLE_TRANSLATE_ENABLED) {
    return null;
  }

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
