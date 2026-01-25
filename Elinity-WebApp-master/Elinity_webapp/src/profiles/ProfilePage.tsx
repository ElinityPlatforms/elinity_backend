import LeisureProfile from "./LeisureProfile";
import RomanticProfile from "./RomanticProfile";
import CollaborativeProfile from "./CollaborativeProfile";
import { useProfileMode } from "../ProfileModeContext";
import { EditPersonalInfoForm } from "./EditPersonalInfoForm";
import { ProfilePictureUpload } from "./ProfilePictureUpload";

export default function ProfilePage() {
  const { mode } = useProfileMode();
  return (
    <div>
      {mode === "leisure" && <LeisureProfile />}
      {mode === "romantic" && <RomanticProfile />}
      {mode === "collaborative" && <CollaborativeProfile />}
      <EditPersonalInfoForm />
      <ProfilePictureUpload />
    </div>
  );
}