import { NOINDEX_METADATA } from '@/lib/seo/site';
import DashboardProviders from './DashboardProviders';

export const metadata = NOINDEX_METADATA;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardProviders>{children}</DashboardProviders>;
}
