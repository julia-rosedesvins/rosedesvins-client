const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
const API_V1 = `${API_BASE_URL}/v1`;

const REVALIDATE_SECONDS = 3600;
const SITEMAP_REVALIDATE_SECONDS = 86400;

type FetchOptions = { revalidate?: number };

async function publicFetch<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_V1}${path}`, {
      next: { revalidate: options.revalidate ?? REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface RegionRecord {
  _id: string;
  denom: string;
  slug?: string;
  thumbnailUrl?: string;
  subtitle?: string;
  description?: string;
  isParent?: boolean;
}

export interface PaginatedRegionsResponse {
  data: RegionRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RegionDomain {
  domainName: string;
  domainDescription: string;
  domainId: string | null;
  slug?: string | null;
  location: string | null;
}

export interface RegionByNameResponse {
  region: RegionRecord | null;
  domains: RegionDomain[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicServiceRecord {
  serviceId: string;
  serviceName: string;
  domain: {
    domainId: string;
    slug?: string | null;
    domainName: string | null;
    location?: {
      city?: string | null;
      region?: string | null;
    };
  };
}

export interface PublicServicesResponse {
  success: boolean;
  data: {
    services: PublicServiceRecord[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface PublicDomainProfileResponse {
  success: boolean;
  data: {
    domainProfile: {
      _id: string;
      slug?: string | null;
      domainName: string;
      domainDescription: string;
      domainProfilePictureUrl: string | null;
      services: Array<{
        _id: string;
        name: string;
        description: string;
        pricePerPerson: number;
        isActive: boolean;
      }>;
    };
    location: {
      city: string | null;
      address: string | null;
      codePostal: string | null;
      domainLatitude?: number | null;
      domainLongitude?: number | null;
    };
  };
}

export async function fetchAllParentRegions(): Promise<RegionRecord[]> {
  const data = await publicFetch<PaginatedRegionsResponse>(
    '/regions?limit=1000&isParent=true',
    { revalidate: SITEMAP_REVALIDATE_SECONDS },
  );
  return data?.data ?? [];
}

export async function fetchParentRegionsPage(
  page = 1,
  limit = 15,
): Promise<{ regions: RegionRecord[]; total: number; totalPages: number } | null> {
  const data = await publicFetch<PaginatedRegionsResponse>(
    `/regions?page=${page}&limit=${limit}&isParent=true`,
  );
  if (!data) return null;
  return {
    regions: data.data,
    total: data.total,
    totalPages: data.totalPages,
  };
}

export async function fetchPublicServicesPage(
  page = 1,
  limit = 12,
  categories?: string[],
): Promise<PublicServicesResponse['data'] | null> {
  let path = `/domain-profile/public/services/all?page=${page}&limit=${limit}`;
  if (categories?.length) {
    path += `&categories=${categories.join(',')}`;
  }
  const data = await publicFetch<PublicServicesResponse>(path);
  return data?.data ?? null;
}

export async function fetchRegionByName(
  name: string,
  page = 1,
  limit = 5,
): Promise<RegionByNameResponse | null> {
  return publicFetch<RegionByNameResponse>(
    `/regions/${encodeURIComponent(name)}?page=${page}&limit=${limit}`,
  );
}

export async function fetchAllPublicServices(): Promise<PublicServiceRecord[]> {
  const all: PublicServiceRecord[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await publicFetch<PublicServicesResponse>(
      `/domain-profile/public/services/all?page=${page}&limit=100`,
      { revalidate: SITEMAP_REVALIDATE_SECONDS },
    );
    if (!data?.data?.services?.length) break;
    all.push(...data.data.services);
    totalPages = data.data.pagination.totalPages;
    page += 1;
  }

  return all;
}

export async function fetchPublicDomainProfile(
  domainId: string,
): Promise<PublicDomainProfileResponse | null> {
  return publicFetch<PublicDomainProfileResponse>(
    `/domain-profile/public/${encodeURIComponent(domainId)}`,
  );
}

export async function fetchPublicStaticExperience(
  domainId: string,
): Promise<PublicDomainProfileResponse | null> {
  const data = await publicFetch<{
    success: boolean;
    data: PublicDomainProfileResponse['data'];
  }>(`/static-experiences/public/${encodeURIComponent(domainId)}`);
  if (!data?.data) return null;
  return { success: true, data: data.data };
}

export async function fetchExperienceProfile(
  domainId: string,
): Promise<PublicDomainProfileResponse | null> {
  const profile = await fetchPublicDomainProfile(domainId);
  if (profile) return profile;
  return fetchPublicStaticExperience(domainId);
}

/** Resolve a domain/experience profile by its clean SEO slug (dual DomainProfile/StaticExperience lookup). */
export async function fetchExperienceProfileBySlug(
  slug: string,
): Promise<PublicDomainProfileResponse | null> {
  return publicFetch<PublicDomainProfileResponse>(
    `/domain-profile/public/by-slug/${encodeURIComponent(slug)}`,
  );
}

export function experiencePath(regionSlug: string, domainSlug: string): string {
  return `/experience/${regionSlug}/${domainSlug}`;
}

export interface SitemapPathEntry {
  path: string;
  updatedAt?: string;
}

export interface SitemapPathsResponse {
  regions: SitemapPathEntry[];
  experiences: SitemapPathEntry[];
}

/**
 * All currently reachable `/region/{slug}` and `/experience/{regionSlug}/{domainSlug}`
 * paths, straight from the backend (covers every Region, DomainProfile and
 * StaticExperience with a slug — including domains with no active services,
 * which `fetchAllPublicServices` alone would miss). Used by `app/sitemap.ts`.
 */
export async function fetchAllSitemapPaths(): Promise<SitemapPathsResponse> {
  const data = await publicFetch<SitemapPathsResponse>('/regions/sitemap-paths', {
    revalidate: SITEMAP_REVALIDATE_SECONDS,
  });
  return data ?? { regions: [], experiences: [] };
}
