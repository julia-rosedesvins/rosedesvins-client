import { buildPageMetadata } from '@/lib/seo/site';
import { JsonLdScript, organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { fetchLatestPosts } from '@/lib/wordpress/fetch-posts';
import HomePageClient from '@/components/HomePageClient';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Rose des Vins : Dégustation et visite de domaines',
  description:
    'Découvrez les domaines viticoles avec Rose des Vins : réservez dégustations de vin, visites de caves et autres expériences oenotouristiques.',
  path: '/',
  absolute: true,
});

export default async function HomePage() {
  const blogPosts = await fetchLatestPosts(6);

  return (
    <>
      <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />
      <HomePageClient blogPosts={blogPosts} />
    </>
  );
}
