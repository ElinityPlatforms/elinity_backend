import apiClient from './client';
import type { Lifebook, LifebookEntry } from '../types/api';

export const lifebookApi = {
    getLifebooks: async (): Promise<Lifebook[]> => {
        const response = await apiClient.get<Lifebook[]>('/lifebook/');
        return response.data;
    },

    getCategories: async (): Promise<Lifebook[]> => {
        const response = await apiClient.get<Lifebook[]>('/lifebook/');
        return response.data;
    },

    getEntries: async (lifebookId: string): Promise<LifebookEntry[]> => {
        const response = await apiClient.get<LifebookEntry[]>(`/lifebook/${lifebookId}/entries`);
        return response.data;
    },

    createEntry: async (lifebookId: string, data: Partial<LifebookEntry>): Promise<LifebookEntry> => {
        const response = await apiClient.post<LifebookEntry>(`/lifebook/${lifebookId}/entries`, data);
        return response.data;
    },
};

export default lifebookApi;
