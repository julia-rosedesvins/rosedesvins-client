'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { adminService, AdminUser } from '@/services/admin.service';

interface AdminContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (admin: AdminUser) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = admin !== null;

  const login = (adminData: AdminUser) => {
    // Ensure id field exists for backward compatibility
    const normalizedAdmin = {
      ...adminData,
      id: adminData._id || adminData.id,
    };
    setAdmin(normalizedAdmin);
  };

  const logout = async () => {
    try {
      await adminService.logout();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setAdmin(null);
      router.push('/admin');
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getProfile();
      if (response.success && response.data) {
        // Ensure id field exists for backward compatibility
        const adminData = {
          ...response.data,
          id: response.data._id || response.data.id,
        };
        setAdmin(adminData);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Handle redirects based on authentication state
  useEffect(() => {
    if (!isLoading) {
      // If admin is logged in and tries to access login page, redirect to dashboard
      if (isAuthenticated && pathname === '/admin') {
        router.push('/admin/dashboard');
      }
      
      // If admin is not logged in and tries to access protected routes, redirect to login
      if (!isAuthenticated && pathname.startsWith('/admin/') && pathname !== '/admin') {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const value: AdminContextType = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AdminContext.Provider value={value}>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#3A7B59',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      {children}
    </AdminContext.Provider>
  );
};
