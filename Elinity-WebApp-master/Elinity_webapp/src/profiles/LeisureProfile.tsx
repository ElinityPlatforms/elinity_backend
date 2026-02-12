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

export default function LeisureProfile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { setMode }: { setMode: (mode: string) => void } = useProfileMode() as { setMode: (mode: string) => void };
  const navigate = useNavigate();
  const { profile } = useProfile();

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
                Radical Awareness Active
              </div>
            </div>
          </div>
        </div>
        {/* About Me (row 1, col 2-4) */}
        <div style={{ gridRow: '1', gridColumn: '2 / span 3', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>About Me —</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              {profile.about}
            </div>
          </div>
        </div>
        {/* Looking for Cool People (row 2, col 2-3) */}
        <div style={{ gridRow: '2', gridColumn: '2 / span 2', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Looking for...</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>Connecting with like-minded individuals who value growth and authenticity.</li>
              <li>Sharing experiences, stories, and insights on the journey of self-discovery.</li>
              <li>Building meaningful connections that transcend the superficial.</li>
            </ul>
          </div>
        </div>
        {/* Passion & Interest (row 2, col 4) */}
        <div style={{ gridRow: '2', gridColumn: '4', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Passion & Interest</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <span style={tagStyle}>Awareness</span>
              <span style={tagStyle}>Growth</span>
              <span style={tagStyle}>Mindfulness</span>
              <span style={tagStyle}>Connection</span>
            </div>
          </div>
        </div>
        {/* Empty cell for row 2, col 4 for balance */}
        <div style={{ gridRow: '2', gridColumn: '4' }} />
        {/* My Life Story and Background (long text, row 3, col 1-2) */}
        <div style={{ gridRow: '3', gridColumn: '1 / span 2', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>My Core Values</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Your core values are the compass that guides your life. By reflecting on what truly matters to you,
              you enable <strong>Lumi AI</strong> to provide guidance that is deeply aligned with your soul's purpose.<br /><br />
              Use the <em>Deep Persona Cards</em> and <em>Rituals</em> to explore and define these values.
            </div>
          </div>
        </div>
        {/* Core Personality (row 3, col 3) */}
        <div style={{ gridRow: '3', gridColumn: '3', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Personality</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>🌟 Seeking Truth</li>
              <li>🌱 Always Growing</li>
              <li>🤝 Valuing Depth</li>
              <li>✨ Embracing Wonder</li>
            </ul>
          </div>
        </div>
        {/* Personal Value (row 3, col 4) */}
        <div style={{ gridRow: '3', gridColumn: '4', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Values</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>🖌️ Authenticity</li>
              <li>💡 Freedom</li>
              <li>🧘‍♀️ Presence</li>
              <li>🤝 Connection</li>
            </ul>
          </div>
        </div>
        {/* My Life Story and Background Image (row 4, col 1) */}
        <div style={{ gridRow: '4', gridColumn: '1', height: '100%' }}>
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '3/4', minHeight: 320, maxHeight: 480 }}>
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
          </div>
        </div>
        {/* My Life Story and Background (short, row 4, col 2-5) */}
        <div style={{ gridRow: '4', gridColumn: '2 / span 4', height: '100%', marginLeft: '-10px' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Recent Reflections</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Your recent journey with <strong>Lumi AI</strong> shown here will reflect your deepest insights and growth milestones.<br /><br />
              As you interact with the platform—journaling, answering persona cards, and completing rituals—this space will transform
              into a beautiful mosaic of your inner world and life's progress.<br /><br />
              Currently, your "Radical Awareness" is being cultivated through your active participation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
