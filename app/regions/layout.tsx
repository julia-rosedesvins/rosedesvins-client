import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Régions viticoles de France',
  description:
    'Explorez les régions viticoles françaises et découvrez les domaines, vignobles et expériences œnotouristiques sur la route des vins.',
  path: '/regions',
});

export default function RegionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
