'use client';

import { AdminProvider } from '@/contexts/AdminContext';

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
