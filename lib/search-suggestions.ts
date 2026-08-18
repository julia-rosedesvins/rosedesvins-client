import type { ComponentType } from 'react';
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
