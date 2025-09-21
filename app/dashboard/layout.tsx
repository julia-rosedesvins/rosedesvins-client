'use client';
import { UserProvider } from '@/contexts/UserContext';
import DashboardWrapper from '@/components/DashboardWrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <DashboardWrapper>
        {children}
      </DashboardWrapper>
    </UserProvider>
  );
}
