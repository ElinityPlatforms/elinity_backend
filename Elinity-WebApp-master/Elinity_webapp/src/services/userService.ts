import apiClient from '../api/client';

export interface PersonalInfo {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  sexual_orientation?: string;
  location?: string;
  relationship_status?: string;
  education?: string;
  occupation?: string;
  profile_pictures?: string[]; // Included in request body but not in response
}

export interface ProfilePicture {
  url: string;
  id: string;
  tenant: string;
  uploaded_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  role: string;
  last_login: string;
  created_at: string;
  updated_at: string;
  profile_pictures: ProfilePicture[];
  personal_info: PersonalInfo;
  big_five_traits: Record<string, number>;
  mbti_traits: Record<string, number>;
  psychology: Record<string, any>;
  interests_and_hobbies: Record<string, any>;
  values_beliefs_and_goals: Record<string, any>;
  favorites: Record<string, any>;
  relationship_preferences: Record<string, any>;
  friendship_preferences: Record<string, any>;
  collaboration_preferences: Record<string, any>;
  personal_free_form: Record<string, any>;
  intentions: Record<string, any>;
  aspiration_and_reflections: Record<string, any>;
  ideal_characteristics: Record<string, number>;
  lifestyle: Record<string, any>;
  key_memories: Record<string, any>;
}

/**
 * Get authenticated user's full profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/users/me');
  return response.data;
}

/**
 * Update user's personal info
 */
export async function updatePersonalInfo(data: PersonalInfo): Promise<PersonalInfo> {
  // Build request body according to API spec - always include profile_pictures as empty array
  const requestData = {
    first_name: data.first_name || "",
    middle_name: data.middle_name || "",
    last_name: data.last_name || "",
    age: data.age || 0,
    gender: data.gender || "",
    sexual_orientation: data.sexual_orientation || "",
    location: data.location || "",
    relationship_status: data.relationship_status || "",
    education: data.education || "",
    occupation: data.occupation || "",
    profile_pictures: [], // Always send as empty array per API spec
  };

  const response = await apiClient.put<PersonalInfo>('/users/me/personal-info', requestData);
  return response.data;
}

/**
 * Upload a profile picture (multipart/form-data)
 */
export async function uploadProfilePicture(file: File): Promise<ProfilePicture> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ProfilePicture>('/users/me/profile-picture/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Get user's profile pictures
 */
export async function getProfilePictures(tenantId?: string): Promise<ProfilePicture[]> {
  // If tenantId is not provided, try to get it from user profile
  let finalTenantId = tenantId;
  if (!finalTenantId) {
    try {
      const profile = await getUserProfile();
      if (profile.profile_pictures && profile.profile_pictures.length > 0) {
        finalTenantId = profile.profile_pictures[0].tenant;
      }
    } catch (err) {
      console.warn("Could not get tenant_id from profile:", err);
    }
  }

  if (!finalTenantId) {
    throw new Error("tenant_id is required. Please provide it or ensure you have uploaded at least one profile picture.");
  }

  const response = await apiClient.get<ProfilePicture[]>(`/users/me/profile-picture?tenant_id=${encodeURIComponent(finalTenantId)}`);
  return response.data;
}

/**
 * Add a profile picture by URL
 */
export async function addProfilePictureUrl(url: string): Promise<ProfilePicture> {
  const response = await apiClient.post<ProfilePicture>('/users/me/profile-picture', { url });
  return response.data;
}

export default {
  getUserProfile,
  updatePersonalInfo,
  uploadProfilePicture,
  getProfilePictures,
  addProfilePictureUrl,
};
