import apiClient from './client';
import type { Event } from '../types/api';

export const eventsApi = {
    getEvents: async (): Promise<Event[]> => {
        const response = await apiClient.get<Event[]>('/events/');
        return response.data;
    },

    createEvent: async (data: Partial<Event>): Promise<Event> => {
        const response = await apiClient.post<Event>('/events/', data);
        return response.data;
    },

    inviteUser: async (eventId: string, userId: string): Promise<Event> => {
        const response = await apiClient.post<Event>(`/events/${eventId}/invite`, null, {
            params: { user_id: userId },
        });
        return response.data;
    },
};

export default eventsApi;
