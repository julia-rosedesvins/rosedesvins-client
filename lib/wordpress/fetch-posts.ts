import type {
  BlogPostDetail,
  BlogPostSummary,
  BlogSitemapData,
  BlogSitemapEntry,
  PaginatedPostsResult,
  WpPost,
} from './types';
import { toBlogPostDetail, toBlogPostSummary } from './utils';
import { WORDPRESS_POSTS_TAG, wordpressPostTag } from './cache-tags';

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL?.replace(/\/$/, '') || 'https://cms.rosedesvins.co';

const REVALIDATE_SECONDS =
  process.env.NODE_ENV === 'development'
    ? 0
    : Number(process.env.WORDPRESS_REVALIDATE_SECONDS ?? 60);
const SITEMAP_REVALIDATE_SECONDS = Number(process.env.WORDPRESS_SITEMAP_REVALIDATE_SECONDS ?? 3600);
export const BLOG_POSTS_PER_PAGE = 12;

type FetchOptions = {
  revalidate?: number;
  tags?: string[];
};

async function wpFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<{ data: T | null; headers: Headers }> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}${path}`, {
      next: {
        revalidate: options.revalidate ?? REVALIDATE_SECONDS,
        tags: options.tags,
      },
    });

    if (!res.ok) {
      return { data: null, headers: res.headers };
    }

    return { data: (await res.json()) as T, headers: res.headers };
  } catch {
    return { data: null, headers: new Headers() };
  }
}

export async function fetchPosts(options: {
  page?: number;
  perPage?: number;
  revalidate?: number;
} = {}): Promise<PaginatedPostsResult> {
  const page = options.page ?? 1;
  const perPage = options.perPage ?? BLOG_POSTS_PER_PAGE;

  const { data, headers } = await wpFetch<WpPost[]>(
    `/wp-json/wp/v2/posts?_embed=1&page=${page}&per_page=${perPage}`,
    {
      revalidate: options.revalidate,
      tags: [WORDPRESS_POSTS_TAG],
    },
  );

  const posts = (data ?? []).map(toBlogPostSummary);
  const total = Number(headers.get('X-WP-Total') ?? posts.length);
  const totalPages = Number(headers.get('X-WP-TotalPages') ?? 1);

  return { posts, total, totalPages, page };
}

export async function fetchPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const { data } = await wpFetch<WpPost[]>(
    `/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
    {
      tags: [WORDPRESS_POSTS_TAG, wordpressPostTag(slug)],
    },
  );

  const post = data?.[0];
  return post ? toBlogPostDetail(post) : null;
}

export async function fetchLatestPosts(limit = 6): Promise<BlogPostSummary[]> {
  const { posts } = await fetchPosts({ page: 1, perPage: limit });
  return posts;
}

export async function fetchAllPostSlugs(): Promise<BlogSitemapEntry[]> {
  const data = await fetchBlogSitemapData();
  return data.posts;
}

export async function fetchBlogSitemapData(): Promise<BlogSitemapData> {
  const entries: BlogSitemapEntry[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const { data, headers } = await wpFetch<WpPost[]>(
      `/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug,modified`,
      {
        revalidate: SITEMAP_REVALIDATE_SECONDS,
        tags: [WORDPRESS_POSTS_TAG],
      },
    );

    if (!data?.length) break;

    entries.push(
      ...data.map((post) => ({
        slug: post.slug,
        modified: post.modified,
      })),
    );

    totalPages = Number(headers.get('X-WP-TotalPages') ?? 1);
    page += 1;
  } while (page <= totalPages);

  const latestModified =
    entries.reduce<string | null>((latest, entry) => {
      if (!latest || entry.modified > latest) return entry.modified;
      return latest;
    }, null);

  const listingPages = Math.max(1, Math.ceil(entries.length / BLOG_POSTS_PER_PAGE));

  return {
    posts: entries,
    totalPages: listingPages,
    latestModified,
  };
}
