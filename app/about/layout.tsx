import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'À propos',
  description:
    'Découvrez l\'équipe Rose des Vins et notre mission : mettre la technologie au service des domaines viticoles et des amateurs de vin.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
