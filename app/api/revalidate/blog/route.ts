import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { WORDPRESS_POSTS_TAG, wordpressPostTag } from '@/lib/wordpress/cache-tags';

type RevalidatePayload = {
  slug?: string;
};

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let slug: string | undefined;

  try {
    const body = (await request.json()) as RevalidatePayload;
    slug = body.slug;
  } catch {
    // Body is optional for generic blog revalidation.
  }

  revalidateTag(WORDPRESS_POSTS_TAG);

  if (slug) {
    revalidateTag(wordpressPostTag(slug));
    revalidatePath(`/blog/${slug}`);
  }

  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({
    revalidated: true,
    slug: slug ?? null,
    now: Date.now(),
  });
}
