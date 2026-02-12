import React, { useState } from "react";
import "../HomePage.css";
import {
  MdSearch, MdOutlineNotificationsNone, MdOutlineSettings, MdEdit
} from "react-icons/md";
import Sidebar from "../components/Sidebar";
import { useProfile } from "./ProfileContext";
import { useNavigate } from "react-router-dom";
import { useProfileMode } from "../ProfileModeContext";
import { ProfilePictureUpload } from "./ProfilePictureUpload";

const cardStyle: React.CSSProperties = {
  background: 'rgba(61, 56, 112, 0.18)',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 2px 8px 0 #a259e622, 0 2px 8px 0 #fff1 inset',
  border: '2px solid rgba(162, 89, 230, 0.10)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  color: '#fff',
  position: 'relative',
  width: '100%',
};

const tagStyle: React.CSSProperties = {
  background: 'rgba(162, 89, 230, 0.18)',
  color: '#fff',
  border: '1.5px solid rgba(162, 89, 230, 0.18)',
  borderRadius: 8,
  padding: '8px 18px',
  margin: '0 12px 12px 0',
  fontWeight: 500,
  fontSize: 15,
  display: 'inline-block',
  cursor: 'pointer',
  boxShadow: '0 1px 4px 0 #a259e622',
};

function ProgressCircle({ percent }: { percent: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="100" height="100">
      <circle cx="50" cy="50" r={r} stroke="#23235b" strokeWidth="10" fill="none" />
      <circle cx="50" cy="50" r={r} stroke="#3a6cf6" strokeWidth="10" fill="none" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.5s', filter: 'drop-shadow(0 0 8px #3a6cf6)' }} />
      <text x="50" y="56" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">{percent}%</text>
    </svg>
  );
}

export default function EditProfile() {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const { mode, setMode }: { mode: string, setMode: (mode: string) => void } = useProfileMode() as { mode: string, setMode: (mode: string) => void };
  const [showDropdown, setShowDropdown] = useState(false);

  const handleModeSelect = (mode: string) => {
    setMode(mode);
    setShowDropdown(false);
    navigate("/profile");
  };

  // Local state for editing
  const [profileImg, setProfileImg] = useState(profile.profileImg);
  const [personalInfo, setPersonalInfo] = useState({
    displayName: profile.displayName,
    email: profile.email,
    age: profile.age,
    location: profile.location,
    relationship: profile.relationship,
    gender: profile.gender,
  });
  const [personalInfoEdit, setPersonalInfoEdit] = useState(personalInfo);
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);

  // About Me State
  const [about, setAbout] = useState(profile.about);
  const [aboutEdit, setAboutEdit] = useState(about);
  const [editingAbout, setEditingAbout] = useState(false);

  const [traits] = useState([
    "INTJ - Traits",
    "Adventurous spirit",
    "Deeply intuitive",
    "Strong sense of purpose",
    "Creative problem-solver",
    "Calm under pressure",
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Personal Info Handlers
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPersonalInfoEdit({ ...personalInfoEdit, [e.target.name]: e.target.value });
  };
  const savePersonalInfo = () => {
    setPersonalInfo(personalInfoEdit);
    setEditingPersonalInfo(false);
  };
  const cancelPersonalInfo = () => {
    setPersonalInfoEdit(personalInfo);
    setEditingPersonalInfo(false);
  };

  // About Me Handlers
  const saveAbout = () => {
    setAbout(aboutEdit);
    setEditingAbout(false);
  };
  const cancelAbout = () => {
    setAboutEdit(about);
    setEditingAbout(false);
  };

  // Save all changes to context and redirect
  const handleSaveAll = () => {
    setProfile({
      id: profile.id,
      ...personalInfo,
      profileImg,
      about,
    });
    if (mode === 'leisure') navigate('/leisure-profile');
    else if (mode === 'romantic') navigate('/romantic-profile');
    else if (mode === 'collaborative') navigate('/collaborative-profile');
    else navigate('/profile');
  };

  // Section completeness logic
  const isPersonalInfoComplete = !!(personalInfo.displayName && personalInfo.email && personalInfo.age && personalInfo.location && personalInfo.relationship && personalInfo.gender);
  const isCorePersonalityComplete = traits.length >= 3; // Example: at least 3 traits
  const isValueBeliefsComplete = !!about; // Example: about filled
  const isAchievementComplete = !!about; // Example: about filled
  const isBucketListComplete = !!about; // Example: about filled
  const isFavouriteBooksComplete = !!about; // Example: about filled
  const isSoMuchMoreComplete = !!about; // Example: about filled

  const sectionStates = [
    isPersonalInfoComplete,
    isCorePersonalityComplete,
    isValueBeliefsComplete,
    isAchievementComplete,
    isBucketListComplete,
    isFavouriteBooksComplete,
    isSoMuchMoreComplete
  ];
  const completeness = Math.round((sectionStates.filter(Boolean).length / sectionStates.length) * 100);

  return (
    <div className="edit-profile-content">
      {/* Top grid row - Identity Center */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, auto) 1fr', gap: 32, marginBottom: 32, width: '100%', maxWidth: 1200 }}>
        {/* Identity Image (Instagram Style) */}
        <div style={{ width: 340 }}>
          <ProfilePictureUpload />
        </div>

        {/* Personal Info Card */}
        <div style={{ ...cardStyle, minHeight: 340, height: '100%', position: 'relative', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 19 }}>Personal Info</div>
            {!editingPersonalInfo && (
              <button style={{ background: 'rgba(162, 89, 230, 0.18)', border: '1.5px solid #a259e6', borderRadius: 8, color: '#fff', padding: 6, cursor: 'pointer', boxShadow: '0 1px 4px 0 #a259e622' }} onClick={() => setEditingPersonalInfo(true)}>
                <MdEdit size={20} /> Edit
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <div style={{ color: '#bdbdf7', fontSize: 13, marginBottom: 2 }}>Display Name</div>
              {editingPersonalInfo ? (
                <input name="displayName" value={personalInfoEdit.displayName} onChange={handlePersonalInfoChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #a259e6', marginTop: 4 }} />
              ) : (
                <div style={{ fontWeight: 600, fontSize: 17 }}>{personalInfo.displayName}</div>
              )}
            </div>
            <div>
              <div style={{ color: '#bdbdf7', fontSize: 13, marginBottom: 2 }}>Email</div>
              {editingPersonalInfo ? (
                <input name="email" value={personalInfoEdit.email} onChange={handlePersonalInfoChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #a259e6', marginTop: 4 }} />
              ) : (
                <div style={{ fontWeight: 600, fontSize: 17 }}>{personalInfo.email}</div>
              )}
            </div>
            <div>
              <div style={{ color: '#bdbdf7', fontSize: 13, marginBottom: 2 }}>Age</div>
              {editingPersonalInfo ? (
                <input name="age" value={personalInfoEdit.age} onChange={handlePersonalInfoChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #a259e6', marginTop: 4 }} />
              ) : (
                <div style={{ fontWeight: 600, fontSize: 17 }}>{personalInfo.age}</div>
              )}
            </div>
            <div>
              <div style={{ color: '#bdbdf7', fontSize: 13, marginBottom: 2 }}>Location</div>
              {editingPersonalInfo ? (
                <input name="location" value={personalInfoEdit.location} onChange={handlePersonalInfoChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #a259e6', marginTop: 4 }} />
              ) : (
                <div style={{ fontWeight: 600, fontSize: 17 }}>{personalInfo.location}</div>
              )}
            </div>
            <div>
              <div style={{ color: '#bdbdf7', fontSize: 13, marginBottom: 2 }}>Relationship Status</div>
              {editingPersonalInfo ? (
                <select name="relationship" value={personalInfoEdit.relationship} onChange={handlePersonalInfoChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #a259e6', marginTop: 4 }}>
                  <option value="Single">Single</option>
                  <option value="In a relationship">In a relationship</option>
                  <option value="Married">Married</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div style={{ fontWeight: 600, fontSize: 17 }}>{personalInfo.relationship}</div>
              )}
            </div>
            <div>
              <div style={{ color: '#bdbdf7', fontSize: 13, marginBottom: 2 }}>Gender</div>
              {editingPersonalInfo ? (
                <select name="gender" value={personalInfoEdit.gender} onChange={handlePersonalInfoChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #a259e6', marginTop: 4 }}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div style={{ fontWeight: 600, fontSize: 17 }}>{personalInfo.gender}</div>
              )}
            </div>
          </div>
          {editingPersonalInfo && (
            <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
              <button type="button" onClick={savePersonalInfo} style={{ background: '#3a6cf6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #a259e655' }}>Save</button>
              <button type="button" onClick={cancelPersonalInfo} style={{ background: 'rgba(162, 89, 230, 0.18)', color: '#fff', border: '1.5px solid #a259e6', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
      {/* Second row: About Me + Core Personality (left), Complete your Profile (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: 32, marginBottom: 32, width: '100%', maxWidth: 1200 }}>
        {/* Left: About Me + Core Personality Card (combined) */}
        <div>
          <div style={{ ...cardStyle, width: '100%', padding: 32, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 19 }}>About me & Core Personality</div>
              {!editingAbout && (
                <button style={{ background: 'rgba(162, 89, 230, 0.18)', border: '1.5px solid #a259e6', borderRadius: 8, color: '#fff', padding: 6, cursor: 'pointer', boxShadow: '0 1px 4px 0 #a259e622' }} onClick={() => setEditingAbout(true)}>
                  <MdEdit size={20} /> Edit
                </button>
              )}
            </div>
            {/* About Me Section */}
            <div style={{ background: 'rgba(24,25,54,0.18)', border: '1.5px solid #a259e6', borderRadius: 12, padding: 18, minHeight: 90, color: '#fff', fontSize: 15, marginBottom: 24 }}>
              {editingAbout ? (
                <>
                  <textarea value={aboutEdit} onChange={e => setAboutEdit(e.target.value)} rows={6} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #a259e6', fontFamily: 'inherit', fontSize: 15, resize: 'vertical', background: 'rgba(24,25,54,0.18)', color: '#fff' }} />
                  <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={saveAbout} style={{ background: '#3a6cf6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #a259e655' }}>Save</button>
                    <button type="button" onClick={cancelAbout} style={{ background: 'rgba(162, 89, 230, 0.18)', color: '#fff', border: '1.5px solid #a259e6', borderRadius: 8, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </>
              ) : (
                <div style={{ whiteSpace: 'pre-line', color: '#bdbdf7' }}>{about}</div>
              )}
            </div>
            {/* Core Personality Section */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 10 }}>Core Personality</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 8 }}>
                {traits.map((trait, i) => (
                  <span key={i} style={tagStyle}>{trait}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Complete your Profile Card */}
        <div>
          <div style={{ ...cardStyle, minHeight: 260, height: '100%', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #3a6cf6', boxShadow: '0 8px 32px 0 #3a6cf655' }}>
            <div style={{ fontWeight: 600, fontSize: 19, marginBottom: 8 }}>Complete your Profile</div>
            <ProgressCircle percent={completeness} />
            <div style={{ marginTop: 18, width: '100%' }}>
              <div style={{ color: '#bdbdf7', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Personal Info <span style={{ float: 'right', color: '#3a6cf6' }}>{isPersonalInfoComplete ? '100%' : '0%'}</span></div>
              <div style={{ color: '#bdbdf7', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Core Personality <span style={{ float: 'right', color: '#3a6cf6' }}>{isCorePersonalityComplete ? '100%' : '0%'}</span></div>
              <div style={{ color: '#bdbdf7', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Value & Beliefs <span style={{ float: 'right', color: '#3a6cf6' }}>{isValueBeliefsComplete ? '100%' : '0%'}</span></div>
              <div style={{ color: '#bdbdf7', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Achievement & Milestone <span style={{ float: 'right', color: '#3a6cf6' }}>{isAchievementComplete ? '100%' : '0%'}</span></div>
              <div style={{ color: '#bdbdf7', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Bucket List & Life goals <span style={{ float: 'right', color: '#3a6cf6' }}>{isBucketListComplete ? '100%' : '0%'}</span></div>
              <div style={{ color: '#bdbdf7', fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Favourite books <span style={{ float: 'right', color: '#3a6cf6' }}>{isFavouriteBooksComplete ? '100%' : '0%'}</span></div>
              <div style={{ color: '#bdbdf7', fontSize: 15, fontWeight: 500 }}>so much more <span style={{ float: 'right', color: '#3a6cf6' }}>{isSoMuchMoreComplete ? '100%' : '0%'}</span></div>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button at the very bottom */}
      <button type="button" onClick={handleSaveAll} style={{ margin: '48px auto 0 auto', display: 'block', padding: '16px 56px', borderRadius: 12, background: '#a259e6', color: '#fff', fontWeight: 700, fontSize: 22, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #a259e655' }}>
        Save
      </button>
    </div>
  );
}
