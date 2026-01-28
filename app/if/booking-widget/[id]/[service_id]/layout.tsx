'use client';

import { useSearchParams } from 'next/navigation';
import LandingPageLayout from '@/components/LandingPageLayout';

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

  if (showLayout) {
    return (
      <LandingPageLayout>
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center text-white py-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(/assets/wine-cellar.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
              Des expériences façonnées par la passion des vignerons.
            </h1>
            <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
              Visites de cave, dégustations, cours d'œnologie, balades à vélo, pique-nique
              dans les vignes... : découvrez le vin directement auprès de ceux qui le créent
              et vivez des moments authentiques. Chaque activité est une rencontre avec
              un vigneron passionné et une façon unique de découvrir son univers.
            </p>
          </div>
        </section>
        {children}
      </LandingPageLayout>
    );
  }

  return <>{children}</>;
}
