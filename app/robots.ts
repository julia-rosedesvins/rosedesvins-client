import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/login/',
          '/forgot-password/',
          '/reset-password/',
          '/if/',
          '/cancel-booking/',
          '/no-results',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
