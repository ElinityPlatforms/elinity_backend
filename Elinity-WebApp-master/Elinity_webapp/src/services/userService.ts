const API_BASE = import.meta.env.VITE_API_BASE || "";

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
  const accessToken = sessionStorage.getItem("auth_access_token");
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw { status: res.status, message: err?.detail?.[0]?.msg || err.message || res.statusText };
  }

  return res.json();
}

/**
 * Update user's personal info
 * Note: profile_pictures must be included in the request body as an empty array per API spec
 */
export async function updatePersonalInfo(data: PersonalInfo): Promise<PersonalInfo> {
  const accessToken = sessionStorage.getItem("auth_access_token");
  
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
  
  const res = await fetch(`${API_BASE}/users/me/personal-info`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    // Handle 422 validation errors with detailed error messages
    if (res.status === 422 && err.detail) {
      const errorMessages = err.detail.map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join(', ');
      throw { status: res.status, message: errorMessages || err.message || res.statusText };
    }
    throw { status: res.status, message: err?.detail?.[0]?.msg || err.message || res.statusText };
  }

  return res.json();
}

/**
 * Upload a profile picture (multipart/form-data)
 */
export async function uploadProfilePicture(file: File): Promise<ProfilePicture> {
  const accessToken = sessionStorage.getItem("auth_access_token");
  if (!accessToken) {
    throw { status: 401, message: "Not authenticated. Please log in." };
  }

  const formData = new FormData();
  formData.append("file", file);

  console.log("Uploading file:", { fileName: file.name, size: file.size, type: file.type, token: !!accessToken });

  const res = await fetch(`${API_BASE}/users/me/profile-picture/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  console.log("Upload response:", { status: res.status, statusText: res.statusText });

  // Handle both 200 and 201 responses
  if (res.status !== 200 && res.status !== 201) {
    let errMessage = res.statusText;
    try {
      const errData = await res.json();
      errMessage = errData?.detail?.[0]?.msg || errData?.message || res.statusText;
    } catch (e) {
      errMessage = `Upload failed: ${res.status} ${res.statusText}`;
    }
    console.error("Upload error:", { status: res.status, message: errMessage });
    throw { status: res.status, message: errMessage };
  }

  return res.json();
}

/**
 * Get user's profile pictures
 * If tenantId is not provided, it will try to get it from the user profile
 */
export async function getProfilePictures(tenantId?: string): Promise<ProfilePicture[]> {
  const accessToken = sessionStorage.getItem("auth_access_token");
  
  // If tenantId is not provided, try to get it from user profile
  let finalTenantId = tenantId;
  if (!finalTenantId) {
    try {
      const profile = await getUserProfile();
      // Get tenant from first profile picture if available
      if (profile.profile_pictures && profile.profile_pictures.length > 0) {
        finalTenantId = profile.profile_pictures[0].tenant;
      }
    } catch (err) {
      console.warn("Could not get tenant_id from profile:", err);
    }
  }
  
  if (!finalTenantId) {
    throw { status: 400, message: "tenant_id is required. Please provide it or ensure you have uploaded at least one profile picture." };
  }

  const res = await fetch(`${API_BASE}/users/me/profile-picture?tenant_id=${encodeURIComponent(finalTenantId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw { status: res.status, message: err?.detail?.[0]?.msg || err.message || res.statusText };
  }

  return res.json();
}

/**
 * Add a profile picture by URL
 */
export async function addProfilePictureUrl(url: string): Promise<ProfilePicture> {
  const accessToken = sessionStorage.getItem("auth_access_token");
  const res = await fetch(`${API_BASE}/users/me/profile-picture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw { status: res.status, message: err?.detail?.[0]?.msg || err.message || res.statusText };
  }

  return res.json();
}

export default {
  getUserProfile,
  updatePersonalInfo,
  uploadProfilePicture,
  getProfilePictures,
  addProfilePictureUrl,
};
