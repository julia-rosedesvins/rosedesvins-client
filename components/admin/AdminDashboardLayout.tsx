'use client';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { admin, logout, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3A7B59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will be redirected by AdminContext
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-3">
                <Image
                  src="/assets/logo.png"
                  alt="Rose des Vins"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Rose des Vins</h1>
                  <p className="text-xs text-gray-500">Administration</p>
                </div>
              </Link>
            </div>

            {/* Admin Info and Logout */}
            <div className="flex items-center space-x-4">
              {/* Admin Profile */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-[#3A7B59] rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {admin.firstName} {admin.lastName}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrateur
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
