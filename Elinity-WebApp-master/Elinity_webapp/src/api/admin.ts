import apiClient from './client';

export const adminApi = {
    getStats: async (): Promise<any> => {
        const response = await apiClient.get('/admin-panel/stats');
        return response.data;
    },

    createReport: async (data: any): Promise<any> => {
        const response = await apiClient.post('/admin-panel/reports', data);
        return response.data;
    },

    suspendUser: async (userId: string): Promise<any> => {
        const response = await apiClient.post(`/admin-panel/users/${userId}/suspend`);
        return response.data;
    },

    resetSessions: async (userId: string): Promise<any> => {
        const response = await apiClient.post('/admin-panel/sessions/reset', null, {
            params: { user_id: userId },
        });
        return response.data;
    },

    getProfessionalInsights: async (): Promise<any> => {
        const response = await apiClient.get('/dashboard/professional-insights');
        return response.data;
    },
};

export default adminApi;
