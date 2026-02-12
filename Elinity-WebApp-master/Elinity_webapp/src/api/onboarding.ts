import apiClient from './client';

export const onboardingApi = {
    startVoice: async () => {
        const response = await apiClient.post('/onboarding/voice/start');
        return response.data;
    },

    continueVoice: async (data: { text?: string; audio?: File }) => {
        const formData = new FormData();
        if (data.text) formData.append('text', data.text);
        if (data.audio) formData.append('file', data.audio);

        const response = await apiClient.put('/onboarding/voice/continue', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getAudioUrl: (filename: string) => {
        return `${import.meta.env.VITE_API_BASE}/onboarding/voice/audio/${filename}`;
    },
};

export default onboardingApi;
