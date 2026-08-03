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

export function prefersEnglish(): boolean {
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
 * When the browser prefers English, auto-apply Google Website Translator (fr → en).
 * Otherwise leave the French source UI alone. Banner/gadget UI is hidden for embeds.
 */
export function AutoGoogleTranslate() {
  useEffect(() => {
    if (!prefersEnglish()) return;

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
        /* Loading spinner / progress overlay injected while translating */
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

    // Aggressively hide spinner/banner nodes Google injects dynamically
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
      // Leaving /if — do not leave translation enabled for the rest of the site
      clearGoogTransCookie();
      teardownGoogleTranslateArtifacts();
    };
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
