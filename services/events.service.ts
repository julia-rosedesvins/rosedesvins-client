import axios from 'axios';
import { apiClient } from './admin.service';

// Types for events
export interface EventData {
  _id: string;
  userId: string;
  bookingId?: {
    _id: string;
    bookingDate: string;
    bookingTime: string;
    userContactFirstname: string;
    userContactLastname: string;
    bookingStatus: string;
  } | null;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventDescription?: string;
  eventType: 'booking' | 'personal' | 'external' | 'blocked';
  externalCalendarSource?: string;
  externalEventId?: string;
  eventStatus: 'active' | 'cancelled' | 'completed' | 'rescheduled';
  isAllDay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserEventsResponse {
  success: boolean;
  message: string;
  data: EventData[];
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

// Public schedule interface (minimal data)
export interface PublicScheduleData {
  eventDate: string;
  eventTime: string;
}

export interface GetPublicScheduleResponse {
  success: boolean;
  message: string;
  data: PublicScheduleData[];
}

class EventsService {
  /**
   * Get all events for the current authenticated user
   * @returns Promise with user's events
   */
  async getUserEvents(): Promise<GetUserEventsResponse> {
    try {
      const response = await apiClient.get<GetUserEventsResponse>('/events/my-events');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get public schedule for a specific user (no authentication required)
   * @param userId - The user ID to get schedule for
   * @returns Promise with user's schedule (dates and times only)
   */
  async getPublicUserSchedule(userId: string): Promise<GetPublicScheduleResponse> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
      const response = await axios.get<GetPublicScheduleResponse>(
        `${API_BASE_URL}/v1/events/public/user/${userId}/schedule`
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
export const eventsService = new EventsService();
