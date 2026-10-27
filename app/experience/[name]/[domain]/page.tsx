import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import ExperienceDomainClient from './ExperienceDomainClient';
import { fetchExperienceProfile, fetchExperienceProfileBySlug, fetchRegionByName } from '@/lib/seo/fetch-public';
import { buildPageMetadata, decodeRouteParam, slugify } from '@/lib/seo/site';
import { resolveImageUrl } from '@/lib/media-url';
import { JsonLdScript, breadcrumbJsonLd, wineryJsonLd } from '@/lib/seo/json-ld';
import type { DomainLocation, DomainProfile } from '@/services/domain-profile.service';

type PageProps = {
  params: Promise<{ name: string; domain: string }>;
};

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

/** Title-case a hyphenated slug as a last-resort display fallback (e.g. "val-de-loire" -> "Val De Loire"). */
function titleCaseSlug(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Resolve the proper-cased region display name + canonical slug for a route param (slug or legacy raw name). */
async function resolveRegionDisplay(nameParam: string): Promise<{ displayName: string; slug: string }> {
  const decoded = decodeRouteParam(nameParam);
  const data = await fetchRegionByName(decoded, 1, 1);
  if (data?.region?.denom) {
    return { displayName: data.region.denom, slug: data.region.slug || slugify(data.region.denom) };
  }
  const slug = slugify(decoded) || nameParam;
  return { displayName: titleCaseSlug(slug), slug };
}

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
      slug: rawProfile.slug || null,
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

/**
 * Old links used the raw Mongo ObjectId as the last path segment. When we
 * detect one, resolve it via the legacy by-ID endpoint (kept for this exact
 * purpose) and permanently redirect to the canonical slug URL.
 */
async function redirectLegacyIdIfNeeded(regionParam: string, domainParam: string) {
  if (!OBJECT_ID_PATTERN.test(domainParam)) return;

  const response = await fetchExperienceProfile(domainParam);
  const slug = response?.data?.domainProfile?.slug;
  if (!slug) return;

  const regionSlug = slugify(decodeRouteParam(regionParam)) || regionParam;
  permanentRedirect(`/experience/${regionSlug}/${slug}`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name, domain } = await params;
  const [{ displayName: regionName, slug: regionSlug }, response] = await Promise.all([
    resolveRegionDisplay(name),
    OBJECT_ID_PATTERN.test(domain) ? fetchExperienceProfile(domain) : fetchExperienceProfileBySlug(domain),
  ]);
  const profile = response?.data.domainProfile;
  const displayName = profile?.domainName || 'Domaine viticole';
  const description =
    profile?.domainDescription?.slice(0, 155) ||
    `Découvrez ${displayName} en ${regionName} et réservez une expérience œnotouristique.`;
  const domainSlug = profile?.slug || domain;

  return buildPageMetadata({
    title: `${displayName} - ${regionName}`,
    description,
    path: `/experience/${regionSlug}/${domainSlug}`,
    ogImage: resolveImageUrl(profile?.domainProfilePictureUrl) || undefined,
  });
}

export default async function ExperienceDomainPage({ params }: PageProps) {
  const { name, domain } = await params;

  await redirectLegacyIdIfNeeded(name, domain);

  const [{ displayName: regionName, slug: regionSlug }, response] = await Promise.all([
    resolveRegionDisplay(name),
    OBJECT_ID_PATTERN.test(domain) ? fetchExperienceProfile(domain) : fetchExperienceProfileBySlug(domain),
  ]);

  let initialDomainProfile: DomainProfile | null = null;
  let initialLocation: DomainLocation | null = null;

  if (response?.data) {
    const mapped = mapProfileResponse(response.data);
    initialDomainProfile = mapped.profile;
    initialLocation = mapped.location;
  }

  const displayName = initialDomainProfile?.domainName || 'Domaine viticole';
  const domainSlug = initialDomainProfile?.slug || domain;

  return (
    <>
      {initialDomainProfile && (
        <JsonLdScript
          data={[
            breadcrumbJsonLd([
              { name: 'France', path: '/regions' },
              { name: regionName, path: `/region/${regionSlug}` },
              {
                name: displayName,
                path: `/experience/${regionSlug}/${domainSlug}`,
              },
            ]),
            wineryJsonLd({
              name: displayName,
              description: initialDomainProfile.domainDescription,
              regionSlug,
              domainSlug,
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
