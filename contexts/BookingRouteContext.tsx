'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import type { BookingStep } from '@/lib/booking-slugs';

export interface BookingRouteValue {
  /** `/reservation/{domainSlug}/{serviceSlug}` */
  basePath: string;
  /** Resolved ids, so the step pages do not need the legacy `/if/...` route params. */
  userId: string;
  serviceId: string;
  domainName: string;
  serviceName: string;
}

const BookingRouteContext = createContext<BookingRouteValue | null>(null);

export function BookingRouteProvider({
  value,
  children,
}: {
  value: BookingRouteValue;
  children: ReactNode;
}) {
  return <BookingRouteContext.Provider value={value}>{children}</BookingRouteContext.Provider>;
}

/** Route context set by the /reservation layout; null on the legacy /if widget routes. */
export function useBookingRouteValue(): BookingRouteValue | null {
  return useContext(BookingRouteContext);
}

/**
 * Ids used by the step pages: from the /reservation route context when present,
 * otherwise from the legacy /if/booking-widget/[id]/[service_id] route params.
 */
export function useResolvedBookingIds(
  params?: Promise<{ id: string; service_id: string }>,
): { id: string; service_id: string } | null {
  const ctx = useContext(BookingRouteContext);
  const [resolved, setResolved] = useState<{ id: string; service_id: string } | null>(null);

  useEffect(() => {
    if (!ctx && params) params.then(setResolved);
  }, [ctx, params]);

  if (ctx) return { id: ctx.userId, service_id: ctx.serviceId };
  return resolved;
}

type StepQuery = URLSearchParams | string | undefined | null;

/**
 * Step navigation for the booking flow.
 * - Inside /reservation/{domain}/{service}: readable URLs, always "platform" mode (with layout).
 * - Elsewhere (/if/booking-widget/...): legacy URLs; `withLayout` is read from the query string.
 */
export function useBookingRoute(id: string, serviceId: string) {
  const ctx = useContext(BookingRouteContext);
  const searchParams = useSearchParams();
  const platform = ctx !== null;
  const withLayout = platform || searchParams.get('withLayout') === 'true';

  const href = useCallback(
    (step: BookingStep, query?: StepQuery) => {
      const params = new URLSearchParams(
        query instanceof URLSearchParams ? query.toString() : (query ?? ''),
      );

      if (ctx) {
        params.delete('withLayout');
        const path = step === 'reservation' ? ctx.basePath : `${ctx.basePath}/${step}`;
        const qs = params.toString();
        return qs ? `${path}?${qs}` : path;
      }

      if (withLayout) params.set('withLayout', 'true');
      const qs = params.toString();
      const path = `/if/booking-widget/${id}/${serviceId}/${step}`;
      return qs ? `${path}?${qs}` : path;
    },
    [ctx, id, serviceId, withLayout],
  );

  return {
    platform,
    withLayout,
    href,
    domainName: ctx?.domainName,
    serviceName: ctx?.serviceName,
  };
}
