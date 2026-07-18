import type { Metadata } from 'next';
import ExperienceDomainClient from './ExperienceDomainClient';
import { fetchExperienceProfile } from '@/lib/seo/fetch-public';
import { buildPageMetadata, decodeRouteParam } from '@/lib/seo/site';
import { JsonLdScript, breadcrumbJsonLd, wineryJsonLd } from '@/lib/seo/json-ld';
import type { DomainLocation, DomainProfile } from '@/services/domain-profile.service';

type PageProps = {
  params: Promise<{ name: string; domain: string }>;
};

function mapProfileResponse(
  data: NonNullable<Awaited<ReturnType<typeof fetchExperienceProfile>>>['data'],
): { profile: DomainProfile; location: DomainLocation } {
  const rawProfile = data.domainProfile as DomainProfile & {
    userId?: string;
    domainLogoUrl?: string | null;
    mainImage?: string | null;
    siteWeb?: string | null;
    phone?: string | null;
    openingHours?: DomainProfile['openingHours'];
    producer?: string;
  };

  return {
    profile: {
      _id: rawProfile._id,
      userId: rawProfile.userId || '',
      domainDescription: rawProfile.domainDescription,
      domainProfilePictureUrl: rawProfile.domainProfilePictureUrl,
      domainLogoUrl: rawProfile.domainLogoUrl || null,
      mainImage: rawProfile.mainImage || null,
      colorCode: rawProfile.colorCode || '#3A7B59',
      services: rawProfile.services || [],
      domainName: rawProfile.domainName,
      siteWeb: rawProfile.siteWeb || null,
      phone: rawProfile.phone || null,
      openingHours: rawProfile.openingHours || null,
      createdAt: rawProfile.createdAt || '',
      updatedAt: rawProfile.updatedAt || '',
      producer: rawProfile.producer,
    },
    location: {
      domainLatitude: data.location.domainLatitude ?? null,
      domainLongitude: data.location.domainLongitude ?? null,
      address: data.location.address,
      city: data.location.city,
      codePostal: data.location.codePostal ?? null,
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name, domain } = await params;
  const regionName = decodeRouteParam(name);
  const response = await fetchExperienceProfile(domain);
  const profile = response?.data.domainProfile;
  const displayName = profile?.domainName || 'Domaine viticole';
  const description =
    profile?.domainDescription?.slice(0, 155) ||
    `Découvrez ${displayName} en ${regionName} et réservez une expérience œnotouristique.`;

  return buildPageMetadata({
    title: `${displayName} - ${regionName}`,
    description,
    path: `/experience/${encodeURIComponent(regionName)}/${domain}`,
    ogImage: profile?.domainProfilePictureUrl || undefined,
  });
}

export default async function ExperienceDomainPage({ params }: PageProps) {
  const { name, domain } = await params;
  const regionName = decodeRouteParam(name);
  const response = await fetchExperienceProfile(domain);

  let initialDomainProfile: DomainProfile | null = null;
  let initialLocation: DomainLocation | null = null;

  if (response?.data) {
    const mapped = mapProfileResponse(response.data);
    initialDomainProfile = mapped.profile;
    initialLocation = mapped.location;
  }

  const displayName = initialDomainProfile?.domainName || 'Domaine viticole';

  return (
    <>
      {initialDomainProfile && (
        <JsonLdScript
          data={[
            breadcrumbJsonLd([
              { name: 'France', path: '/regions' },
              { name: regionName, path: `/region/${encodeURIComponent(regionName)}` },
              {
                name: displayName,
                path: `/experience/${encodeURIComponent(regionName)}/${domain}`,
              },
            ]),
            wineryJsonLd({
              name: displayName,
              description: initialDomainProfile.domainDescription,
              regionName,
              domainId: domain,
              image: initialDomainProfile.domainProfilePictureUrl,
              address: initialLocation?.address,
              city: initialLocation?.city,
            }),
          ]}
        />
      )}
      <ExperienceDomainClient
        regionName={regionName}
        domainId={domain}
        initialDomainProfile={initialDomainProfile}
        initialLocation={initialLocation}
      />
    </>
  );
}
