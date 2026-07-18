import type { Metadata } from 'next';
import { Suspense } from 'react';
import { permanentRedirect } from 'next/navigation';
import RegionPageClient from './RegionPageClient';
import { fetchRegionByName } from '@/lib/seo/fetch-public';
import { buildPageMetadata, decodeRouteParam, slugify } from '@/lib/seo/site';
import { JsonLdScript, breadcrumbJsonLd, regionItemListJsonLd } from '@/lib/seo/json-ld';
import type { Domain, Region } from '@/services/region.service';

type PageProps = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const regionName = decodeRouteParam(name);
  const data = await fetchRegionByName(regionName, 1, 5);
  const displayName = data?.region?.denom || regionName;
  const canonicalSlug = data?.region?.slug || slugify(displayName);

  return buildPageMetadata({
    title: `${displayName} : sur la route des vins`,
    description: `Découvrez les domaines viticoles et expériences œnotouristiques en ${displayName}. Réservez une visite ou une dégustation près de chez vous.`,
    path: `/region/${canonicalSlug}`,
  });
}

export default async function RegionPage({ params }: PageProps) {
  const { name } = await params;
  const regionName = decodeRouteParam(name);
  const data = await fetchRegionByName(regionName, 1, 5);

  // Old-style links (raw region name, percent-encoded, or a non-canonical slug)
  // permanently redirect to the canonical slug URL.
  if (data?.region?.slug && data.region.slug !== name) {
    permanentRedirect(`/region/${data.region.slug}`);
  }

  const displayName = data?.region?.denom || regionName;
  const canonicalSlug = data?.region?.slug || slugify(displayName);

  const initialRegion = (data?.region as Region | null) ?? null;
  const initialDomains = (data?.domains as Domain[]) ?? [];
  const initialTotalPages = data?.totalPages ?? 0;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: 'France', path: '/regions' },
            { name: displayName, path: `/region/${canonicalSlug}` },
          ]),
          regionItemListJsonLd(
            displayName,
            canonicalSlug,
            initialDomains.map((domain) => ({
              domainName: domain.domainName,
              domainId: domain.domainId,
              domainSlug: domain.slug,
            })),
          ),
        ]}
      />
      <Suspense fallback={null}>
        <RegionPageClient
          regionName={regionName}
          initialRegion={initialRegion}
          initialDomains={initialDomains}
          initialTotalPages={initialTotalPages}
        />
      </Suspense>
    </>
  );
}
