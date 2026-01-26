import axios from "axios";
import { apiClient } from "./admin.service";

// Types for regions
export interface Region {
  _id: string;
  denom: string;
  min_lat: number;
  min_lon: number;
  max_lat: number;
  max_lon: number;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedRegionsResponse {
  data: Region[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

class RegionService {
  /**
   * Get all regions with pagination
   * @param query - Pagination parameters
   * @returns Promise with paginated regions
   */
  async getAllRegions(query: PaginationQuery = {}): Promise<PaginatedRegionsResponse> {
    try {
      const params = new URLSearchParams();
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      
      const response = await apiClient.get<PaginatedRegionsResponse>(`/regions?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get region by name
   * @param name - Region name
   * @returns Promise with region data
   */
  async getRegionByName(name: string): Promise<Region> {
    try {
      const response = await apiClient.get<Region>(`/regions/${name}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ApiError;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Search regions
   * @param query - Search query
   * @returns Promise with matching regions
   */
  async searchRegions(query: string): Promise<Region[]> {
    try {
      const response = await apiClient.get<Region[]>(`/regions/search?q=${encodeURIComponent(query)}`);
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
export const regionService = new RegionService();
