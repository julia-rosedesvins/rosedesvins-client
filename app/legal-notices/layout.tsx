import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Mentions légales',
  description: 'Mentions légales du site Rose des Vins : éditeur, hébergement, propriété intellectuelle et protection des données.',
  path: '/legal-notices',
});

export default function LegalNoticesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
