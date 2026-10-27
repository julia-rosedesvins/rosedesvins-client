'use client';

import { useEffect, useState } from 'react';
import { useIsTranslatedToEnglish } from './AutoGoogleTranslate';

/**
 * User-entered content (service name/description, etc.) is stored in French
 * and rendered as-is by React. Google's Website Translator widget only scans
 * the DOM on initial load / route change, so text that arrives later via an
 * async fetch (like `widgetData.service.name`) often stays untranslated even
 * when the rest of the page switches to English. This calls Google's public
 * translation endpoint directly for that specific text so it can be shown in
 * English regardless of when it was fetched.
 */

const cache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

async function translateToEnglish(text: string): Promise<string> {
  const cached = cache.get(text);
  if (cached !== undefined) return cached;

  const existing = inFlight.get(text);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`,
      );
      if (!res.ok) return text;
      const data = await res.json();
      const chunks = Array.isArray(data?.[0]) ? data[0] : [];
      const translated = chunks.map((chunk: unknown) => (Array.isArray(chunk) ? chunk[0] : '')).join('');
      const result = translated || text;
      cache.set(text, result);
      return result;
    } catch {
      return text;
    } finally {
      inFlight.delete(text);
    }
  })();

  inFlight.set(text, promise);
  return promise;
}

/**
 * Returns `text` translated to English when the browser prefers English
 * (same detection used by the Google Translate widget elsewhere on the
 * site), otherwise returns `text` unchanged. Falls back to the original
 * French text while the translation request is in flight or if it fails.
 */
export function useTranslatedText(text?: string | null): string {
  const isEnglish = useIsTranslatedToEnglish();
  const source = text ?? '';
  const [translated, setTranslated] = useState(source);

  useEffect(() => {
    if (!isEnglish || !source.trim()) {
      setTranslated(source);
      return;
    }

    const cached = cache.get(source);
    if (cached !== undefined) {
      setTranslated(cached);
      return;
    }

    let cancelled = false;
    setTranslated(source);
    translateToEnglish(source).then((result) => {
      if (!cancelled) setTranslated(result);
    });

    return () => {
      cancelled = true;
    };
  }, [source, isEnglish]);

  return translated;
}
