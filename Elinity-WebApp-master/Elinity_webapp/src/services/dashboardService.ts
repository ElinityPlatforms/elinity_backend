import apiClient from '../api/client';

export async function fetchPersonalDashboard() {
    try {
        const response = await apiClient.get('/dashboard/me');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch personal dashboard:", error);
        return null;
    }
}

export async function fetchRelationshipDashboard() {
    try {
        const response = await apiClient.get('/dashboard/relationship');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch relationship dashboard:", error);
        return null;
    }
}
