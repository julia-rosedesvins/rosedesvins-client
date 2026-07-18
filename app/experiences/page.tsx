import { Suspense } from 'react';
import ExperiencesPageClient from './ExperiencesPageClient';
import { fetchPublicServicesPage } from '@/lib/seo/fetch-public';
import type { PublicService } from '@/services/domain-profile.service';

export default async function ExperiencesPage() {
  const data = await fetchPublicServicesPage(1, 12);
  const initialServices = (data?.services as PublicService[]) ?? [];
  const initialTotalPages = data?.pagination.totalPages ?? 1;

  return (
    <Suspense fallback={null}>
      <ExperiencesPageClient
        initialServices={initialServices}
        initialTotalPages={initialTotalPages}
      />
    </Suspense>
  );
}
