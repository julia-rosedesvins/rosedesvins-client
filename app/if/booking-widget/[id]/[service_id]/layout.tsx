'use client';

import { useSearchParams } from 'next/navigation';
import LandingPageLayout from '@/components/LandingPageLayout';
import { AutoGoogleTranslate } from '@/app/if/google-translate/AutoGoogleTranslate';

export default function BookingWidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  
  // Check if we should show the layout (header/footer)
  // If accessed from /reservation route, show layout
  // If accessed directly or in iframe, don't show layout
  const showLayout = searchParams.get('withLayout') === 'true';

  return (
    <>
      <AutoGoogleTranslate />
      {showLayout ? (
        <LandingPageLayout>
          {children}
        </LandingPageLayout>
      ) : (
        children
      )}
    </>
  );
}
