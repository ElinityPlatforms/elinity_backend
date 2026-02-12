import apiClient from './client';
import type { SocialPost } from '../types/api';

export const socialApi = {
    getFeed: async (): Promise<SocialPost[]> => {
        const response = await apiClient.get<SocialPost[]>('/feed/');
        return response.data;
    },

    getPost: async (postId: string): Promise<SocialPost> => {
        const response = await apiClient.get<SocialPost>(`/feed/${postId}`);
        return response.data;
    },

    createPost: async (content: string, mediaUrls?: string[]): Promise<SocialPost> => {
        const response = await apiClient.post<SocialPost>('/feed/', {
            content,
            media_urls: mediaUrls || [],
        });
        return response.data;
    },

    addComment: async (postId: string, content: string, parentId?: string): Promise<SocialPost> => {
        const response = await apiClient.post<SocialPost>(`/feed/${postId}/comment`, {
            content,
            parent_id: parentId
        });
        return response.data;
    },

    likePost: async (postId: string): Promise<SocialPost> => {
        const response = await apiClient.post<SocialPost>(`/feed/${postId}/like`);
        return response.data;
    },

    generateMoodscape: async (postId: string): Promise<{ image_url: string }> => {
        const response = await apiClient.post<{ image_url: string }>(`/feed/${postId}/moodscape`);
        return response.data;
    },
};

export default socialApi;
