import { buildPageMetadata } from '@/lib/seo/site';
import { JsonLdScript, organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import HomePageClient from '@/components/HomePageClient';

export const metadata = buildPageMetadata({
  title: 'Rose des Vins : découverte et réservation de domaines viticoles',
  description:
    "Découvrez les domaines viticoles de France avec Rose des Vins : visites de caves, dégustations et réservation d'expériences œnotouristiques en ligne.",
  path: '/',
  absolute: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />
      <HomePageClient />
    </>
  );
}
