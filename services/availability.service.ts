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

// Helper functions for dynamic holidays
export const getEasterDate = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getHolidays = (year: number) => {
  const easter = getEasterDate(year);
  const easterMonday = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const whitMonday = addDays(easter, 50);

  return [
    { id: "new-year", name: "1er janvier", date: `${year}-01-01` },
    { id: "easter-monday", name: "Lundi de Pâques", date: formatDate(easterMonday) },
    { id: "labor-day", name: "1er mai", date: `${year}-05-01` },
    { id: "victory-day", name: "8 mai", date: `${year}-05-08` },
    { id: "ascension", name: "Ascension", date: formatDate(ascension) },
    { id: "whit-monday", name: "Lundi de Pentecôte", date: formatDate(whitMonday) },
    { id: "bastille-day", name: "14 juillet", date: `${year}-07-14` },
    { id: "assumption", name: "15 août", date: `${year}-08-15` },
    { id: "all-saints", name: "1er novembre", date: `${year}-11-01` },
    { id: "armistice", name: "11 novembre", date: `${year}-11-11` },
    { id: "christmas", name: "25 décembre", date: `${year}-12-25` },
  ];
};

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
