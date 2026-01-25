import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserProfile } from "../services/userService";
import { useAuth } from "../auth/AuthContext";

export interface ProfileData {
  profileImg: string;
  displayName: string;
  email: string;
  age: string;
  location: string;
  relationship: string;
  gender: string;
  about: string;
}

const defaultProfile: ProfileData = {
  profileImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2",
  displayName: "Sara Johnson",
  email: "Sara.Johnson@examplegmail.com",
  age: "29",
  location: "49-51 Paul St, London, United Kingdom",
  relationship: "Single",
  gender: "Female",
  about: "Hi, I'm Alice Morgan — a 28-year-old digital artist and travel writer on a lifelong quest to capture the soul of places and moments. My journey blends pixels and passports. I paint dreamlike visuals inspired by the textures of old cities, ocean winds, and midnight conversations with strangers. Along the way, I write stories — part travel journal, part inner monologue — always grounded in wonder and honesty.\n\nI'm a travel photographer and food blogger. By night, I'm probably wandering through a street market with a camera in one hand and a pastel in the other. I live for hole-in-the-wall spots, handwritten menus, and those unexpected conversations you only get when you slow down and listen.\n\nI'm a travel photographer and food blogger. By night, I'm probably wandering through a street market with a camera in one hand and a pastel in the other. I live for hole-in-the-wall spots, handwritten menus, and those unexpected conversations you only get when you slow down and listen.",
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
      
      // Extract profile picture URL - profile_pictures is an array of objects with {url, id, tenant, uploaded_at}
      const profileImg = (data.profile_pictures && data.profile_pictures.length > 0 && data.profile_pictures[0]?.url) 
        || defaultProfile.profileImg;
      
      const displayName = [pi.first_name, pi.middle_name, pi.last_name]
        .filter(Boolean)
        .join(" ") || defaultProfile.displayName;
      
      const mapped: ProfileData = {
        profileImg,
        displayName,
        email: data.email || defaultProfile.email,
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