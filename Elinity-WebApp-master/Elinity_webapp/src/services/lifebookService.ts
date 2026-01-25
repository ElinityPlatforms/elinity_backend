
import { useApiClient } from "./apiClient";

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

export async function useLifebookService() {
    const fetchClient = useApiClient();

    const getLifebooks = async (): Promise<Lifebook[]> => {
        const res = await fetchClient("/lifebook/");
        if (!res.ok) throw new Error("Failed to fetch lifebooks");
        return res.json();
    };

    const getEntries = async (lifebookId: string): Promise<LifebookEntry[]> => {
        const res = await fetchClient(`/lifebook/${lifebookId}/entries`);
        if (!res.ok) throw new Error("Failed to fetch entries");
        return res.json();
    };

    return { getLifebooks, getEntries };
}
