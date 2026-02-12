import apiClient from './client';

export interface Skill {
    id: number;
    name: string;
    description: string;
    notes?: string;
}

export interface SkillSession {
    skill: string;
    session_title: string;
    ai_message: string;
    session_id: string;
}

export const skillsApi = {
    getRelationshipSkills: async (): Promise<Skill[]> => {
        const response = await apiClient.get<Skill[]>('/relationship-skills/');
        return response.data;
    },

    getSelfGrowthSkills: async (): Promise<Skill[]> => {
        const response = await apiClient.get<Skill[]>('/self-growth/');
        return response.data;
    },

    getSocialSkills: async (): Promise<Skill[]> => {
        const response = await apiClient.get<Skill[]>('/social/');
        return response.data;
    },

    startSkillSession: async (type: 'relationship' | 'self-growth' | 'social', skillId: number, sessionNumber: number = 1): Promise<SkillSession> => {
        const prefix = type === 'relationship' ? 'relationship-skills' : type === 'social' ? 'social' : 'self-growth';
        const response = await apiClient.post<SkillSession>(`/${prefix}/${skillId}/start?session_number=${sessionNumber}`);
        return response.data;
    },

    replyToSkillSession: async (type: 'relationship' | 'self-growth' | 'social', skillId: number, sessionId: string, userInput: string): Promise<{ reply: string }> => {
        const prefix = type === 'relationship' ? 'relationship-skills' : type === 'social' ? 'social' : 'self-growth';
        const response = await apiClient.post<{ reply: string }>(`/${prefix}/${skillId}/reply`, {
            session_id: sessionId,
            user_input: userInput
        });
        return response.data;
    }
};

export default skillsApi;
