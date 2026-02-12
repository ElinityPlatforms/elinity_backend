import apiClient from '../api/client';

export interface Lifebook {
    id: string;
    name: string;
    description?: string;
    tenant: string;
}

export interface LifebookEntry {
    id: string;
    lifebook_id: string;
    title: string;
    content: string;
    created_at: string;
}

export const lifebookService = {
    async getLifebooks(): Promise<Lifebook[]> {
        const response = await apiClient.get<Lifebook[]>('/lifebook/');
        return response.data;
    },

    async getEntries(lifebookId: string): Promise<LifebookEntry[]> {
        const response = await apiClient.get<LifebookEntry[]>(`/lifebook/${lifebookId}/entries`);
        return response.data;
    }
};

export function useLifebookService() {
    return lifebookService;
}
