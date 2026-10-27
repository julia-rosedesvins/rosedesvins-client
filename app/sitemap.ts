import type { MetadataRoute } from 'next';
import { fetchAllSitemapPaths } from '@/lib/seo/fetch-public';
import { fetchBlogSitemapData } from '@/lib/wordpress/fetch-posts';
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

  const [sitemapPaths, blogSitemap] = await Promise.all([
    fetchAllSitemapPaths(),
    fetchBlogSitemapData(),
  ]);

  // Defend against a backend that hasn't been deployed with this endpoint yet (falls
  // through to a differently-shaped route) or any other API/shape mismatch — a broken
  // sitemap should never fail the whole production build.
  const regions = Array.isArray(sitemapPaths?.regions) ? sitemapPaths.regions : [];
  const experiences = Array.isArray(sitemapPaths?.experiences) ? sitemapPaths.experiences : [];
  const blogPosts = Array.isArray(blogSitemap?.posts) ? blogSitemap.posts : [];

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

  const blogLastModified = blogSitemap?.latestModified
    ? new Date(blogSitemap.latestModified)
    : now;

  const blogIndexEntry: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/blog`,
    lastModified: blogLastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  };

  const blogPaginationEntries: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, (blogSitemap?.totalPages ?? 1) - 1) },
    (_, index) => ({
      url: `${SITE_URL}/blog?page=${index + 2}`,
      lastModified: blogLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }),
  );

  const blogPostEntries: MetadataRoute.Sitemap = blogPosts.map((entry) => ({
    url: `${SITE_URL}/blog/${entry.slug}`,
    lastModified: entry.modified ? new Date(entry.modified) : blogLastModified,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...staticEntries,
    blogIndexEntry,
    ...blogPaginationEntries,
    ...regionEntries,
    ...experienceEntries,
    ...blogPostEntries,
  ];
}
