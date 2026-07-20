import { Suspense } from 'react';
import RegionsPageClient from './RegionsPageClient';
import { fetchParentRegionsPage } from '@/lib/seo/fetch-public';
import { JsonLdScript, collectionPageJsonLd } from '@/lib/seo/json-ld';
import { buildCanonical, slugify } from '@/lib/seo/site';
import type { Region } from '@/services/region.service';

export default async function RegionsPage() {
  const data = await fetchParentRegionsPage(1, 15);
  const initialRegions = (data?.regions as Region[]) ?? [];
  const initialTotal = data?.total ?? 0;

  const collectionJsonLd = collectionPageJsonLd({
    name: 'Régions viticoles de France',
    path: '/regions',
    items: initialRegions.map((region) => ({
      name: region.denom,
      url: buildCanonical(`/region/${region.slug || slugify(region.denom)}`),
    })),
  });

  return (
    <>
      <JsonLdScript data={collectionJsonLd} />
      <Suspense fallback={null}>
        <RegionsPageClient initialRegions={initialRegions} initialTotal={initialTotal} />
      </Suspense>
    </>
  );
}
