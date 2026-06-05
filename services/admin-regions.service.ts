import { apiClient } from "./admin.service";

export interface Region {
  _id: string;
  denom: string;
  min_lat: number;
  min_lon: number;
  max_lat: number;
  max_lon: number;
  thumbnailUrl?: string;
  isParent: boolean;
  parent: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRegionData {
  denom: string;
  min_lat: number;
  min_lon: number;
  max_lat: number;
  max_lon: number;
  isParent?: boolean;
  parent?: string;
}

export interface UpdateRegionData {
  denom?: string;
  min_lat?: number;
  min_lon?: number;
  max_lat?: number;
  max_lon?: number;
  thumbnailUrl?: string;
  isParent?: boolean;
  parent?: string;
}

export interface PaginatedRegionsResponse {
  data: Region[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class AdminRegionsService {
  /**
   * Get all regions with pagination
   */
  async getAllRegions(page: number = 1, limit: number = 10, isParent?: boolean): Promise<PaginatedRegionsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (isParent !== undefined) {
        params.append('isParent', isParent.toString());
      }

      const response = await apiClient.get<PaginatedRegionsResponse>(`/regions?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  }

  /**
   * Create a new region
   */
  async createRegion(data: CreateRegionData): Promise<{ success: boolean; data: Region }> {
    try {
      const response = await apiClient.post<Region>('/regions/admin/create', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error creating region:', error);
      throw error;
    }
  }

  /**
   * Update a region
   */
  async updateRegion(id: string, data: UpdateRegionData): Promise<{ success: boolean; data: Region }> {
    try {
      const response = await apiClient.put<Region>(`/regions/admin/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error updating region:', error);
      throw error;
    }
  }

  /**
   * Delete a region
   */
  async deleteRegion(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/regions/admin/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting region:', error);
      throw error;
    }
  }

  /**
   * Upload region thumbnail
   */
  async uploadThumbnail(id: string, file: File): Promise<{ success: boolean; thumbnailUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ success: boolean; thumbnailUrl: string }>(
        `/regions/admin/${id}/thumbnail`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  }

  /**
   * Delete region thumbnail
   */
  async deleteThumbnail(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/regions/admin/${id}/thumbnail`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting thumbnail:', error);
      throw error;
    }
  }
}

export const adminRegionsService = new AdminRegionsService();
