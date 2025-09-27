import { apiClient } from './admin.service';

// Types for payment methods
export interface PaymentMethodsData {
  _id?: string;
  userId?: string;
  methods: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdatePaymentMethodsRequest {
  methods: string[];
}

export interface PaymentMethodsResponse {
  success: boolean;
  message: string;
  data: PaymentMethodsData | null;
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

// Payment method constants
export const PAYMENT_METHOD_OPTIONS = {
  BANK_CARD: 'bank card',
  CHECKS: 'checks',
  CASH: 'cash'
} as const;

export type PaymentMethodOption = typeof PAYMENT_METHOD_OPTIONS[keyof typeof PAYMENT_METHOD_OPTIONS];

class PaymentMethodsService {
  /**
   * Get current user's payment methods
   * @returns Promise with payment methods data
   */
  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    try {
      const response = await apiClient.get<PaymentMethodsResponse>('/payment-methods');
      return response.data;
    } catch (error: any) {
      console.error('PaymentMethodsService: Get payment methods error:', error);
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Create or update payment methods
   * @param methodsData - Payment methods data to save
   * @returns Promise with updated payment methods
   */
  async createOrUpdatePaymentMethods(
    methodsData: CreateOrUpdatePaymentMethodsRequest
  ): Promise<PaymentMethodsResponse> {
    try {
      console.log('PaymentMethodsService: Saving payment methods:', methodsData);
      const response = await apiClient.post<PaymentMethodsResponse>(
        '/payment-methods/create-or-update', 
        methodsData
      );
      console.log('PaymentMethodsService: Save response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('PaymentMethodsService: Create/update error:', error);
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }
}

// Export singleton instance
export const paymentMethodsService = new PaymentMethodsService();
