import axios from "axios";
import { apiClient } from "./admin.service";
// Types for booking creation
export interface PaymentMethodDetails {
  method: 'bank_card' | 'cheque' | 'stripe' | 'cash_on_onsite';
  bankCardDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  chequeDetails?: {
    chequeNumber: string;
    bankName: string;
    issueDate: string; // ISO date string
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
  customerEmail: string;
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

// Types for booking update
export interface UpdateBookingRequest {
  serviceId?: string;
  bookingDate?: string; // ISO date string
  bookingTime?: string; // HH:MM format
  participantsAdults?: number;
  participantsEnfants?: number;
  selectedLanguage?: string;
  userContactFirstname?: string;
  userContactLastname?: string;
  customerEmail?: string;
  phoneNo?: string;
  additionalNotes?: string;
  paymentMethod?: PaymentMethodDetails;
  bookingStatus?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface UpdateBookingResponse {
  success: boolean;
  message: string;
  booking?: any;
}

export interface DeleteBookingResponse {
  success: boolean;
  message: string;
}

export interface BookingDetailsResponse {
  success: boolean;
  message: string;
  data?: {
    bookingId: string;
    bookingDate: string;
    bookingTime: string;
    participantsAdults: number;
    participantsEnfants: number;
    selectedLanguage: string;
    customerName: string;
    customerEmail: string;
    phoneNo: string;
    additionalNotes?: string;
    bookingStatus: string;
    service: {
      name: string;
      description: string;
      pricePerPerson: number;
      timeOfServiceInMinutes: number;
      numberOfWinesTasted: number;
      languagesOffered: string[];
    };
    domainInfo: {
      domainName: string;
      domainAddress: string;
      logoUrl: string;
    };
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

  /**
   * Update an existing booking
   * @param bookingId - ID of the booking to update
   * @param updateData - Partial booking data to update
   * @returns Promise with update result
   */
  async updateBooking(bookingId: string, updateData: UpdateBookingRequest): Promise<UpdateBookingResponse> {
    try {
      const response = await apiClient.put<UpdateBookingResponse>(`/bookings/${bookingId}`, updateData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Delete a booking
   * @param bookingId - ID of the booking to delete
   * @returns Promise with deletion result
   */
  async deleteBooking(bookingId: string): Promise<DeleteBookingResponse> {
    try {
      const response = await apiClient.delete<DeleteBookingResponse>(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Cancel a booking as a guest (public endpoint)
   * @param bookingId - ID of the booking to cancel
   * @returns Promise with cancellation result
   */
  async cancelBookingAsGuest(bookingId: string): Promise<UpdateBookingResponse> {
    try {
      const response = await apiClient.post<UpdateBookingResponse>(
        `/bookings/${bookingId}/cancel-guest`
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
   * Get basic booking details with service name (public endpoint)
   * @param bookingId - ID of the booking to retrieve details for
   * @returns Promise with booking details
   */
  async getBookingDetails(bookingId: string): Promise<BookingDetailsResponse> {
    try {
      const response = await apiClient.get<BookingDetailsResponse>(
        `/bookings/${bookingId}/details`
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
export const bookingService = new BookingService();
