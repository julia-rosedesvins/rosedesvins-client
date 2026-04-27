import { apiClient } from './admin.service';

export const citiesService = {
    async searchCities(query: string, signal?: AbortSignal) {
        try {
            const response = await apiClient.get(`/cities/search`, {
                params: { q: query },
                signal,
            });
            return response.data;
        } catch (error) {
            console.error('Error searching cities:', error);
            throw error;
        }
    }
};
