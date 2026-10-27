import { slugify } from '@/lib/seo/site';

/** Pure (client + server safe) helpers for readable booking URLs. */

export type BookingStep =
  | 'reservation'
  | 'booking'
  | 'booking-confirmation'
  | 'checkout'
  | 'confirmation-success';

export const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

interface SlugService {
  _id: string;
  name: string;
}

const serviceBaseSlug = (name: string) => slugify(name || '') || 'experience';

/**
 * Readable, stable slug for a service. Computed (not stored): the slugified name, with the
 * last 6 id characters appended only when another service of the same domain would collide.
 */
export function getServiceSlug(service: SlugService, allServices: SlugService[]): string {
  const base = serviceBaseSlug(service.name);
  const collides = allServices.some(
    (other) => String(other._id) !== String(service._id) && serviceBaseSlug(other.name) === base,
  );
  return collides ? `${base}-${String(service._id).slice(-6)}` : base;
}

/** Resolve a service from its computed slug (a raw service id is accepted too). */
export function findServiceBySlug<T extends SlugService>(services: T[], slugOrId: string): T | undefined {
  return (
    services.find((s) => getServiceSlug(s, services) === slugOrId) ??
    services.find((s) => String(s._id) === slugOrId)
  );
}

/** `/reservation/{domain}/{service}` (details) or `/reservation/{domain}/{service}/{step}`. */
export function bookingPath(domainSlug: string, serviceSlug: string, step?: BookingStep): string {
  const base = `/reservation/${domainSlug}/${serviceSlug}`;
  return step && step !== 'reservation' ? `${base}/${step}` : base;
}
