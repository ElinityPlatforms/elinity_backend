import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserProfile } from "../services/userService";
import { useAuth } from "../auth/AuthContext";

export interface ProfileData {
  id: string;
  profileImg: string;
  displayName: string;
  email: string;
  role: string;
  age: string;
  location: string;
  relationship: string;
  gender: string;
  about: string;
}

const defaultProfile: ProfileData = {
  id: "mock-id",
  profileImg: "https://ui-avatars.com/api/?name=User&background=a259e6&color=fff",
  displayName: "Elinity User",
  email: "user@elinity.ai",
  role: "user",
  age: "--",
  location: "Not specified",
  relationship: "Not specified",
  gender: "Not specified",
  about: "Welcome to your Elinity profile! Tell us about yourself to help Lumi AI understand you better and provide more personalized guidance. You can edit your bio, upload a profile picture, and share your interests in the Edit Profile section.",
};


interface ProfileContextType {
  profile: ProfileData;
  setProfile: (data: ProfileData) => void;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const { state } = useAuth();

  const loadProfile = useCallback(async () => {
    if (!state.isAuthenticated) {
      return;
    }

    try {
      const data = await getUserProfile();
      const pi = data.personal_info || {};

      // Extract profile picture URL - sort by uploaded_at descending to get latest first
      let profileImg = defaultProfile.profileImg;
      if (data.profile_pictures && data.profile_pictures.length > 0) {
        const sortedPics = [...data.profile_pictures].sort((a, b) =>
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        );
        profileImg = sortedPics[0].url;
      }

      // Resolve mock storage URLs - only if they ARE actually the old mock string
      if (profileImg && profileImg.includes("mock-storage.local") && !profileImg.includes("localhost") && !profileImg.includes("http")) {
        profileImg = `https://i.pravatar.cc/300?u=${profileImg.split('/').pop()}`;
      }

      const displayName = [pi.first_name, pi.middle_name, pi.last_name]
        .filter(Boolean)
        .join(" ") || defaultProfile.displayName;

      const mapped: ProfileData = {
        id: data.id || defaultProfile.id,
        profileImg,
        displayName,
        email: data.email || defaultProfile.email,
        role: data.role || defaultProfile.role,
        age: pi.age ? String(pi.age) : defaultProfile.age,
        location: pi.location || defaultProfile.location,
        relationship: pi.relationship_status || defaultProfile.relationship,
        gender: pi.gender || defaultProfile.gender,
        about:
          (data.personal_free_form && data.personal_free_form.things_to_share) ||
          data.values_beliefs_and_goals?.beliefs ||
          defaultProfile.about,
      };
      setProfile(mapped);
    } catch (err) {
      console.error("Failed to load profile:", err);
      // Keep default profile on error
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
} 