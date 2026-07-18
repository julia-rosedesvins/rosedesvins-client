import { Suspense } from 'react';
import RegionsPageClient from './RegionsPageClient';
import { fetchParentRegionsPage } from '@/lib/seo/fetch-public';
import type { Region } from '@/services/region.service';

export default async function RegionsPage() {
  const data = await fetchParentRegionsPage(1, 15);
  const initialRegions = (data?.regions as Region[]) ?? [];
  const initialTotal = data?.total ?? 0;

  return (
    <Suspense fallback={null}>
      <RegionsPageClient initialRegions={initialRegions} initialTotal={initialTotal} />
    </Suspense>
  );
}
