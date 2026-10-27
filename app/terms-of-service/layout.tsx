import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Conditions générales d\'utilisation',
  description: 'Conditions générales d\'utilisation de la plateforme Rose des Vins pour les visiteurs et les domaines viticoles.',
  path: '/terms-of-service',
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
