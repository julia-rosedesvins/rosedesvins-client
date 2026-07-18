'use client';

import { UserProvider } from '@/contexts/UserContext';

export default function LoginProviders({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
