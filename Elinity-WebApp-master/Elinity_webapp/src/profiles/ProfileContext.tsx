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
  about_romantic: string;
  about_collaborative: string;
  // Expanded fields
  interests: string[];
  expertise: string[];
  hobbies: string[];
  values: string[];
  personality: string[];
  lookingFor: {
    leisure: string[];
    romantic: string[];
    collaborative: string[];
  };
  reflections: string;
  goals: {
    personal: string[];
    professional: string[];
  };
  aspiration: string;
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
  about: "Describe your leisure and social self here.",
  about_romantic: "What are you looking for in a partner?",
  about_collaborative: "Describe your professional skills and vision.",
  interests: ["Awareness", "Growth", "Mindfulness", "Connection"],
  expertise: ["Strategy", "Vision", "Leadership", "Innovation"],
  hobbies: [],
  values: ["Authenticity", "Freedom", "Presence", "Connection"],
  personality: ["Seeking Truth", "Always Growing", "Valuing Depth", "Embracing Wonder"],
  lookingFor: {
    leisure: [
      "Connecting with like-minded individuals who value growth and authenticity.",
      "Sharing experiences, stories, and insights on the journey of self-discovery.",
      "Building meaningful connections that transcend the superficial."
    ],
    romantic: [
      "Looking for deep emotional resonance and shared life values.",
      "Interested in building a partnership based on radical honesty and mutual growth.",
      "Valuing quality time, meaningful conversations, and shared adventures."
    ],
    collaborative: [
      "Looking for partners who value innovation, integrity, and shared vision.",
      "Interested in projects that challenge the status quo and create real impact.",
      "Seeking to build a network of professionals committed to conscious collaboration."
    ]
  },
  reflections: "Your recent journey with Lumi AI shown here will reflect your deepest insights and growth milestones.",
  goals: {
    personal: [],
    professional: []
  },
  aspiration: ""
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

      // Map dynamic lists
      const interests = (data.interests_and_hobbies?.interests?.length > 0)
        ? data.interests_and_hobbies.interests
        : defaultProfile.interests;

      const expertise = (data.collaboration_preferences?.areas_of_expertise?.length > 0)
        ? data.collaboration_preferences.areas_of_expertise
        : defaultProfile.expertise;

      const values = (data.values_beliefs_and_goals?.values?.length > 0)
        ? data.values_beliefs_and_goals.values
        : defaultProfile.values;

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
          defaultProfile.about,
        about_romantic: data.relationship_preferences?.relationship_goals || defaultProfile.about_romantic,
        about_collaborative: data.collaboration_preferences?.seeking || defaultProfile.about_collaborative,
        interests,
        expertise,
        hobbies: data.interests_and_hobbies?.hobbies || [],
        values,
        personality: (data.psychology?.communication_style) ? [
          data.psychology.communication_style,
          data.psychology.conflict_resolution_style,
          data.psychology.attachment_style
        ].filter(Boolean) : defaultProfile.personality,
        lookingFor: {
          leisure: data.friendship_preferences?.seeking ? [data.friendship_preferences.seeking] : defaultProfile.lookingFor.leisure,
          romantic: data.relationship_preferences?.seeking ? [data.relationship_preferences.seeking] : defaultProfile.lookingFor.romantic,
          collaborative: data.collaboration_preferences?.seeking ? [data.collaboration_preferences.seeking] : defaultProfile.lookingFor.collaborative
        },
        reflections: data.aspiration_and_reflections?.life_goals?.join(", ") ||
          data.aspiration_and_reflections?.bucket_list?.join(", ") ||
          defaultProfile.reflections,
        goals: {
          personal: data.values_beliefs_and_goals?.personal_goals || [],
          professional: data.values_beliefs_and_goals?.professional_goals || []
        },
        aspiration: data.values_beliefs_and_goals?.beliefs || defaultProfile.aspiration
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
