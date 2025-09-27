import { apiClient } from './admin.service';

// Types for notification preferences
export interface NotificationPreferencesData {
  _id?: string;
  userId?: string;
  customerNotificationBefore: string;
  providerNotificationBefore: string;
  bookingAdvanceLimit: string;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  labels?: {
    customerNotificationBefore: string;
    providerNotificationBefore: string;
    bookingAdvanceLimit: string;
  };
}

export interface CreateOrUpdateNotificationPreferencesRequest {
  customerNotificationBefore?: string;
  providerNotificationBefore?: string;
  bookingAdvanceLimit?: string;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
}

export interface NotificationPreferencesResponse {
  success: boolean;
  message: string;
  data: NotificationPreferencesData | null;
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

// Notification option constants
export const NOTIFICATION_OPTIONS = {
  ONE_HOUR: '1_hour',
  TWO_HOURS: '2_hours', 
  DAY_BEFORE: 'day_before',
  NEVER: 'never',
  LAST_MINUTE: 'last_minute'
} as const;

export type NotificationOption = typeof NOTIFICATION_OPTIONS[keyof typeof NOTIFICATION_OPTIONS];

class NotificationPreferencesService {
  /**
   * Get current user's notification preferences
   * @returns Promise with notification preferences data
   */
  async getNotificationPreferences(): Promise<NotificationPreferencesResponse> {
    try {
      const response = await apiClient.get<NotificationPreferencesResponse>('/notification-preferences');
      return response.data;
    } catch (error: any) {
      console.error('NotificationPreferencesService: Get preferences error:', error);
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Create or update notification preferences
   * @param preferencesData - Notification preferences data to save
   * @returns Promise with updated notification preferences
   */
  async createOrUpdateNotificationPreferences(
    preferencesData: CreateOrUpdateNotificationPreferencesRequest
  ): Promise<NotificationPreferencesResponse> {
    try {
      console.log('NotificationPreferencesService: Saving preferences:', preferencesData);
      const response = await apiClient.post<NotificationPreferencesResponse>(
        '/notification-preferences/create-or-update', 
        preferencesData
      );
      console.log('NotificationPreferencesService: Save response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('NotificationPreferencesService: Create/update error:', error);
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }
}

// Export singleton instance
export const notificationPreferencesService = new NotificationPreferencesService();
