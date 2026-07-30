export interface WpRenderedField {
  rendered: string;
  protected?: boolean;
}

export interface WpAuthor {
  id: number;
  name: string;
  slug: string;
  url: string;
}

export interface WpFeaturedMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  caption?: WpRenderedField;
  media_details?: {
    width?: number;
    height?: number;
  };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WpPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: WpRenderedField;
  content: WpRenderedField;
  excerpt: WpRenderedField;
  _embedded?: {
    author?: WpAuthor[];
    'wp:featuredmedia'?: WpFeaturedMedia[];
    'wp:term'?: WpTerm[][];
  };
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImageUrl: string;
  authorName: string;
  categories: string[];
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
  featuredImageCaption?: string;
}

export interface PaginatedPostsResult {
  posts: BlogPostSummary[];
  total: number;
  totalPages: number;
  page: number;
}

export interface BlogSitemapEntry {
  slug: string;
  modified: string;
}

export interface BlogSitemapData {
  posts: BlogSitemapEntry[];
  totalPages: number;
  latestModified: string | null;
}
