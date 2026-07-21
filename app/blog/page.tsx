import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import BlogPagination from '@/components/BlogPagination';
import LandingPageLayout from '@/components/LandingPageLayout';
import { BLOG_POSTS_PER_PAGE, fetchPosts } from '@/lib/wordpress/fetch-posts';
import { JsonLdScript, collectionPageJsonLd } from '@/lib/seo/json-ld';
import { buildCanonical } from '@/lib/seo/site';

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

function formatDate(date: string): string {
  return format(new Date(date), 'd MMMM yyyy', { locale: fr });
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const { posts, total, totalPages } = await fetchPosts({
    page: currentPage,
    perPage: BLOG_POSTS_PER_PAGE,
  });

  const collectionJsonLd = collectionPageJsonLd({
    name: 'Blog Rose des Vins',
    path: currentPage > 1 ? `/blog?page=${currentPage}` : '/blog',
    items: posts.map((post) => ({
      name: post.title,
      url: buildCanonical(`/blog/${post.slug}`),
    })),
  });

  return (
    <LandingPageLayout>
      <JsonLdScript data={collectionJsonLd} />
      <main className="max-w-6xl mx-auto px-4 py-16 min-w-0 overflow-x-hidden">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#318160] mb-4">Blog</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Actualités, conseils et inspirations autour de l&apos;œnotourisme et des domaines viticoles de France.
          </p>
          {total > 0 && (
            <p className="text-sm text-gray-500 mt-3">
              {total} article{total > 1 ? 's' : ''}
              {totalPages > 1 ? ` • Page ${currentPage} sur ${totalPages}` : ''}
            </p>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-600">Aucun article disponible pour le moment.</p>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4 shadow-sm">
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <time
                      dateTime={post.date}
                      className="text-sm text-gray-500 block mb-2"
                    >
                      {formatDate(post.date)}
                    </time>
                    <h2 className="text-xl font-semibold text-[#264035] group-hover:text-[#1D6346] transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  </Link>
                </article>
              ))}
            </div>

            <BlogPagination currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </main>
    </LandingPageLayout>
  );
}
