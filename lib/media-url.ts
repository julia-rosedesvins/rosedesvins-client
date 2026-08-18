const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

function repairDoublePrefixedUrl(url: string): string {
    const match = url.match(/^https?:\/\/[^/]+?(https?:\/\/.+)$/);
    return match ? match[1] : url;
}

export function resolveImageUrl(url?: string | null): string | null {
    if (!url || typeof url !== 'string') return null;

    const trimmed = repairDoublePrefixedUrl(url.trim());
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;

    let resolved = trimmed;
    if (trimmed.startsWith('//')) {
        resolved = `https:${trimmed}`;
    } else if (!/^https?:\/\//i.test(trimmed)) {
        resolved = `${API_BASE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
    }

    try {
        new URL(resolved);
        return resolved;
    } catch {
        return null;
    }
}
