import apiClient from './client';

export const lumiApi = {
    chat: async (query: string, session_id?: string): Promise<any> => {
        const response = await apiClient.post('/lumi/chat/', { query, session_id });
        return response.data;
    },
    getHistory: async (): Promise<any> => {
        const response = await apiClient.get('/lumi/history/');
        return response.data;
    }
};

export default lumiApi;

