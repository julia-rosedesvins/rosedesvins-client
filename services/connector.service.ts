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
    _id: string;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      domainName: string;
    };
    connector_name: string;
    connector_creds: {
      orange: {
        username: string;
        password: string;
        isActive: boolean;
        isValid: boolean;
      } | null;
      ovh: any | null;
      microsoft: any | null;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
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
      console.log('🔗 Attempting connection to:', `${apiClient.defaults.baseURL}/connectors/orange/connect`);
      console.log('📝 Credentials:', { username: credentials.username, password: '***' });
      
      const response = await apiClient.post<OrangeConnectorResponse>('/connectors/orange/connect', credentials);
      console.log('✅ Connection successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Service error details:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          
          // Server responded with error status
          const errorData = error.response.data;
          if (errorData && typeof errorData === 'object') {
            // Handle nested message structure (message.message)
            let extractedMessage = '';
            if (errorData.message && typeof errorData.message === 'object' && errorData.message.message) {
              extractedMessage = errorData.message.message;
            } else if (errorData.message && typeof errorData.message === 'string') {
              extractedMessage = errorData.message;
            } else {
              extractedMessage = `Server error: ${error.response.status}`;
            }
            
            throw {
              success: false,
              message: extractedMessage,
              errors: errorData.errors || [],
              statusCode: error.response.status
            } as ApiError;
          } else {
            throw {
              success: false,
              message: `Server error: ${error.response.status} ${error.response.statusText}`,
              errors: [],
              statusCode: error.response.status
            } as ApiError;
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          // Request was made but no response received
          throw {
            success: false,
            message: 'Impossible de se connecter au serveur. Vérifiez que le serveur est démarré sur le port correct.',
            errors: [],
            statusCode: 0
          } as ApiError;
        }
      }
      
      // Fallback for other errors
      throw {
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite',
        errors: [],
        statusCode: 0
      } as ApiError;
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
      console.error('Status check error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const errorData = error.response.data;
          if (errorData && typeof errorData === 'object') {
            // Handle nested message structure (message.message)
            let extractedMessage = '';
            if (errorData.message && typeof errorData.message === 'object' && errorData.message.message) {
              extractedMessage = errorData.message.message;
            } else if (errorData.message && typeof errorData.message === 'string') {
              extractedMessage = errorData.message;
            } else {
              extractedMessage = `Server error: ${error.response.status}`;
            }
            
            throw {
              success: false,
              message: extractedMessage,
              errors: errorData.errors || [],
              statusCode: error.response.status
            } as ApiError;
          } else {
            throw {
              success: false,
              message: `Server error: ${error.response.status} ${error.response.statusText}`,
              errors: [],
              statusCode: error.response.status
            } as ApiError;
          }
        } else if (error.request) {
          // Request was made but no response received
          throw {
            success: false,
            message: 'Impossible de se connecter au serveur',
            errors: [],
            statusCode: 0
          } as ApiError;
        }
      }
      
      // Fallback for other errors
      throw {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la vérification du statut',
        errors: [],
        statusCode: 0
      } as ApiError;
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
