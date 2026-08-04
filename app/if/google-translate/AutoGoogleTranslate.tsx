'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

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

/** True once Google has actually translated the document (our widget or the browser's own "Translate this page"). */
function isDomTranslatedToEnglish(): boolean {
  if (typeof document === 'undefined') return false;
  return (
    document.documentElement.classList.contains('translated-ltr') ||
    document.documentElement.classList.contains('translated-rtl')
  );
}

/**
 * Whether the current page should be shown in English. This combines two signals:
 * - `prefersEnglish()`: the browser's language preference, which is what auto-triggers
 *   our own AutoGoogleTranslate widget.
 * - the DOM `translated-ltr`/`translated-rtl` marker Google adds once translation has
 *   actually run — this covers cases where translation happens through a different path
 *   than our widget (e.g. the visitor's browser offering its own "Translate this page"
 *   prompt), which our cookie/script logic never sees.
 *
 * Elements that hardcode French/English strings (calendar day names, CTA copy, etc.)
 * should read this instead of a one-time `prefersEnglish()` check so they stay in sync
 * even when translation is triggered/toggled after the initial render.
 */
export function useIsTranslatedToEnglish(): boolean {
  const [translated, setTranslated] = useState(
    () => prefersEnglish() || isDomTranslatedToEnglish(),
  );

  useEffect(() => {
    const update = () => setTranslated(prefersEnglish() || isDomTranslatedToEnglish());
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
 * Google's Website Translator only translates the DOM present when it initializes.
 * It does not automatically re-scan subtrees that Next.js swaps in on client-side
 * route changes (e.g. moving between /reservation, /booking, /checkout inside the
 * same widget layout), which otherwise leaves every step after the first untranslated.
 * The standard workaround is to force the hidden language <select> to re-fire its
 * change event, which makes the widget re-walk the current DOM.
 */
function fireComboChange(targetLang: string) {
  const combo = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
  if (!combo) return false;
  combo.value = targetLang;
  combo.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

// Extra delayed re-fires after the <select> is first found — Google's own change
// listener ships in a second async chunk (`el_main`) that can finish loading a beat
// after the <select> itself appears. Dispatching only once, the instant the element
// exists, can land before anyone is listening and silently do nothing.
const FOLLOW_UP_DELAYS_MS = [150, 400, 800, 1500, 3000, 5000];

function retriggerGoogleTranslate(targetLang = 'en', attemptsLeft = 15, intervalMs = 200) {
  if (fireComboChange(targetLang)) {
    FOLLOW_UP_DELAYS_MS.forEach((delay) => {
      setTimeout(() => fireComboChange(targetLang), delay);
    });
    return;
  }
  // The combo box may not exist yet if the translate script is still loading.
  if (attemptsLeft <= 0) return;
  setTimeout(() => retriggerGoogleTranslate(targetLang, attemptsLeft - 1, intervalMs), intervalMs);
}

/**
 * When the browser prefers English, auto-apply Google Website Translator (fr → en).
 * Otherwise leave the French source UI alone. Banner/gadget UI is hidden for embeds.
 */
export function AutoGoogleTranslate() {
  const pathname = usePathname();
  const isFirstPathnameRef = useRef(true);

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
      // The `googtrans` cookie normally makes Google auto-display English on init,
      // but when this widget is embedded via a cross-origin iframe, browsers treat
      // that cookie as third-party and silently refuse to set/read it — so nothing
      // ever gets translated even though the widget initialized fine. Force English
      // through the language <select> directly instead of depending on the cookie.
      retriggerGoogleTranslate();
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

  // Re-apply translation on every subsequent widget step (client-side route change).
  // The very first pathname is already covered by the mount effect above.
  useEffect(() => {
    if (isFirstPathnameRef.current) {
      isFirstPathnameRef.current = false;
      return;
    }
    if (!prefersEnglish()) return;

    // Let the newly rendered route paint before forcing a rescan.
    const timer = setTimeout(() => retriggerGoogleTranslate(), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

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
