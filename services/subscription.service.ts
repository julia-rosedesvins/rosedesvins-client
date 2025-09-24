import { apiClient } from './admin.service';

// Types for subscription management
export interface Subscription {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    domainName?: string;
    phoneNumber?: string;
  };
  adminId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes?: string;
  cancelledById?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrUpdateSubscriptionRequest {
  userId: string;
  startDate: string;
  endDate: string;
  notes?: string;
  isActive?: boolean;
}

export interface GetAllSubscriptionsQuery {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  userId?: string;
}

export interface PaginatedSubscriptionsResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: Subscription;
    isNew: boolean;
  };
}

export interface SubscriptionListResponse {
  success: boolean;
  message: string;
  data: PaginatedSubscriptionsResponse;
}

class SubscriptionService {
  async createOrUpdateSubscription(data: CreateOrUpdateSubscriptionRequest): Promise<SubscriptionResponse> {
    try {
      const response = await apiClient.post('/subscription/create-or-update', data);
      return response.data;
    } catch (error: any) {
      console.error('Create/Update subscription error:', error);
      throw error;
    }
  }

  async getAllSubscriptions(query: GetAllSubscriptionsQuery = {}): Promise<SubscriptionListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.status) params.append('status', query.status);
      if (query.userId) params.append('userId', query.userId);

      const response = await apiClient.get(`/subscription/admin/all?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Get subscriptions error:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
