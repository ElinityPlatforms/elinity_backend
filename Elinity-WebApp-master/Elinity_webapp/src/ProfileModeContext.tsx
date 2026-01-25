import React, { createContext, useContext, useState } from "react";
// Define the type for the context value
interface ProfileModeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ProfileModeContext = createContext<ProfileModeContextType | undefined>(undefined);

export function ProfileModeProvider({ children }) {
  const [mode, setMode] = useState<string>("leisure"); // default mode
  return (
    <ProfileModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ProfileModeContext.Provider>
  );
}
export function useProfileMode() {
  const context = useContext(ProfileModeContext);
  if (!context) {
    throw new Error("useProfileMode must be used within a ProfileModeProvider");
  }
  return context;
} 