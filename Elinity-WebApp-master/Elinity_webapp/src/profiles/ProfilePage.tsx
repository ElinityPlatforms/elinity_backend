import LeisureProfile from "./LeisureProfile";
import RomanticProfile from "./RomanticProfile";
import CollaborativeProfile from "./CollaborativeProfile";
import { useProfileMode } from "../ProfileModeContext";

export default function ProfilePage() {
  const { mode } = useProfileMode();
  return (
    <div className="profile-page-root">
      {mode === "leisure" && <LeisureProfile />}
      {mode === "romantic" && <RomanticProfile />}
      {mode === "collaborative" && <CollaborativeProfile />}
    </div>
  );
}