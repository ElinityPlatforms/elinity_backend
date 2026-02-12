import apiClient from './client';
import type { Game, GameSession } from '../types/api';

export const gamesApi = {
    getAllGames: async (): Promise<any> => {
        const response = await apiClient.get('/games/multiplayer/list');
        return response.data;
    },

    getMyGames: async (userId?: string): Promise<GameSession[]> => {
        const response = await apiClient.get<GameSession[]>('/games/multiplayer/my-games', {
            params: userId ? { user_id: userId } : {},
        });
        return response.data;
    },

    createRoom: async (gameSlug: string, maxPlayers: number): Promise<any> => {
        const response = await apiClient.post('/games/multiplayer/create', {
            game_slug: gameSlug,
            max_players: maxPlayers,
        });
        return response.data;
    },

    joinRoom: async (sessionId: string, userId: string): Promise<any> => {
        const response = await apiClient.post('/games/multiplayer/join', {
            session_id: sessionId,
            user_id: userId,
        });
        return response.data;
    },

    toggleReady: async (sessionId: string, userId: string): Promise<any> => {
        const response = await apiClient.post('/games/multiplayer/ready', {
            session_id: sessionId,
            user_id: userId,
        });
        return response.data;
    },

    startGame: async (sessionId: string): Promise<any> => {
        const response = await apiClient.post(`/games/multiplayer/start/${sessionId}`);
        return response.data;
    },

    getRoomDetails: async (sessionId: string): Promise<any> => {
        const response = await apiClient.get(`/games/multiplayer/session/${sessionId}`);
        return response.data;
    },

    sendChatMessage: async (sessionId: string, userId: string, message: string): Promise<any> => {
        const response = await apiClient.post('/games/multiplayer/chat', {
            session_id: sessionId,
            user_id: userId,
            message,
        });
        return response.data;
    },
};

export default gamesApi;
