import axios from 'axios';
import { apiClient } from './admin.service';

// Types for contact details
export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  domainName: string;
  address: string | null;
  codePostal: string | null;
  city: string | null;
  siteWeb: string | null;
}

export interface ContactDetailsResponse {
  success: boolean;
  message: string;
  data: ContactDetails;
}

export interface UpdateContactDetailsRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  domainName?: string;
  address?: string;
  codePostal?: string;
  city?: string;
  siteWeb?: string;
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

class ContactDetailsService {
  /**
   * Get current user contact details
   * @returns Promise with contact details response
   */
  async getContactDetails(): Promise<ContactDetailsResponse> {
    try {
      const response = await apiClient.get<ContactDetailsResponse>('/contact-details/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Update current user contact details
   * @param contactData - Contact details to update
   * @returns Promise with updated contact details response
   */
  async updateContactDetails(contactData: UpdateContactDetailsRequest): Promise<ContactDetailsResponse> {
    try {
      const response = await apiClient.put<ContactDetailsResponse>('/contact-details/me', contactData);
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
export const contactDetailsService = new ContactDetailsService();
