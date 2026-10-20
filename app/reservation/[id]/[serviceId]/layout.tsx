import { notFound } from 'next/navigation';
import LandingPageLayout from '@/components/LandingPageLayout';
import { AutoGoogleTranslate } from '@/app/if/google-translate/AutoGoogleTranslate';
import { BookingRouteProvider } from '@/contexts/BookingRouteContext';
import { bookingPath, OBJECT_ID_PATTERN, resolveBooking } from '@/lib/booking-routes';

export default async function ReservationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; serviceId: string }>;
}) {
  const { id, serviceId } = await params;

  // Legacy links (`/reservation/{userId}/{serviceId}`) are redirected by the page itself.
  if (OBJECT_ID_PATTERN.test(id) && OBJECT_ID_PATTERN.test(serviceId)) {
    return <>{children}</>;
  }

  const booking = await resolveBooking(id, serviceId);
  if (!booking) notFound();

  return (
    <BookingRouteProvider
      value={{
        basePath: bookingPath(booking.domainSlug, booking.serviceSlug),
        userId: booking.userId,
        serviceId: booking.serviceId,
        domainName: booking.domainName,
        serviceName: booking.serviceName,
      }}
    >
      <AutoGoogleTranslate />
      <LandingPageLayout>
        <header className="border-b bg-white">
          <div className="container mx-auto max-w-4xl px-4 py-3 text-center md:py-4">
            <h1 className="text-base font-semibold text-gray-800 md:text-xl">
              {booking.serviceName}
              <span className="font-normal text-gray-500"> · {booking.domainName}</span>
            </h1>
          </div>
        </header>
        {children}
      </LandingPageLayout>
    </BookingRouteProvider>
  );
}
