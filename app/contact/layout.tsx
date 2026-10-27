import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Contact',
  description: 'Contactez Rose des Vins pour toute question sur les réservations, les domaines partenaires ou l\'outil de réservation.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
