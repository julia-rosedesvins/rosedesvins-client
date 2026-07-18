import { NOINDEX_METADATA } from '@/lib/seo/site';

export const metadata = NOINDEX_METADATA;

export default function NoResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
