import apiClient from './client';
import type { Journal, JournalCreate } from '../types/api';

export const journalApi = {
    getJournals: async (): Promise<Journal[]> => {
        const response = await apiClient.get<Journal[]>('/journal/');
        return response.data;
    },

    getJournal: async (id: string): Promise<Journal> => {
        const response = await apiClient.get<Journal>(`/journal/${id}`);
        return response.data;
    },

    createJournal: async (data: JournalCreate): Promise<Journal> => {
        const response = await apiClient.post<Journal>('/journal/', data);
        return response.data;
    },

    updateJournal: async (id: string, data: JournalCreate): Promise<Journal> => {
        const response = await apiClient.put<Journal>(`/journal/${id}`, data);
        return response.data;
    },

    deleteJournal: async (id: string): Promise<void> => {
        await apiClient.delete(`/journal/${id}`);
    },
};

export default journalApi;
