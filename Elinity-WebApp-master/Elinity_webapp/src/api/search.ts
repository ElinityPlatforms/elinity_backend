import apiClient from './client';

export const searchApi = {
    globalSearch: async (query: string): Promise<any> => {
        const response = await apiClient.get('/search/global', {
            params: { q: query },
        });
        return response.data;
    },
};

export default searchApi;
