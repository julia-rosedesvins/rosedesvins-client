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

export interface UserSubscription {
  _id: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes?: string;
  adminId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  cancelledById?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
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
  subscription?: UserSubscription;
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

// Types for change password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
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

// Types for domain profile
export interface DomainService {
  _id: string;
  serviceName: string;
  serviceDescription: string;
  numberOfPeople: number;
  pricePerPerson: number;
  timeOfServiceInMinutes: number;
  numberOfWinesTasted: number;
  languagesOffered: string[];
  isActive: boolean;
}

export interface DomainProfile {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    domainName: string;
  };
  domainDescription?: string;
  domainType?: string;
  domainTag?: string;
  domainColor?: string;
  domainProfilePictureUrl?: string;
  domainLogoUrl?: string;
  services: DomainService[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrUpdateDomainProfileRequest {
  domainName?: string;
  domainDescription?: string;
  domainType?: string;
  domainTag?: string;
  domainColor?: string;
}

export interface DomainProfileResponse {
  success: boolean;
  message: string;
  data: {
    domainProfile: DomainProfile;
    isNew: boolean;
  };
}

export interface GetDomainProfileResponse {
  success: boolean;
  message: string;
  data: DomainProfile | null;
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

  /**
   * Change user password
   * @param passwordData - Current and new password data
   * @returns Promise with change password response
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      console.log('UserService: Sending change password request');
      const response = await apiClient.post<ChangePasswordResponse>('/users/change-password', passwordData);
      console.log('UserService: Change password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('UserService: Change password error:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('UserService: Error response data:', error.response.data);
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Create or update domain profile with file uploads
   * @param domainProfileData - Domain profile data
   * @param files - Optional files for profile picture and logo
   * @returns Promise with domain profile response
   */
  async createOrUpdateDomainProfile(
    domainProfileData: CreateOrUpdateDomainProfileRequest,
    files?: {
      domainProfilePicture?: File;
      domainLogo?: File;
    }
  ): Promise<DomainProfileResponse> {
    try {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(domainProfileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add files if provided
      if (files?.domainProfilePicture) {
        formData.append('domainProfilePicture', files.domainProfilePicture);
      }
      if (files?.domainLogo) {
        formData.append('domainLogo', files.domainLogo);
      }

      const response = await apiClient.post<DomainProfileResponse>(
        '/domain-profile/create-or-update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('UserService: Create/update domain profile error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get current user's domain profile
   * @returns Promise with domain profile data
   */
  async getDomainProfile(): Promise<GetDomainProfileResponse> {
    try {
      const response = await apiClient.get<GetDomainProfileResponse>('/domain-profile/me');
      return response.data;
    } catch (error) {
      console.error('UserService: Get domain profile error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Add a new service to domain profile
   * @param serviceData - Service data to add
   * @returns Promise with service response
   */
  async addService(serviceData: DomainService): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await apiClient.post('/domain-profile/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('UserService: Add service error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get all services for current user's domain profile
   * @returns Promise with services array
   */
  async getServices(): Promise<{ success: boolean; message: string; data: DomainService[] }> {
    try {
      const response = await apiClient.get('/domain-profile/services');
      return response.data;
    } catch (error) {
      console.error('UserService: Get services error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Update a service by index
   * @param serviceIndex - Index of the service to update
   * @param serviceData - Updated service data
   * @returns Promise with updated service response
   */
  async updateService(serviceIndex: number, serviceData: Partial<DomainService>): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await apiClient.put(`/domain-profile/services/${serviceIndex}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('UserService: Update service error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Delete a service by index
   * @param serviceIndex - Index of the service to delete
   * @returns Promise with delete confirmation
   */
  async deleteService(serviceIndex: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/domain-profile/services/${serviceIndex}`);
      return response.data;
    } catch (error) {
      console.error('UserService: Delete service error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Toggle service active status
   * @param serviceIndex - Index of the service to toggle
   * @returns Promise with updated service response
   */
  async toggleServiceActive(serviceIndex: number): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await apiClient.put(`/domain-profile/services/${serviceIndex}/toggle-active`);
      return response.data;
    } catch (error) {
      console.error('UserService: Toggle service active error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }
}

// Export singleton instance
export const userService = new UserService();
