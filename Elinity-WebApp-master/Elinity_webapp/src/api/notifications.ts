import apiClient from './client';
import type { Notification } from '../types/api';

export const notificationsApi = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await apiClient.get<Notification[]>('/notifications/');
        return response.data;
    },

    registerDeviceToken: async (token: string): Promise<any> => {
        const response = await apiClient.post('/notifications/token/', { token });
        return response.data;
    },

    markAsRead: async (id: string): Promise<any> => {
        const response = await apiClient.post(`/notifications/${id}/read`);
        return response.data;
    },
};

export default notificationsApi;
