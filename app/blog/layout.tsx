import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Guide oenotouristique, actu et conseils de dégustation',
  description:
    "Retrouvez sur le blog Rose des Vins des articles sur l'oenotourisme, les dernières actualités du vin, conseils et les tendances des vignobles français.",
  path: '/blog',
  absolute: true,
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
