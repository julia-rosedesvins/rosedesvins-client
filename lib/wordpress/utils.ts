import { DEFAULT_OG_IMAGE } from '@/lib/seo/site';
import type { BlogPostDetail, BlogPostSummary, WpPost } from './types';

const HTML_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&[a-zA-Z#0-9]+;/g, (entity) => HTML_ENTITY_MAP[entity] ?? entity);
}

export function getFeaturedImageUrl(post: WpPost): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return media?.source_url || DEFAULT_OG_IMAGE;
}

export function getAuthorName(post: WpPost): string {
  return post._embedded?.author?.[0]?.name || 'Rose des Vins';
}

export function getCategories(post: WpPost): string[] {
  const terms = post._embedded?.['wp:term']?.[0] ?? [];
  return terms.filter((term) => term.taxonomy === 'category').map((term) => term.name);
}

export function toBlogPostSummary(post: WpPost): BlogPostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: decodeHtmlEntities(stripHtml(post.title.rendered)),
    excerpt: decodeHtmlEntities(stripHtml(post.excerpt.rendered)),
    date: post.date,
    modified: post.modified,
    featuredImageUrl: getFeaturedImageUrl(post),
    authorName: getAuthorName(post),
    categories: getCategories(post),
  };
}

export function toBlogPostDetail(post: WpPost): BlogPostDetail {
  return {
    ...toBlogPostSummary(post),
    content: post.content.rendered,
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}
