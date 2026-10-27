import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'FAQ',
  description: 'Questions fréquentes sur Rose des Vins, les réservations d\'expériences œnotouristiques et l\'outil pour domaines viticoles.',
  path: '/faqs',
});

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
