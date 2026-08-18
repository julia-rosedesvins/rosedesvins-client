import type { ComponentType } from 'react';
import { citiesService } from '@/services/cities.service';
import { regionService } from '@/services/region.service';
import { normalizeSearchText, scoreSearchMatch } from '@/lib/search-relevance';

export interface SearchSuggestion {
    type: 'city' | 'region' | 'domain' | 'service' | 'experience';
    name: string;
    description?: string;
    icon: ComponentType<{ className?: string }>;
    route: string;
    domainId?: string;
    slug?: string | null;
}

export interface SearchSuggestionIcons {
    city: ComponentType<{ className?: string }>;
    region: ComponentType<{ className?: string }>;
    domain: ComponentType<{ className?: string }>;
    service: ComponentType<{ className?: string }>;
    experience: ComponentType<{ className?: string }>;
}

export function getSearchCacheKey(query: string): string {
    return `v2:${query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()}`;
}

export function rankSearchSuggestions(
    query: string,
    suggestions: SearchSuggestion[],
    limit = 8,
): SearchSuggestion[] {
    const seenLocationNames = new Set<string>();

    return suggestions
        .map((suggestion) => ({
            suggestion,
            score: scoreSearchMatch(query, suggestion.name, suggestion.slug),
        }))
        .sort((a, b) => b.score - a.score)
        .filter(({ suggestion, score }) => {
            if (score <= 0) return false;

            if (suggestion.type !== 'city' && suggestion.type !== 'region') {
                return true;
            }

            const normalized = normalizeSearchText(suggestion.name || '');
            if (!normalized || seenLocationNames.has(normalized)) {
                return false;
            }

            seenLocationNames.add(normalized);
            return true;
        })
        .slice(0, limit)
        .map(({ suggestion }) => suggestion);
}

export function buildSearchSuggestionsFromResults(
    query: string,
    backendResult: Awaited<ReturnType<typeof regionService.unifiedSearch>>,
    citiesResult: Awaited<ReturnType<typeof citiesService.searchCities>>,
    icons: SearchSuggestionIcons,
): SearchSuggestion[] {
    const allSuggestions: SearchSuggestion[] = [];

    if (citiesResult.success && citiesResult.data && citiesResult.data.length > 0) {
        citiesResult.data.slice(0, 5).forEach((city: any) => {
            allSuggestions.push({
                type: 'city',
                name: city.nom_standard,
                description: 'France',
                icon: icons.city,
                route: `/region/${encodeURIComponent(city.nom_standard)}${
                    city.latitude_centre != null && city.longitude_centre != null
                        ? `?lat=${city.latitude_centre}&lon=${city.longitude_centre}`
                        : ''
                }`,
            });
        });
    }

    if (backendResult.data.regions && backendResult.data.regions.length > 0) {
        backendResult.data.regions.slice(0, 5).forEach((region) => {
            allSuggestions.push({
                type: 'region',
                name: region.denom,
                slug: (region as any).slug || null,
                icon: icons.region,
                route: `/region/${(region as any).slug || encodeURIComponent(region.denom)}`,
            });
        });
    }

    if (backendResult.data.domains && backendResult.data.domains.length > 0) {
        backendResult.data.domains.slice(0, 3).forEach((domain) => {
            const regionName = domain.location?.region || domain.location?.city || domain.domainName || 'domaine';
            const route = (domain as any).experienceRoute || (domain.domainId
                ? `/experience/${encodeURIComponent(regionName)}/${(domain as any).slug || domain.domainId}`
                : '/regions');
            allSuggestions.push({
                type: 'domain',
                name: domain.domainName,
                description: domain.location?.city || '',
                icon: icons.domain,
                route,
                domainId: domain.domainId,
            });
        });
    }

    if (backendResult.data.services && backendResult.data.services.length > 0) {
        backendResult.data.services.slice(0, 3).forEach((service) => {
            const regionName = service.domain?.region || service.domain?.city || service.domain?.domainName || 'domaine';
            const route = (service as any).experienceRoute || (service.domain?.domainId
                ? `/experience/${encodeURIComponent(regionName)}/${(service.domain as any).slug || service.domain.domainId}`
                : '/experiences');
            allSuggestions.push({
                type: 'service',
                name: service.serviceName,
                description: `${service.domain.domainName} - ${service.pricePerPerson}€`,
                icon: icons.service,
                route,
            });
        });
    }

    if (backendResult.data.staticExperiences && backendResult.data.staticExperiences.length > 0) {
        backendResult.data.staticExperiences.slice(0, 2).forEach((exp) => {
            const regionName = exp.region || exp.city || 'domaine';
            const route = (exp as any).experienceRoute || ((exp as any).domainId
                ? `/experience/${encodeURIComponent(regionName)}/${(exp as any).slug || (exp as any).domainId}`
                : (exp.website || '#'));
            allSuggestions.push({
                type: 'experience',
                name: exp.name,
                description: exp.category || '',
                icon: icons.experience,
                route,
            });
        });
    }

    return rankSearchSuggestions(query, allSuggestions);
}

export async function fetchSearchSuggestions(
    query: string,
    icons: SearchSuggestionIcons,
    signal?: AbortSignal,
): Promise<SearchSuggestion[]> {
    const [backendResult, citiesResult] = await Promise.all([
        regionService.unifiedSearch(query, signal),
        citiesService.searchCities(query, signal),
    ]);

    return buildSearchSuggestionsFromResults(query, backendResult, citiesResult, icons);
}
