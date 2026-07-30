import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Metadata } from 'next';
import BlogPostContent from '@/components/BlogPostContent';
import LandingPageLayout from '@/components/LandingPageLayout';
import NewsletterSection from '@/components/NewsletterSection';
import { fetchPostBySlug } from '@/lib/wordpress/fetch-posts';
import { truncateText } from '@/lib/wordpress/utils';
import { JsonLdScript, breadcrumbJsonLd, blogPostingJsonLd } from '@/lib/seo/json-ld';
import { buildArticleMetadata } from '@/lib/seo/site';

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string): string {
  return format(new Date(date), 'd MMMM yyyy', { locale: fr });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) return {};

  return buildArticleMetadata({
    title: post.title,
    description: truncateText(post.excerpt, 155),
    path: `/blog/${post.slug}`,
    ogImage: post.featuredImageUrl,
    publishedTime: post.date,
    modifiedTime: post.modified,
    authorName: post.authorName,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const description = truncateText(post.excerpt, 155);

  return (
    <LandingPageLayout>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: 'Accueil', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          blogPostingJsonLd({
            title: post.title,
            description,
            slug: post.slug,
            image: post.featuredImageUrl,
            datePublished: post.date,
            dateModified: post.modified,
            authorName: post.authorName,
          }),
        ]}
      />
      <main className="max-w-4xl mx-auto px-4 py-16 min-w-0 overflow-x-hidden">
        <nav className="mb-8 text-sm text-gray-500" aria-label="Fil d'Ariane">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#318160] transition-colors">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-[#318160] transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[#264035] truncate max-w-xs sm:max-w-md">{post.title}</li>
          </ol>
        </nav>

        <article className="min-w-0 max-w-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#318160] mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center rounded-full bg-[#318160]/10 px-3 py-1 text-xs font-medium text-[#318160]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <figure className="mb-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={post.featuredImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            {post.featuredImageCaption && (
              <figcaption className="mt-2 text-sm text-gray-500 text-center">
                {post.featuredImageCaption}
              </figcaption>
            )}
          </figure>

          <BlogPostContent html={post.content} />
        </article>
      </main>
      <NewsletterSection />
    </LandingPageLayout>
  );
}
