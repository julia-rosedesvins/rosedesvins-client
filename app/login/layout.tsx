'use client';
import { UserProvider } from '@/contexts/UserContext';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
