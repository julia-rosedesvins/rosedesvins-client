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
  domainDescription: string;
  domainProfilePictureUrl: string | null;
  domainLogoUrl: string | null;
  colorCode: string;
  services: Service[];
  domainName: string;
  siteWeb: string;
  createdAt: string;
  updatedAt: string;
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
}

// Export singleton instance
export const domainProfileService = new DomainProfileService();
