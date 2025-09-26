import axios from 'axios';
import { apiClient } from './admin.service';


// Types for Orange connector
export interface OrangeConnectorRequest {
  username: string;
  password: string;
}

export interface OrangeConnectorResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface OrangeConnectorStatusResponse {
  success: boolean;
  message: string;
  data?: {
    username: string;
    isActive: boolean;
    isValid: boolean;
    connector_name: string;
  } | null;
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

class ConnectorService {
  /**
   * Connect Orange calendar
   * @param credentials - Orange email and password
   * @returns Promise with connection result
   */
  async connectOrangeCalendar(credentials: OrangeConnectorRequest): Promise<OrangeConnectorResponse> {
    try {
      const response = await apiClient.post<OrangeConnectorResponse>('/connectors/orange/connect', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get Orange calendar connection status
   * @returns Promise with connection status
   */
  async getOrangeCalendarStatus(): Promise<OrangeConnectorStatusResponse> {
    try {
      const response = await apiClient.get<OrangeConnectorStatusResponse>('/connectors/orange/status');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Disconnect Orange calendar
   * @returns Promise with disconnection result
   */
  async disconnectOrangeCalendar(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete('/connectors/orange/disconnect');
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
export const connectorService = new ConnectorService();
