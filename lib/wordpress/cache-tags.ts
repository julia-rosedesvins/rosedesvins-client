export const WORDPRESS_POSTS_TAG = 'wordpress-posts';

export function wordpressPostTag(slug: string): string {
  return `wordpress-post-${slug}`;
}
