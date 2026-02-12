import apiClient from './client';
import type {
    User,
    PersonalInfo,
    BigFiveTraits,
    MBTITraits,
    Psychology,
    InterestsAndHobbies,
    ValuesBeliefsAndGoals,
    Favorites,
    RelationshipPreferences,
    FriendshipPreferences,
    CollaborationPreferences,
    PersonalFreeForm,
    Intentions,
    IdealCharacteristics,
    AspirationAndReflections,
    Lifestyle,
    ProfilePicture,
} from '../types/api';

export const profileApi = {
    /**
     * Get current user profile
     */
    getMe: async (): Promise<User> => {
        const response = await apiClient.get<User>('/users/me');
        return response.data;
    },

    /**
     * Get user by ID
     */
    getUser: async (userId: string): Promise<User> => {
        const response = await apiClient.get<User>(`/users/${userId}`);
        return response.data;
    },

    /**
     * Update personal info
     */
    updatePersonalInfo: async (data: PersonalInfo): Promise<PersonalInfo> => {
        const response = await apiClient.put<PersonalInfo>('/users/me/personal-info', data);
        return response.data;
    },

    /**
     * Update Big Five personality traits
     */
    updateBigFive: async (data: BigFiveTraits): Promise<BigFiveTraits> => {
        const response = await apiClient.put<BigFiveTraits>('/users/me/big-five-traits', data);
        return response.data;
    },

    /**
     * Update MBTI traits
     */
    updateMBTI: async (data: MBTITraits): Promise<MBTITraits> => {
        const response = await apiClient.put<MBTITraits>('/users/me/mbti-traits', data);
        return response.data;
    },

    /**
     * Update psychology profile
     */
    updatePsychology: async (data: Psychology): Promise<Psychology> => {
        const response = await apiClient.put<Psychology>('/users/me/psychology', data);
        return response.data;
    },

    /**
     * Update interests and hobbies
     */
    updateInterests: async (data: InterestsAndHobbies): Promise<InterestsAndHobbies> => {
        const response = await apiClient.put<InterestsAndHobbies>('/users/me/interests-and-hobbies', data);
        return response.data;
    },

    /**
     * Update values, beliefs, and goals
     */
    updateValues: async (data: ValuesBeliefsAndGoals): Promise<ValuesBeliefsAndGoals> => {
        const response = await apiClient.put<ValuesBeliefsAndGoals>('/users/me/values-beliefs-and-goals', data);
        return response.data;
    },

    /**
     * Update favorites
     */
    updateFavorites: async (data: Favorites): Promise<Favorites> => {
        const response = await apiClient.put<Favorites>('/users/me/favorites', data);
        return response.data;
    },

    /**
     * Update relationship preferences
     */
    updateRelationshipPreferences: async (data: RelationshipPreferences): Promise<RelationshipPreferences> => {
        const response = await apiClient.put<RelationshipPreferences>('/users/me/relationship-preferences', data);
        return response.data;
    },

    /**
     * Update friendship preferences
     */
    updateFriendshipPreferences: async (data: FriendshipPreferences): Promise<FriendshipPreferences> => {
        const response = await apiClient.put<FriendshipPreferences>('/users/me/friendship-preferences', data);
        return response.data;
    },

    /**
     * Update collaboration preferences
     */
    updateCollaborationPreferences: async (data: CollaborationPreferences): Promise<CollaborationPreferences> => {
        const response = await apiClient.put<CollaborationPreferences>('/users/me/collaboration-preferences', data);
        return response.data;
    },

    /**
     * Update lifestyle
     */
    updateLifestyle: async (data: Lifestyle): Promise<Lifestyle> => {
        const response = await apiClient.put<Lifestyle>('/users/me/lifestyle', data);
        return response.data;
    },

    /**
     * Update personal free form
     */
    updatePersonalFreeForm: async (data: PersonalFreeForm): Promise<PersonalFreeForm> => {
        const response = await apiClient.put<PersonalFreeForm>('/users/me/personal-free-form', data);
        return response.data;
    },

    /**
     * Update intentions
     */
    updateIntentions: async (data: Intentions): Promise<Intentions> => {
        const response = await apiClient.put<Intentions>('/users/me/intentions', data);
        return response.data;
    },

    /**
     * Update ideal characteristics
     */
    updateIdealCharacteristics: async (data: IdealCharacteristics): Promise<IdealCharacteristics> => {
        const response = await apiClient.put<IdealCharacteristics>('/users/me/ideal-characteristics', data);
        return response.data;
    },

    /**
     * Update aspiration and reflections
     */
    updateAspirationAndReflections: async (data: AspirationAndReflections): Promise<AspirationAndReflections> => {
        const response = await apiClient.put<AspirationAndReflections>('/users/me/aspiration-and-reflections', data);
        return response.data;
    },

    /**
     * Upload profile picture
     */
    uploadProfilePicture: async (file: File): Promise<ProfilePicture> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<ProfilePicture>('/users/me/profile-picture/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get profile pictures
     */
    getProfilePictures: async (tenantId: string): Promise<ProfilePicture[]> => {
        const response = await apiClient.get<ProfilePicture[]>('/users/me/profile-picture', {
            params: { tenant_id: tenantId },
        });
        return response.data;
    },
};

export default profileApi;
