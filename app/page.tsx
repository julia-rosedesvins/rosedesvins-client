import { buildPageMetadata } from '@/lib/seo/site';
import { JsonLdScript, organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import HomePageClient from '@/components/HomePageClient';

export const metadata = buildPageMetadata({
  title: 'Rose des Vins : découverte et réservation de domaines viticoles',
  description:
    'Découvrez les vignobles français avec Rose des Vins : visitez caves et domaines viticoles, participez à des dégustations et réservez vos expériences oenotouristiques en ligne. Découvrez caves et domaines viticoles avec Rose des Vins, participez à des dégustations et réservez vos expériences oenotouristiques en quelques clics.',
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
