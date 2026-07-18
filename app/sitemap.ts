import type { MetadataRoute } from 'next';
import { fetchAllSitemapPaths } from '@/lib/seo/fetch-public';
import { SITE_URL } from '@/lib/seo/site';

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

  const { regions, experiences } = await fetchAllSitemapPaths();

  const regionEntries: MetadataRoute.Sitemap = regions.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.updatedAt ? new Date(entry.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const experienceEntries: MetadataRoute.Sitemap = experiences.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.updatedAt ? new Date(entry.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticEntries, ...regionEntries, ...experienceEntries];
}
