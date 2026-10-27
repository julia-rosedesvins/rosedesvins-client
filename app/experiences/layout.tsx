import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Expériences œnotouristiques',
  description:
    'Parcourez les expériences œnotouristiques disponibles : visites de caves, dégustations commentées et activités viticoles partout en France.',
  path: '/experiences',
});

export default function ExperiencesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
