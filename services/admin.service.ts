import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

// Types for admin login
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminUser {
  _id: string;
  id?: string; // For backward compatibility
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
  domainName?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  firstLoginAt?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedUsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UserActionRequest {
  userId: string;
  action: 'approve' | 'reject';
}

export interface UserActionResponse {
  success: boolean;
  message: string;
  user?: AdminUser;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
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

export interface SupportTicket {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    domainName?: string;
  };
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateTicketStatusRequest {
  ticketId: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
}

export interface AdminAnalyticsData {
  totalActiveUsers: number;
  totalPendingUsers: number;
  totalRejectedUsers: number;
  totalActiveSubscriptions: number;
  totalExpiredSubscriptions: number;
  totalOpenSupportTickets: number;
}

class AdminService {
  /**
   * Login admin user
   * @param credentials - Admin email and password
   * @returns Promise with admin user data
   */
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const response = await apiClient.post<AdminLoginResponse>('/users/admin/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Logout admin user
   * @returns Promise with logout confirmation
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/users/admin/logout');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get admin profile (requires authentication)
   * @returns Promise with admin profile data
   */
  async getProfile(): Promise<{ success: boolean; data: AdminUser }> {
    try {
      const response = await apiClient.get('/users/admin/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get admin dashboard data (requires authentication)
   * @returns Promise with dashboard data
   */
  async getDashboardData(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get pending approval users (requires admin authentication)
   * @param query - Pagination parameters
   * @returns Promise with paginated pending users
   */
  async getPendingApprovalUsers(query: PaginationQuery = {}): Promise<PaginatedUsersResponse> {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      
      const response = await apiClient.get(`/users/admin/pending-approval?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get approved users (requires admin authentication)
   * @param query - Pagination parameters
   * @returns Promise with paginated approved users
   */
  async getApprovedUsers(query: PaginationQuery = {}): Promise<PaginatedUsersResponse> {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      
      const response = await apiClient.get(`/users/admin/approved?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get rejected users (requires admin authentication)
   * @param query - Pagination parameters
   * @returns Promise with paginated rejected users
   */
  async getRejectedUsers(query: PaginationQuery = {}): Promise<PaginatedUsersResponse> {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      
      const response = await apiClient.get(`/users/admin/rejected?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Perform user action (approve or reject) (requires admin authentication)
   * @param request - User action request
   * @returns Promise with action result
   */
  async performUserAction(request: UserActionRequest): Promise<UserActionResponse> {
    try {
      const response = await apiClient.put('/users/admin/user-action', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get all support tickets (requires admin authentication)
   * @param query - Pagination parameters
   * @returns Promise with paginated support tickets
   */
  async getAllSupportTickets(query: PaginationQuery = {}): Promise<{
    success: boolean;
    message: string;
    data: SupportTicket[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTickets: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      
      const response = await apiClient.get(`/support-contact/admin/all-tickets?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Update support ticket status (requires admin authentication)
   * @param request - Ticket status update request
   * @returns Promise with updated ticket
   */
  async updateTicketStatus(request: UpdateTicketStatusRequest): Promise<{
    success: boolean;
    message: string;
    data: SupportTicket;
  }> {
    try {
      const response = await apiClient.put('/support-contact/admin/update-status', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get admin analytics data (requires admin authentication)
   * @returns Promise with admin analytics data
   */
  async getAdminAnalytics(): Promise<{
    success: boolean;
    message: string;
    data: AdminAnalyticsData;
  }> {
    try {
      const response = await apiClient.get('/dashboard-analytics/admin');
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
export const adminService = new AdminService();
