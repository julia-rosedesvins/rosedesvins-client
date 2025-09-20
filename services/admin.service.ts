import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

// Types for admin login
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  statusCode: number;
}

class AdminService {
  /**
   * Login admin user
   * @param credentials - Admin email and password
   * @returns Promise with admin user data
   */
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const response = await apiClient.post<AdminLoginResponse>('/users/admin/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Logout admin user
   * @returns Promise with logout confirmation
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/users/admin/logout');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get admin profile (requires authentication)
   * @returns Promise with admin profile data
   */
  async getProfile(): Promise<{ success: boolean; data: AdminUser }> {
    try {
      const response = await apiClient.get('/admin/profile');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get admin dashboard data (requires authentication)
   * @returns Promise with dashboard data
   */
  async getDashboardData(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();
