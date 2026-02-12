import apiClient from './client';
import type { RecommendedUser } from '../types/api';

export const recommendationsApi = {
    getRecommendations: async (): Promise<any> => {
        const response = await apiClient.get('/recommendations/');
        return response.data;
    },

    searchUsers: async (query: string): Promise<RecommendedUser[]> => {
        const response = await apiClient.get<RecommendedUser[]>('/recommendations/search', {
            params: { query },
        });
        return response.data;
    },

    sendConnectionRequest: async (targetId: string, mode: string = 'social'): Promise<any> => {
        const response = await apiClient.post(`/connections/request/${targetId}`, { mode });
        return response.data;
    },
};


export default recommendationsApi;
