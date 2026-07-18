import { buildCanonical, SITE_NAME, SITE_URL } from './site';

type JsonLd = Record<string, unknown>;

export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/regions?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonical(item.path),
    })),
  };
}

export function regionItemListJsonLd(
  regionName: string,
  regionSlug: string,
  domains: Array<{ domainName: string; domainId: string | null; domainSlug?: string | null }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Domaines viticoles en ${regionName}`,
    itemListElement: domains
      .filter((d) => d.domainSlug || d.domainId)
      .slice(0, 20)
      .map((domain, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: domain.domainName,
        url: buildCanonical(
          `/experience/${regionSlug}/${domain.domainSlug || domain.domainId}`,
        ),
      })),
  };
}

export function wineryJsonLd(params: {
  name: string;
  description: string;
  regionSlug: string;
  domainSlug: string;
  image?: string | null;
  address?: string | null;
  city?: string | null;
}) {
  const url = buildCanonical(
    `/experience/${params.regionSlug}/${params.domainSlug}`,
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Winery',
    name: params.name,
    description: params.description,
    url,
    image: params.image || undefined,
    address: params.address || params.city
      ? {
          '@type': 'PostalAddress',
          streetAddress: params.address || undefined,
          addressLocality: params.city || undefined,
          addressCountry: 'FR',
        }
      : undefined,
  };
}
