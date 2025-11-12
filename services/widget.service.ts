import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Create axios instance with default config (reusing the same pattern as admin service)
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Types for widget data
export interface WidgetDataQuery {
  userId: string;
  serviceId: string;
}

export interface WidgetSubscription {
  id: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface WidgetDomainProfile {
  domainDescription: string;
  domainProfilePictureUrl?: string;
  domainLogoUrl?: string;
  colorCode: string;
}

export interface WidgetServiceData {
  id: string;
  name: string;
  description: string;
  numberOfPeople: string;
  pricePerPerson: number;
  timeOfServiceInMinutes: number;
  numberOfWinesTasted: number;
  languagesOffered: string[];
  isActive: boolean;
}

export interface SpecialDateOverride {
  date: string;
  enabled: boolean;
  morningEnabled: boolean;
  morningFrom: string;
  morningTo: string;
  afternoonEnabled: boolean;
  afternoonFrom: string;
  afternoonTo: string;
  _id: string;
}

export interface WidgetAvailability {
  weeklyAvailability: any;
  publicHolidays: any[];
  specialDateOverrides: SpecialDateOverride[];
  timezone: string;
  defaultSlotDuration: number;
  bufferTime: number;
  bookingRestrictionTime: string | null;
  multipleBookingsSameSlot: boolean;
  isActive: boolean;
}

export interface WidgetPaymentMethods {
  methods: string[];
}

export interface WidgetNotificationPreferences {
  bookingAdvanceLimit: string;
}

export interface WidgetDataResponse {
  success: boolean;
  message: string;
  data: {
    subscription: WidgetSubscription;
    domainProfile: WidgetDomainProfile;
    service: WidgetServiceData;
    availability: WidgetAvailability;
    paymentMethods: WidgetPaymentMethods;
    notificationPreferences: WidgetNotificationPreferences;
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

class WidgetService {
  /**
   * Get widget data for user and service (Public endpoint)
   * @param query - User ID and Service ID
   * @returns Promise with widget data
   */
  async getWidgetData(query: WidgetDataQuery): Promise<WidgetDataResponse> {
    try {
      const params = new URLSearchParams();
      params.append('userId', query.userId);
      params.append('serviceId', query.serviceId);
      
      const response = await apiClient.get<WidgetDataResponse>(`/widget/data?${params.toString()}`);
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
export const widgetService = new WidgetService();
