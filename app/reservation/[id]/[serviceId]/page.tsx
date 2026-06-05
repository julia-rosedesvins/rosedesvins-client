'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ReservationRedirect({ 
  params 
}: { 
  params: Promise<{ id: string; serviceId: string }> 
}) {
  const router = useRouter();
  const { id, serviceId } = use(params);

  useEffect(() => {
    // Redirect to widget with layout flag
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