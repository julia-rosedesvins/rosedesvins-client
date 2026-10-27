import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildBookingMetadata, OBJECT_ID_PATTERN, resolveBooking } from '@/lib/booking-routes';
import { NOINDEX_METADATA } from '@/lib/seo/site';
import BookingConfirmationPage from '@/app/if/booking-widget/[id]/[service_id]/booking-confirmation/page';

type Params = { id: string; serviceId: string };

// Legacy id-based URLs only exist under /if/booking-widget; they have no step page here.
const isLegacy = ({ id, serviceId }: Params) =>
  OBJECT_ID_PATTERN.test(id) && OBJECT_ID_PATTERN.test(serviceId);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await params;
  if (isLegacy(resolved)) return NOINDEX_METADATA;
  return buildBookingMetadata(await resolveBooking(resolved.id, resolved.serviceId), 'booking-confirmation');
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const resolved = await params;
  if (isLegacy(resolved) || !(await resolveBooking(resolved.id, resolved.serviceId))) notFound();
  return <BookingConfirmationPage />;
}
