import type { Metadata } from 'next';
import { Suspense } from 'react';
import { permanentRedirect } from 'next/navigation';
import RegionPageClient from './RegionPageClient';
import { fetchRegionByName } from '@/lib/seo/fetch-public';
import { getRegionDisplayName, getRegionPageMetadata } from '@/lib/seo/region-metadata';
import { buildPageMetadata, decodeRouteParam, slugify } from '@/lib/seo/site';
import { JsonLdScript, breadcrumbJsonLd, regionItemListJsonLd } from '@/lib/seo/json-ld';
import type { Domain, Region } from '@/services/region.service';

type PageProps = {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
};

function parsePageParam(page?: string): number {
  const parsed = Number(page);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  await searchParams;
  const { name } = await params;
  const regionName = decodeRouteParam(name);
  const data = await fetchRegionByName(regionName, 1, 5);
  const displayName = data?.region
    ? getRegionDisplayName(data.region.slug || regionName, data.region.denom)
    : getRegionDisplayName(regionName, regionName);
  const canonicalSlug = data?.region?.slug || slugify(displayName);
  const customMetadata = getRegionPageMetadata(canonicalSlug);

  if (customMetadata) {
    return buildPageMetadata({
      title: customMetadata.title,
      description: customMetadata.description,
      path: `/region/${canonicalSlug}`,
      absolute: true,
    });
  }

  const subtitle =
    data?.region?.subtitle?.trim() || 'sur la route des vins';
  const metaDescription =
    data?.region?.description?.trim()?.slice(0, 155) ||
    `Découvrez les domaines viticoles et expériences œnotouristiques en ${displayName}. Réservez une visite ou une dégustation près de chez vous.`;

  return buildPageMetadata({
    title: `${displayName} : ${subtitle}`.slice(0, 70),
    description: metaDescription,
    path: `/region/${canonicalSlug}`,
  });
}

export default async function RegionPage({ params, searchParams }: PageProps) {
  const { name } = await params;
  const { page: pageParam } = await searchParams;
  const initialPage = parsePageParam(pageParam);
  const regionName = decodeRouteParam(name);
  const data = await fetchRegionByName(regionName, initialPage, 5);

  // Old-style links (raw region name, percent-encoded, or a non-canonical slug)
  // permanently redirect to the canonical slug URL.
  if (data?.region?.slug && data.region.slug !== name) {
    const pageSuffix = initialPage > 1 ? `?page=${initialPage}` : '';
    permanentRedirect(`/region/${data.region.slug}${pageSuffix}`);
  }

  const displayName = data?.region
    ? getRegionDisplayName(data.region.slug || regionName, data.region.denom)
    : getRegionDisplayName(regionName, regionName);
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
          initialPage={initialPage}
        />
      </Suspense>
    </>
  );
}
