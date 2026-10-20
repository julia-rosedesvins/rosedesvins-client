import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildBookingMetadata, OBJECT_ID_PATTERN, resolveBooking } from '@/lib/booking-routes';
import { NOINDEX_METADATA } from '@/lib/seo/site';
import ReservationPage from '@/app/if/booking-widget/[id]/[service_id]/reservation/page';
import LegacyReservationRedirect from './LegacyReservationRedirect';

type Params = { id: string; serviceId: string };

const isLegacy = ({ id, serviceId }: Params) =>
  OBJECT_ID_PATTERN.test(id) && OBJECT_ID_PATTERN.test(serviceId);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await params;
  if (isLegacy(resolved)) return NOINDEX_METADATA;
  return buildBookingMetadata(await resolveBooking(resolved.id, resolved.serviceId), 'reservation');
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (isLegacy(resolved)) {
    return <LegacyReservationRedirect id={resolved.id} serviceId={resolved.serviceId} />;
  }
  if (!(await resolveBooking(resolved.id, resolved.serviceId))) notFound();
  return <ReservationPage />;
}
