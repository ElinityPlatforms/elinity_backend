import React, { useState } from "react";
import {
  MdSearch, MdOutlineNotificationsNone, MdOutlineSettings, MdLocationOn, MdPalette
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useProfileMode } from "../ProfileModeContext";
import { useProfile } from "./ProfileContext";

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

export default function RomanticProfile() {
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
                Romantic Alignment Active
              </div>
            </div>
          </div>
        </div>
        {/* About Me (row 1, col 2-4) */}
        <div style={{ gridRow: '1', gridColumn: '2 / span 3', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Romantic Profile —</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              {profile.about}
            </div>
          </div>
        </div>
        {/* Looking for Cool People (row 2, col 2-3) */}
        <div style={{ gridRow: '2', gridColumn: '2 / span 2', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Seeking...</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>Looking for deep emotional resonance and shared life values.</li>
              <li>Interested in building a partnership based on radical honesty and mutual growth.</li>
              <li>Valuing quality time, meaningful conversations, and shared adventures.</li>
            </ul>
          </div>
        </div>
        {/* Passion & Interest (row 2, col 4) */}
        <div style={{ gridRow: '2', gridColumn: '4', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Affinities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <span style={tagStyle}>Intimacy</span>
              <span style={tagStyle}>Romance</span>
              <span style={tagStyle}>Trust</span>
              <span style={tagStyle}>Shared Growth</span>
            </div>
          </div>
        </div>
        {/* Empty cell for row 2, col 4 for balance */}
        <div style={{ gridRow: '2', gridColumn: '4' }} />
        {/* My Life Story and Background (long text, row 3, col 1-2) */}
        <div style={{ gridRow: '3', gridColumn: '1 / span 2', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Relationship Vision</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Your relationship vision is shaped by your deepest desires and experiences.
              By sharing these with <strong>Lumi AI</strong>, you enable more insightful guidance on your path to connection.<br /><br />
              The Romantic mode focuses on finding alignment in values, goals, and emotional needs.
            </div>
          </div>
        </div>
        {/* Core Personality (row 3, col 3) */}
        <div style={{ gridRow: '3', gridColumn: '3', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Persona</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>💖 Loving heart</li>
              <li>🧘‍♀️ Mindful presence</li>
              <li>🔥 Passionate soul</li>
              <li>🤝 Reliable partner</li>
            </ul>
          </div>
        </div>
        {/* Personal Value (row 3, col 4) */}
        <div style={{ gridRow: '3', gridColumn: '4', height: '100%' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Romantic Values</div>
            <ul style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', paddingLeft: 18, margin: 0 }}>
              <li>✨ Vulnerability</li>
              <li>💡 Emotional Growth</li>
              <li>🧘‍♀️ Deep Connection</li>
              <li>🤝 Mutual Respect</li>
            </ul>
          </div>
        </div>
        {/* My Life Story and Background Image (row 4, col 1) */}
        <div style={{ gridRow: '4', gridColumn: '1', height: '100%' }}>
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '3/4', minHeight: 320, maxHeight: 480 }}>
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" alt="Landscape" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
          </div>
        </div>
        {/* My Life Story and Background (short, row 4, col 2-5) */}
        <div style={{ gridRow: '4', gridColumn: '2 / span 4', height: '100%', marginLeft: '-10px' }}>
          <div style={{ ...cardStyle, height: '100%' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Journey to Connection</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Your romantic journey is unique. As you navigate the complexities of love and partnership,
              this space will document your milestones, insights, and the evolution of your connections.<br /><br />
              Lumi AI is here to support you in cultivating a relationship that is as profound as it is fulfilling.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
