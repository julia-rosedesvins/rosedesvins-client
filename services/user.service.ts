import axios from 'axios';
import { apiClient } from './admin.service';

// Types for contact form
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  domainName: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    domainName: string;
    role: string;
    accountStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Types for user login
export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  domainName: string;
  accountStatus: string;
  mustChangePassword: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  firstLoginAt?: string;
}

export interface UserLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      domainName: string;
      mustChangePassword: boolean;
      firstLogin: boolean;
    };
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
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

class UserService {
  /**
   * Submit contact form
   * @param contactData - Contact form data
   * @returns Promise with submission response
   */
  async submitContactForm(contactData: ContactFormData): Promise<ContactFormResponse> {
    try {
      const response = await apiClient.post<ContactFormResponse>('/users/contact', contactData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * User login
   * @param credentials - User login credentials
   * @returns Promise with login response
   */
  async login(credentials: UserLoginRequest): Promise<UserLoginResponse> {
    try {
      const response = await apiClient.post<UserLoginResponse>('/users/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get current user profile (requires user authentication)
   * @returns Promise with user profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>('/users/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * User logout
   * @returns Promise with logout confirmation
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/users/logout');
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
export const userService = new UserService();
