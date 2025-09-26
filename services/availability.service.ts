import axios from 'axios';
import { apiClient } from './admin.service';

// Types for time slots
export interface TimeSlot {
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
}

// Types for daily availability
export interface DayAvailability {
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

// Types for weekly availability
export interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

// Types for public holidays
export interface PublicHoliday {
  name: string;
  date: string; // ISO date string
  isBlocked?: boolean;
  isRecurring?: boolean;
  description?: string;
}

// Types for special date overrides
export interface SpecialDateAvailability {
  date: string; // ISO date string
  isAvailable: boolean;
  timeSlots?: TimeSlot[];
  reason?: string;
}

// Main availability data structure
export interface AvailabilityData {
  weeklyAvailability: WeeklyAvailability;
  publicHolidays?: PublicHoliday[];
  specialDateOverrides?: SpecialDateAvailability[];
  timezone?: string;
  defaultSlotDuration?: number;
  bufferTime?: number;
  isActive?: boolean;
}

// API response types
export interface SaveAvailabilityResponse {
  success: boolean;
  message: string;
  data: AvailabilityResponse;
}

export interface GetAvailabilityResponse {
  success: boolean;
  message: string;
  data: AvailabilityResponse | null;
}

export interface AvailabilityResponse {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    domainName: string;
  };
  weeklyAvailability: WeeklyAvailability;
  publicHolidays: PublicHoliday[];
  specialDateOverrides: SpecialDateAvailability[];
  timezone: string;
  defaultSlotDuration: number;
  bufferTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

class AvailabilityService {
  /**
   * Save user availability settings
   * @param availabilityData - Availability data to save
   * @returns Promise with save response
   */
  async saveAvailability(availabilityData: AvailabilityData): Promise<SaveAvailabilityResponse> {
    try {
      console.log('🔄 Saving availability settings:', availabilityData);
      
      const response = await apiClient.post<SaveAvailabilityResponse>(
        '/availability/save', 
        availabilityData
      );
      
      console.log('✅ Availability saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to save availability:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          
          // Server responded with error status
          const errorData = error.response.data;
          if (errorData && typeof errorData === 'object') {
            throw {
              success: false,
              message: errorData.message || `Server error: ${error.response.status}`,
              errors: errorData.errors || [],
              statusCode: error.response.status
            } as ApiError;
          } else {
            throw {
              success: false,
              message: `Server error: ${error.response.status} ${error.response.statusText}`,
              errors: [],
              statusCode: error.response.status
            } as ApiError;
          }
        } else if (error.request) {
          // Request was made but no response received
          throw {
            success: false,
            message: 'Impossible de se connecter au serveur. Vérifiez que le serveur est démarré.',
            errors: [],
            statusCode: 0
          } as ApiError;
        }
      }
      
      // Fallback for other errors
      throw {
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
        errors: [],
        statusCode: 0
      } as ApiError;
    }
  }

  /**
   * Get current user availability settings
   * @returns Promise with availability data
   */
  async getAvailability(): Promise<GetAvailabilityResponse> {
    try {
      console.log('🔍 Fetching user availability settings...');
      
      const response = await apiClient.get<GetAvailabilityResponse>('/availability/me');
      
      console.log('✅ Availability fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch availability:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          
          // Server responded with error status
          const errorData = error.response.data;
          if (errorData && typeof errorData === 'object') {
            throw {
              success: false,
              message: errorData.message || `Server error: ${error.response.status}`,
              errors: errorData.errors || [],
              statusCode: error.response.status
            } as ApiError;
          } else {
            throw {
              success: false,
              message: `Server error: ${error.response.status} ${error.response.statusText}`,
              errors: [],
              statusCode: error.response.status
            } as ApiError;
          }
        } else if (error.request) {
          // Request was made but no response received
          throw {
            success: false,
            message: 'Impossible de se connecter au serveur',
            errors: [],
            statusCode: 0
          } as ApiError;
        }
      }
      
      // Fallback for other errors
      throw {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des disponibilités',
        errors: [],
        statusCode: 0
      } as ApiError;
    }
  }
}

// Export singleton instance
export const availabilityService = new AvailabilityService();
