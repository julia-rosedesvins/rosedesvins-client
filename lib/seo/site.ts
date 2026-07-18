import type { Metadata } from 'next';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://rosedesvins.co';

export const SITE_NAME = 'Rose des Vins';

export const DEFAULT_DESCRIPTION =
  'Découvrez les domaines viticoles de France et réservez une expérience œnotouristique en quelques clics. Visites, dégustations et escapades dans les plus belles régions viticoles.';

export const DEFAULT_OG_IMAGE = '/assets/hero.webp';

export const LOCALE = 'fr_FR';

export function buildCanonical(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Mirrors the backend's slugify (server/src/common/utils/slug.util.ts):
 * NFD-normalize, strip diacritics, lowercase, replace non-alphanumerics with
 * `-`, collapse/trim hyphens. Used client-side for sitemap generation and to
 * detect non-canonical (legacy) URL params that should redirect to a slug.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function decodeRouteParam(value: string): string {
  let decoded = value.replace(/\+/g, ' ');
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

export interface PageMetadataOptions {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  /** Use when the title already includes the brand and must not get the layout template suffix. */
  absolute?: boolean;
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  absolute = false,
}: PageMetadataOptions): Metadata {
  const canonical = buildCanonical(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: LOCALE,
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [{ url: ogImage, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false },
};
