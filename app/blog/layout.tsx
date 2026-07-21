import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Blog œnotourisme et viticulture',
  description:
    'Articles, conseils et actualités sur l\'œnotourisme, les domaines viticoles et les expériences autour du vin en France.',
  path: '/blog',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
