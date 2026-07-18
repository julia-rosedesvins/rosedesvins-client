import { buildPageMetadata } from '@/lib/seo/site';

export const metadata = buildPageMetadata({
  title: 'Outil de réservation pour domaines viticoles',
  description:
    'L\'outil de réservation Rose des Vins permet aux domaines viticoles d\'accepter des réservations en ligne 24h/24 via un widget intégrable.',
  path: '/outil-reservation',
});

export default function OutilReservationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
