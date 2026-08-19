const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

function repairDoublePrefixedUrl(url: string): string {
    const match = url.match(/^https?:\/\/[^/]+?(https?:\/\/.+)$/);
    return match ? match[1] : url;
}

function encodeUrlPath(url: string): string {
    try {
        const parsed = new URL(url.replace(/ /g, '%20'));
        parsed.pathname = parsed.pathname
            .split('/')
            .map((segment) => {
                if (!segment) return segment;
                try {
                    return encodeURIComponent(decodeURIComponent(segment));
                } catch {
                    return encodeURIComponent(segment);
                }
            })
            .join('/');
        return parsed.toString();
    } catch {
        return encodeURI(url).replace(/\(/g, '%28').replace(/\)/g, '%29');
    }
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

    const encoded = encodeUrlPath(resolved);
    try {
        new URL(encoded);
        return encoded;
    } catch {
        return null;
    }
}

export function toCssImageUrl(url?: string | null): string | null {
    const resolved = resolveImageUrl(url);
    if (!resolved) return null;
    return `url("${resolved}")`;
}
