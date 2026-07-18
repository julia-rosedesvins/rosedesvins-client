import { NOINDEX_METADATA } from '@/lib/seo/site';

export const metadata = NOINDEX_METADATA;

export default function IfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
