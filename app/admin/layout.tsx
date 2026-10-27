import { NOINDEX_METADATA } from '@/lib/seo/site';
import AdminProviders from './AdminProviders';

export const metadata = NOINDEX_METADATA;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
