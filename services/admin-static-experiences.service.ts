import { apiClient } from "./admin.service";

export interface StaticExperience {
  _id: string;
  name: string;
  domain_name?: string;
  domain_description?: string;
  domain_profile_pic_url?: string;
  domain_logo_url?: string;
  category?: string;
  category_ref?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviews?: number;
  website?: string;
  phone?: string;
  opening_hours?: Record<string, string[]>;
  main_image?: string;
  image_1?: string;
  image_2?: string;
  about?: string;
  url?: string;
}

export interface PaginatedStaticExperiences {
  items: StaticExperience[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateStaticExperienceDto {
  name: string;
  domain_name?: string;
  domain_description?: string;
  domain_profile_pic_url?: string;
  domain_logo_url?: string;
  category?: string;
  category_ref?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviews?: number;
  website?: string;
  phone?: string;
  opening_hours?: Record<string, string[]>;
  about?: string;
  url?: string;
}

export interface UpdateStaticExperienceDto {
  name?: string;
  domain_name?: string;
  domain_description?: string;
  domain_profile_pic_url?: string;
  domain_logo_url?: string;
  category?: string;
  category_ref?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviews?: number;
  website?: string;
  phone?: string;
  opening_hours?: Record<string, string[]>;
  main_image?: string;
  image_1?: string;
  image_2?: string;
  about?: string;
  url?: string;
}

class AdminStaticExperiencesService {
  async getAll(page: number = 1, limit: number = 10): Promise<PaginatedStaticExperiences> {
    try {
      const response = await apiClient.get<PaginatedStaticExperiences>(`/static-experiences/admin?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching static experiences:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<StaticExperience> {
    try {
      const response = await apiClient.get<StaticExperience>(`/static-experiences/admin/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching static experience:', error);
      throw error;
    }
  }

  async create(data: CreateStaticExperienceDto): Promise<StaticExperience> {
    try {
      const response = await apiClient.post<StaticExperience>('/static-experiences/admin', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating static experience:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateStaticExperienceDto): Promise<StaticExperience> {
    try {
      const response = await apiClient.put<StaticExperience>(`/static-experiences/admin/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating static experience:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/static-experiences/admin/${id}`);
    } catch (error: any) {
      console.error('Error deleting static experience:', error);
      throw error;
    }
  }

  async uploadMainImage(id: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ imageUrl: string }>(
        `/static-experiences/admin/${id}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.imageUrl;
    } catch (error: any) {
      console.error('Error uploading main image:', error);
      throw error;
    }
  }

  async deleteMainImage(id: string): Promise<void> {
    try {
      await apiClient.delete(`/static-experiences/admin/${id}/image`);
    } catch (error: any) {
      console.error('Error deleting main image:', error);
      throw error;
    }
  }

  async uploadDomainProfilePic(id: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ imageUrl: string }>(
        `/static-experiences/admin/${id}/domain-profile-pic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.imageUrl;
    } catch (error: any) {
      console.error('Error uploading domain profile picture:', error);
      throw error;
    }
  }

  async uploadDomainLogo(id: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ imageUrl: string }>(
        `/static-experiences/admin/${id}/domain-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.imageUrl;
    } catch (error: any) {
      console.error('Error uploading domain logo:', error);
      throw error;
    }
  }
}

export const adminStaticExperiencesService = new AdminStaticExperiencesService();
