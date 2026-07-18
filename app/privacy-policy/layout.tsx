import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité de Rose des Vins : collecte, utilisation et protection de vos données personnelles.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
