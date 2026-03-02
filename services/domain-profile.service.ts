import axios from "axios";
import { apiClient } from "./admin.service";

// Types for domain profile
export interface Service {
  _id: string;
  name: string;
  description: string;
  numberOfPeople: string;
  pricePerPerson: number;
  timeOfServiceInMinutes: number;
  numberOfWinesTasted: number;
  languagesOffered: string[];
  serviceBannerUrl: string | null;
  isActive: boolean;
  bookingRestrictionActive: boolean;
  bookingRestrictionTime: string;
  multipleBookings: boolean;
  hasCustomAvailability: boolean;
  dateAvailability: any[];
}

export interface DomainProfile {
  _id: string;
  userId: string;
  domainDescription: string;
  domainProfilePictureUrl: string | null;
  domainLogoUrl: string | null;
  mainImage?: string | null;
  colorCode: string;
  services: Service[];
  domainName: string;
  siteWeb: string | null;
  phone?: string | null;
  openingHours?: Record<string, string[]> | null;
  createdAt: string;
  updatedAt: string;
  producer?: string;
  staticExperienceId?: string;
}

export interface DomainLocation {
  domainLatitude: number | null;
  domainLongitude: number | null;
  address: string | null;
  city: string | null;
  codePostal: string | null;
}

export interface PublicDomainProfileResponse {
  success: boolean;
  message: string;
  data: {
    domainProfile: DomainProfile;
    location: DomainLocation;
  };
}

export interface PublicService {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  numberOfPeople: string;
  pricePerPerson: number;
  timeOfServiceInMinutes: number;
  numberOfWinesTasted: number;
  languagesOffered: string[];
  serviceBannerUrl: string | null;
  isActive: boolean;
  domain: {
    domainId: string;
    userId: string;
    domainName: string | null;
    domainDescription: string;
    colorCode: string;
    domainProfilePictureUrl: string | null;
    domainLogoUrl: string | null;
    location: {
      domainLatitude: number | null;
      domainLongitude: number | null;
      address: string | null;
      city: string | null;
      codePostal: string | null;
      region: string | null;
    };
  };
}

export interface PublicServicesResponse {
  success: boolean;
  message: string;
  data: {
    services: PublicService[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
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

class DomainProfileService {
  /**
   * Get public domain profile by ID
   * @param domainId - Domain profile ID
   * @returns Promise with domain profile and location data
   */
  async getPublicDomainProfile(domainId: string): Promise<PublicDomainProfileResponse> {
    try {
      const response = await apiClient.get<PublicDomainProfileResponse>(
        `/domain-profile/public/${domainId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  async getPublicStaticExperience(domainId: string): Promise<PublicDomainProfileResponse> {
    try {
      const response = await apiClient.get<PublicDomainProfileResponse>(
        `/static-experiences/public/${domainId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get all public services with pagination
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise with services list and pagination data
   */
  async getAllPublicServices(page: number = 1, limit: number = 10): Promise<PublicServicesResponse> {
    try {
      const response = await apiClient.get<PublicServicesResponse>(
        `/domain-profile/public/services/all?page=${page}&limit=${limit}`
      );
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
export const domainProfileService = new DomainProfileService();
