import axios from 'axios';
import { apiClient } from './admin.service';

export interface NewsletterSubscription {
  _id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  createdUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedSubscriptionsResponse {
  success: boolean;
  data: NewsletterSubscription[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSubscriptions: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApproveSubscriptionRequest {
  subscriptionId: string;
  firstName: string;
  lastName: string;
  domainName: string;
}

export interface RejectSubscriptionRequest {
  subscriptionId: string;
  rejectionReason?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

class NewsletterService {
  async subscribe(email: string): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/v1/newsletter/subscribe`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('Network error occurred');
    }
  }

  async getPendingSubscriptions(page: number = 1, limit: number = 10): Promise<PaginatedSubscriptionsResponse> {
    try {
      const response = await apiClient.get(`/newsletter/pending`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('Newsletter service error:', error);
      console.error('Error response:', error.response);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async getRejectedSubscriptions(page: number = 1, limit: number = 10): Promise<PaginatedSubscriptionsResponse> {
    try {
      const response = await apiClient.get(`/newsletter/rejected`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('Network error occurred');
    }
  }

  async approveAndCreateUser(data: ApproveSubscriptionRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/newsletter/approve', data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('Network error occurred');
    }
  }

  async rejectSubscription(data: RejectSubscriptionRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/newsletter/reject', data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('Network error occurred');
    }
  }
}

export const newsletterService = new NewsletterService();
