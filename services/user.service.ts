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
}

// Export singleton instance
export const userService = new UserService();
