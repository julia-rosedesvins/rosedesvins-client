import { NOINDEX_METADATA } from '@/lib/seo/site';
import LoginProviders from './LoginProviders';

export const metadata = NOINDEX_METADATA;

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <LoginProviders>{children}</LoginProviders>;
}
