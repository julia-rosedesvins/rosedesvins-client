import { cache } from 'react';
import type { Metadata } from 'next';
import { fetchBookingProfileBySlug } from '@/lib/seo/fetch-public';
import { buildPageMetadata, decodeRouteParam } from '@/lib/seo/site';
import {
  bookingPath,
  findServiceBySlug,
  getServiceSlug,
  type BookingStep,
} from '@/lib/booking-slugs';

// Server-side booking route helpers. Pure helpers live in booking-slugs.ts (client safe).
export { bookingPath, findServiceBySlug, getServiceSlug, OBJECT_ID_PATTERN } from '@/lib/booking-slugs';
export type { BookingStep } from '@/lib/booking-slugs';

export interface ResolvedBooking {
  userId: string;
  serviceId: string;
  domainName: string;
  domainSlug: string;
  serviceSlug: string;
  serviceName: string;
  serviceDescription: string;
  serviceActive: boolean;
}

/** Resolve the slugs of a /reservation URL to the producer user id and service id. */
export const resolveBooking = cache(
  async (domainParam: string, serviceParam: string): Promise<ResolvedBooking | null> => {
    const domainSlug = decodeRouteParam(domainParam);
    const serviceSlugParam = decodeRouteParam(serviceParam);
    const response = await fetchBookingProfileBySlug(domainSlug);
    const profile = response?.data?.domainProfile;
    if (!profile?.userId) return null;

    const services = profile.services ?? [];
    const service = findServiceBySlug(services, serviceSlugParam);
    if (!service) return null;

    return {
      userId: String(profile.userId),
      serviceId: String(service._id),
      domainName: profile.domainName || 'Domaine viticole',
      domainSlug: profile.slug || domainSlug,
      serviceSlug: getServiceSlug(service, services),
      serviceName: service.name,
      serviceDescription: service.description || '',
      serviceActive: service.isActive !== false,
    };
  },
);

const STEP_TITLES: Record<BookingStep, (service: string, domain: string) => string> = {
  reservation: (service, domain) => `${service} - ${domain}`,
  booking: (service, domain) => `Réserver ${service} - ${domain}`,
  'booking-confirmation': (service, domain) => `Confirmer votre réservation : ${service} - ${domain}`,
  checkout: (service, domain) => `Paiement : ${service} - ${domain}`,
  'confirmation-success': (service, domain) => `Réservation confirmée : ${service} - ${domain}`,
};

const INDEXABLE_STEPS: BookingStep[] = ['reservation', 'booking'];

/** SEO metadata for a booking step. Only details and date/time steps of active services are indexable. */
export function buildBookingMetadata(booking: ResolvedBooking | null, step: BookingStep): Metadata {
  if (!booking) {
    return { title: 'Réservation', robots: { index: false, follow: false } };
  }

  const description =
    booking.serviceDescription.replace(/\s+/g, ' ').trim().slice(0, 155) ||
    `Réservez ${booking.serviceName} au ${booking.domainName} : choisissez votre date et votre horaire en quelques clics.`;

  return buildPageMetadata({
    title: STEP_TITLES[step](booking.serviceName, booking.domainName),
    description,
    path: bookingPath(booking.domainSlug, booking.serviceSlug, step),
    noIndex: !booking.serviceActive || !INDEXABLE_STEPS.includes(step),
  });
}
