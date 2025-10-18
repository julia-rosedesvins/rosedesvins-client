"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { userService, UserProfile } from '@/services/user.service';
import { toast, Toaster } from 'react-hot-toast';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updatePasswordChanged: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = user !== null;
  const mustChangePassword = user?.mustChangePassword || false;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await userService.login({ email, password });
      if (response.success && response.data) {
        // Convert the login response user data to UserProfile format
        const userData: UserProfile = {
          _id: response.data.user.id,
          id: response.data.user.id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          role: response.data.user.role,
          domainName: response.data.user.domainName,
          accountStatus: 'approved', // Since they can login, they're approved
          mustChangePassword: response.data.user.mustChangePassword,
        };
        setUser(userData);
        toast.success('Connexion réussie');
        return true;
      } else {
        toast.error(response.message || 'Erreur de connexion');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Erreur de connexion');
      return false;
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePasswordChanged = async () => {
    // Refresh user profile to get updated mustChangePassword status
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Handle redirects based on authentication state
  useEffect(() => {
    if (!isLoading) {
      // If user is logged in and tries to access login page, redirect to dashboard
      if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
      }
      
      // If user is not logged in and tries to access protected routes, redirect to login
      if (!isAuthenticated && pathname.startsWith('/dashboard')) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    mustChangePassword,
    login,
    logout,
    checkAuth,
    updatePasswordChanged,
  };

  return (
    <UserContext.Provider value={value}>
      {/* <Toaster 
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
      /> */}
      {children}
    </UserContext.Provider>
  );
};
