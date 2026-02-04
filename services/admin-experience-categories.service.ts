import { apiClient } from "./admin.service";

export interface ExperienceCategory {
  _id: string;
  category_name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedExperienceCategories {
  items: ExperienceCategory[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateExperienceCategoryDto {
  category_name: string;
  isActive?: boolean;
}

export interface UpdateExperienceCategoryDto {
  category_name?: string;
  isActive?: boolean;
}

class AdminExperienceCategoriesService {
  async getAll(page: number = 1, limit: number = 10, isActive?: boolean): Promise<PaginatedExperienceCategories> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (isActive !== undefined) {
        params.append('isActive', isActive.toString());
      }

      const response = await apiClient.get<PaginatedExperienceCategories>(`/experience-categories/admin?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching experience categories:', error);
      throw error;
    }
  }

  async getActiveCategories(): Promise<ExperienceCategory[]> {
    try {
      const response = await apiClient.get<ExperienceCategory[]>('/experience-categories/active');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching active categories:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<ExperienceCategory> {
    try {
      const response = await apiClient.get<ExperienceCategory>(`/experience-categories/admin/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching experience category:', error);
      throw error;
    }
  }

  async create(data: CreateExperienceCategoryDto): Promise<ExperienceCategory> {
    try {
      const response = await apiClient.post<ExperienceCategory>('/experience-categories/admin', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating experience category:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateExperienceCategoryDto): Promise<ExperienceCategory> {
    try {
      const response = await apiClient.put<ExperienceCategory>(`/experience-categories/admin/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating experience category:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/experience-categories/admin/${id}`);
    } catch (error: any) {
      console.error('Error deleting experience category:', error);
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ExperienceCategory> {
    try {
      const response = await apiClient.patch<ExperienceCategory>(`/experience-categories/admin/${id}/toggle-active`);
      return response.data;
    } catch (error: any) {
      console.error('Error toggling category status:', error);
      throw error;
    }
  }
}

export const adminExperienceCategoriesService = new AdminExperienceCategoriesService();
