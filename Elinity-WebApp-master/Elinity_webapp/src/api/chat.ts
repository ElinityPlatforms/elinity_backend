import apiClient from './client';
import type { Chat, Message, Group } from '../types/api';

export const chatApi = {
    getChats: async (): Promise<any[]> => {
        const response = await apiClient.get('/chats/inbox');
        return response.data;
    },

    getChat: async (chatId: string): Promise<Chat> => {
        const response = await apiClient.get<Chat>(`/chats/${chatId}`);
        return response.data;
    },

    getChatHistory: async (groupId: string): Promise<any[]> => {
        const response = await apiClient.get(`/chats/history/${groupId}`);
        return response.data;
    },

    sendDirectMessage: async (targetId: string, message: string): Promise<any> => {
        const response = await apiClient.post(`/chats/direct/${targetId}`, { message });
        return response.data;
    },

    getIcebreaker: async (mode: string = 'universal'): Promise<any> => {
        const response = await apiClient.post('/chats/icebreaker', null, { params: { mode } });
        return response.data;
    },

    analyzeChat: async (groupId: string): Promise<any> => {
        const response = await apiClient.post(`/chats/${groupId}/analysis`);
        return response.data;
    },

    createGroup: async (name: string, description?: string): Promise<Group> => {
        const response = await apiClient.post<Group>('/groups/', {
            name,
            description: description || '',
            type: 'group'
        });
        return response.data;
    },

    setupGroup: async (name: string, description: string, memberIds: string[]): Promise<Group> => {
        const response = await apiClient.post<Group>('/groups/wizard', {
            name,
            description,
            member_ids: memberIds
        });
        return response.data;
    },

    sendGroupMessage: async (groupId: string, message: string): Promise<any> => {
        const response = await apiClient.post(`/chats/`, {
            group: groupId,
            message
        });
        return response.data;
    },

    seed: async (): Promise<any> => {
        const response = await apiClient.post('/chats/seed');
        return response.data;
    },
};

export default chatApi;
