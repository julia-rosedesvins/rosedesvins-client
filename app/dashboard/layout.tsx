'use client';
import { UserProvider } from '@/contexts/UserContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
