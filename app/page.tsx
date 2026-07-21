import { buildPageMetadata } from '@/lib/seo/site';
import { JsonLdScript, organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { fetchLatestPosts } from '@/lib/wordpress/fetch-posts';
import HomePageClient from '@/components/HomePageClient';

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: 'Rose des Vins : réservez vos domaines viticoles',
  description:
    "Découvrez les plus beaux domaines viticoles de France avec Rose des Vins : visites de caves, dégustations et réservation d'expériences œnotouristiques en ligne.",
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
