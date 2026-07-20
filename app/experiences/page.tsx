import { Suspense } from 'react';
import ExperiencesPageClient from './ExperiencesPageClient';
import { experiencePath, fetchPublicServicesPage } from '@/lib/seo/fetch-public';
import { JsonLdScript, collectionPageJsonLd } from '@/lib/seo/json-ld';
import { buildCanonical, slugify } from '@/lib/seo/site';
import type { PublicService } from '@/services/domain-profile.service';

export default async function ExperiencesPage() {
  const data = await fetchPublicServicesPage(1, 12);
  const initialServices = (data?.services as PublicService[]) ?? [];
  const initialTotalPages = data?.pagination.totalPages ?? 1;

  const collectionJsonLd = collectionPageJsonLd({
    name: 'Expériences œnotouristiques',
    path: '/experiences',
    items: initialServices
      .filter((service) => service.domain?.slug || service.domain?.domainId)
      .map((service) => {
        const regionName =
          service.domain.location?.region ||
          service.domain.location?.city ||
          service.domain.domainName ||
          'domaine';
        const path = experiencePath(
          slugify(regionName),
          service.domain.slug || service.domain.domainId,
        );
        return { name: service.serviceName, url: buildCanonical(path) };
      }),
  });

  return (
    <>
      <JsonLdScript data={collectionJsonLd} />
      <Suspense fallback={null}>
        <ExperiencesPageClient
          initialServices={initialServices}
          initialTotalPages={initialTotalPages}
        />
      </Suspense>
    </>
  );
}
