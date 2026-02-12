import apiClient from './client';
import type { LoginRequest, RegisterRequest, TokenResponse, RefreshRequest } from '../types';

export const authApi = {
    /**
     * Register a new user
     */
    register: async (data: RegisterRequest): Promise<TokenResponse> => {
        const response = await apiClient.post<TokenResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Login user
     */
    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const response = await apiClient.post<TokenResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Refresh access token
     */
    refresh: async (data: RefreshRequest): Promise<TokenResponse> => {
        const response = await apiClient.post<TokenResponse>('/auth/refresh', data);
        return response.data;
    },

    /**
     * OAuth2 token endpoint (for Swagger)
     */
    token: async (username: string, password: string): Promise<TokenResponse> => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await apiClient.post<TokenResponse>('/auth/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },
};

export default authApi;
