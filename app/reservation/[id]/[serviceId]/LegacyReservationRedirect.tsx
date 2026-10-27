'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy `/reservation/{userId}/{serviceId}` links: keep working via the widget route. */
export default function LegacyReservationRedirect({
  id,
  serviceId,
}: {
  id: string;
  serviceId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/if/booking-widget/${id}/${serviceId}/reservation?withLayout=true`);
  }, [id, serviceId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Chargement...</p>
      </div>
    </div>
  );
}
