import apiClient from './client';
import type { Ritual, Moodboard, Quiz, QuestionCard } from '../types/api';

export const toolsApi = {
    // Rituals
    getRituals: async (): Promise<Ritual[]> => {
        const response = await apiClient.get<Ritual[]>('/tools/rituals');
        return response.data;
    },

    createRitual: async (data: Partial<Ritual>): Promise<Ritual> => {
        const response = await apiClient.post<Ritual>('/tools/rituals', data);
        return response.data;
    },

    completeRitual: async (id: string): Promise<Ritual> => {
        const response = await apiClient.post<Ritual>(`/tools/rituals/${id}/complete`);
        return response.data;
    },

    // Moodboards
    getMoodboards: async (): Promise<Moodboard[]> => {
        const response = await apiClient.get<Moodboard[]>('/tools/moodboards');
        return response.data;
    },

    createMoodboard: async (data: Partial<Moodboard>): Promise<Moodboard> => {
        const response = await apiClient.post<Moodboard>('/tools/moodboards', data);
        return response.data;
    },

    // Quizzes
    getQuizzes: async (): Promise<Quiz[]> => {
        const response = await apiClient.get<Quiz[]>('/tools/quizzes');
        return response.data;
    },

    createQuiz: async (data: Partial<Quiz>): Promise<Quiz> => {
        const response = await apiClient.post<Quiz>('/tools/quizzes', data);
        return response.data;
    },

    // Question Cards
    getQuestionCards: async (count: number = 25): Promise<QuestionCard[]> => {
        const response = await apiClient.get<QuestionCard[]>('/questions/cards/', {
            params: { count },
        });
        return response.data;
    },

    saveAnswer: async (questionId: string, answer: string): Promise<any> => {
        const response = await apiClient.post('/questions/answers/', {
            question_id: questionId,
            answer,
        });
        return response.data;
    },
};

export default toolsApi;
