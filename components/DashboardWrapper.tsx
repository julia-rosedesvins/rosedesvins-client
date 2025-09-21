"use client";

import { useUser } from '@/contexts/UserContext';
import ChangePassword from '@/components/ChangePassword';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { user, isLoading, isAuthenticated, mustChangePassword, updatePasswordChanged } = useUser();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the UserContext will redirect to login
  if (!isAuthenticated || !user) {
    return null;
  }

  // If user must change password, show the change password component
  if (mustChangePassword) {
    return (
      <ChangePassword 
        user={user} 
        onPasswordChanged={updatePasswordChanged}
      />
    );
  }

  // Otherwise show the normal dashboard content
  return <>{children}</>;
}
