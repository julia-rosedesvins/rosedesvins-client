import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Types for booking creation
export interface PaymentMethodDetails {
  method: 'bank_card' | 'cheque' | 'stripe';
  bankCardDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

export interface CreateBookingRequest {
  userId: string;
  serviceId: string;
  bookingDate: string; // ISO date string
  bookingTime: string; // HH:MM format
  participantsAdults: number;
  participantsEnfants: number;
  selectedLanguage: string;
  userContactFirstname: string;
  userContactLastname: string;
  phoneNo: string;
  additionalNotes?: string;
  paymentMethod: PaymentMethodDetails;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    userId: string;
    serviceId: string;
    bookingDate: string;
    bookingTime: string;
    participants: number;
    participantsAdults: number;
    participantsEnfants: number;
    selectedLanguage: string;
    contactInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    paymentMethod: PaymentMethodDetails;
    specialRequests?: string;
    status: string;
    createdAt: string;
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

class BookingService {
  /**
   * Create a new booking
   * @param bookingData - Booking creation data
   * @returns Promise with booking creation result
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>('/bookings', bookingData);
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
export const bookingService = new BookingService();
