import React, { useState } from "react";
import {
  MdSearch, MdOutlineNotificationsNone, MdOutlineSettings, MdLocationOn, MdPalette
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useProfileMode } from "../ProfileModeContext";
import { useProfile } from "./ProfileContext";
import "../HomePage.css";

const cardStyle = {
  background: 'rgba(162,89,230,0.18)',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 2px 8px 0 #a259e622, 0 2px 8px 0 #fff1 inset',
  border: '2px solid rgba(162, 89, 230, 0.10)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  color: '#fff',
};
const tagStyle = {
  display: 'inline-block',
  background: 'rgba(162,89,230,0.22)',
  borderRadius: 20,
  padding: '4px 16px',
  margin: '4px 6px 4px 0',
  fontSize: 14,
  color: '#fff',
  border: '1.5px solid #a259e6',
  fontWeight: 500,
};

export default function CollaborativeProfile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { setMode }: { setMode: (mode: string) => void } = useProfileMode() as { setMode: (mode: string) => void };
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleModeSelect = (mode: string) => {
    setMode(mode);
    setShowDropdown(false);
    navigate("/profile");
  };

  return (
    <div className="profile-mode-content">
      {/* Main Card Grid: Profile image spans two rows */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gridTemplateRows: 'minmax(180px, auto) minmax(140px, auto) minmax(180px, auto) minmax(220px, auto)',
        gap: 18,
        rowGap: 18,
        columnGap: 18,
        alignItems: 'stretch',
        marginBottom: 24
      }}>
        {/* Profile Card (spans two rows) */}
        <div style={{ gridRow: '1 / span 2', gridColumn: '1', height: '100%' }}>
          <div className="profile-card" style={{ ...cardStyle, height: '100%', textAlign: 'left', padding: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <img src={profile.profileImg} alt={profile.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2, padding: 20, background: 'linear-gradient(0deg, rgba(24,25,54,0.95) 40%, rgba(24,25,54,0.0) 100%)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ fontWeight: 600, fontSize: 22, color: '#fff', marginBottom: 4 }}>{profile.displayName}</div>
              <div style={{ fontSize: 16, color: '#e0e0ff', marginBottom: 4 }}>{profile.age} {profile.gender !== 'Not specified' ? `• ${profile.gender}` : ''}</div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#e0e0ff', marginBottom: 4 }}>
                <MdLocationOn style={{ marginRight: 4 }} /> {profile.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#a259e6', fontWeight: 500, marginBottom: 4 }}>
                Professional Synergy Active
              </div>
            </div>
          </div>
        </div>
        {/* About Me (row 1, col 2-4) */}
        <div style={{ gridRow: '1', gridColumn: '2 / span 3', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Professional Identity —</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              {profile.about}
            </div>
          </div>
        </div>
        {/* Looking for Cool People (row 2, col 2-3) */}
        <div style={{ gridRow: '2', gridColumn: '2 / span 2', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Seeking Collaboration...</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>Looking for partners who value innovation, integrity, and shared vision.</li>
              <li>Interested in projects that challenge the status quo and create real impact.</li>
              <li>Seeking to build a network of professionals committed to conscious collaboration.</li>
            </ul>
          </div>
        </div>
        {/* Passion & Interest (row 2, col 4) */}
        <div style={{ gridRow: '2', gridColumn: '4', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Expertise</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <span style={tagStyle}>Strategy</span>
              <span style={tagStyle}>Vision</span>
              <span style={tagStyle}>Leadership</span>
              <span style={tagStyle}>Innovation</span>
            </div>
          </div>
        </div>
        {/* Empty cell for row 2, col 4 for balance */}
        <div style={{ gridRow: '2', gridColumn: '4' }} />
        {/* My Life Story and Background (long text, row 3, col 1-2) */}
        <div style={{ gridRow: '3', gridColumn: '1 / span 2', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Collaboration Values</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Your approach to work is a reflection of your inner character.
              By defining your collaborative values, you help <strong>Lumi AI</strong> identify the most
              synergistic opportunities and partners for your professional journey.<br /><br />
              The Collaborative mode focuses on alignment in work ethic, purpose, and creative frequency.
            </div>
          </div>
        </div>
        {/* Core Personality (row 3, col 3) */}
        <div style={{ gridRow: '3', gridColumn: '3', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Professional Persona</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>🚀 Visionary Leader</li>
              <li>💡 Creative Thinker</li>
              <li>🤝 Adaptive Partner</li>
              <li>✨ Impact Driven</li>
            </ul>
          </div>
        </div>
        {/* Personal Value (row 3, col 4) */}
        <div style={{ gridRow: '3', gridColumn: '4', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Work Values</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>🖌️ Excellence</li>
              <li>💡 Transparency</li>
              <li>🧘‍♀️ Integrity</li>
              <li>🤝 Synergy</li>
            </ul>
          </div>
        </div>
        {/* My Life Story and Background Image (row 4, col 1) */}
        <div style={{ gridRow: '4', gridColumn: '1', height: '100%' }}>
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '3/4', minHeight: 320, maxHeight: 480 }}>
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" alt="Workspace" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
          </div>
        </div>
        {/* My Life Story and Background (short, row 4, col 2-5) */}
        <div style={{ gridRow: '4', gridColumn: '2 / span 4', height: '100%', marginLeft: '-10px' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Professional Milestones</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Your professional narrative is a live document of your growth.
              As you collaborate and grow, this space will highlight your achievements, successful partnerships,
              and the evolution of your professional impact.<br /><br />
              Currently, your "Professional Synergy" is being activated through your unique contributions and openness to collaboration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
