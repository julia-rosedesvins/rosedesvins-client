import Link from 'next/link';

const PAGE_LINK_CLASS =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors';
const ACTIVE_CLASS = 'border-[#318160] bg-[#318160] text-white';
const INACTIVE_CLASS =
  'border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white';

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function buildBlogPageHref(page: number): string {
  return page <= 1 ? '/blog' : `/blog?page=${page}`;
}

function getVisiblePages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
}

export default function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination du blog"
    >
      {currentPage > 1 ? (
        <Link
          href={buildBlogPageHref(currentPage - 1)}
          className={`${PAGE_LINK_CLASS} ${INACTIVE_CLASS}`}
          aria-label="Page précédente"
        >
          Précédent
        </Link>
      ) : (
        <span
          className={`${PAGE_LINK_CLASS} border-gray-200 text-gray-400 cursor-not-allowed`}
          aria-hidden="true"
        >
          Précédent
        </span>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-10 min-w-10 items-center justify-center px-2 text-gray-500"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildBlogPageHref(page)}
              className={`${PAGE_LINK_CLASS} ${page === currentPage ? ACTIVE_CLASS : INACTIVE_CLASS}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={buildBlogPageHref(currentPage + 1)}
          className={`${PAGE_LINK_CLASS} ${INACTIVE_CLASS}`}
          aria-label="Page suivante"
        >
          Suivant
        </Link>
      ) : (
        <span
          className={`${PAGE_LINK_CLASS} border-gray-200 text-gray-400 cursor-not-allowed`}
          aria-hidden="true"
        >
          Suivant
        </span>
      )}
    </nav>
  );
}
