import apiClient from './client';

export const evaluationApi = {
    getReport: async (sessionId: string) => {
        const response = await apiClient.post(`/evaluate/session/${sessionId}`);
        return response.data;
    },
};

export default evaluationApi;
