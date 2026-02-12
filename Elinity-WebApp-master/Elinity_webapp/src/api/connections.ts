import apiClient from './client';

export const connectionsApi = {
    // Fetch daily recommendations for a specific mode
    getDailyRecommendations: async (mode: 'romantic' | 'social' | 'professional' = 'social') => {
        const response = await apiClient.get(`/connections/daily/${mode}`);
        return response.data;
    },

    // Handle actions: accept (connect), decline, archive
    handleAction: async (connectionId: string, action: 'accept' | 'decline' | 'archive', reason?: string, feedback?: string) => {
        const response = await apiClient.post(`/connections/action/${connectionId}`, {
            action,
            reason,
            feedback
        });
        return response.data;
    },

    // Confirm a relationship (move to personal circle)
    confirmRelationship: async (connectionId: string) => {
        const response = await apiClient.post(`/connections/confirm/${connectionId}`);
        return response.data;
    },

    // List connections by status
    listConnections: async (status: string = 'personal_circle') => {
        const response = await apiClient.get('/connections/', {
            params: { status_filter: status }
        });
        return response.data;
    },

    // List pending requests sent to me
    getPendingRequests: async () => {
        const response = await apiClient.get('/connections/pending');
        return response.data;
    }
};

export default connectionsApi;
