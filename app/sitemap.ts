import type { MetadataRoute } from 'next';
import {
  experiencePath,
  fetchAllParentRegions,
  fetchAllPublicServices,
} from '@/lib/seo/fetch-public';
import { SITE_URL, decodeRouteParam, slugify } from '@/lib/seo/site';

const STATIC_ROUTES = [
  '/',
  '/regions',
  '/experiences',
  '/about',
  '/contact',
  '/outil-reservation',
  '/faqs',
  '/legal-notices',
  '/privacy-policy',
  '/terms-of-service',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const [regions, services] = await Promise.all([
    fetchAllParentRegions(),
    fetchAllPublicServices(),
  ]);

  const regionEntries: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${SITE_URL}/region/${region.slug || slugify(region.denom)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const seenExperienceUrls = new Set<string>();
  const experienceEntries: MetadataRoute.Sitemap = [];

  for (const service of services) {
    const domainId = service.domain?.domainId;
    const domainSlug = service.domain?.slug;
    if (!domainId && !domainSlug) continue;

    const regionName =
      service.domain.location?.region ||
      service.domain.location?.city ||
      decodeRouteParam(service.domain.domainName || 'domaine');

    const path = experiencePath(slugify(regionName), domainSlug || domainId);
    if (seenExperienceUrls.has(path)) continue;
    seenExperienceUrls.add(path);

    experienceEntries.push({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  return [...staticEntries, ...regionEntries, ...experienceEntries];
}
