import apiClient from './client';

export const aiModesApi = {
    startModeSession: async (modeName: string, message: string): Promise<any> => {
        const response = await apiClient.post(`/ai-mode/${modeName}/start`, {
            message,
        });
        return response.data;
    },
    listGames: async (): Promise<any> => {
        const response = await apiClient.get('/ai-mode/games/list');
        return response.data;
    },
    recommendGame: async (query: string): Promise<any> => {
        const response = await apiClient.post('/ai-mode/games/recommend', null, {
            params: { query },
        });
        return response.data;
    },
    getHistory: async (modeName: string): Promise<any> => {
        const response = await apiClient.get(`/ai-mode/${modeName}/history`);
        return response.data;
    },
};


export default aiModesApi;
