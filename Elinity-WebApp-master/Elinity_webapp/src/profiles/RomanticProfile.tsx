import React, { useState } from "react";
import {
  MdHome, MdFavorite, MdShuffle, MdSearch, MdMessage, MdSettings, MdInfo, MdDelete, MdLogout, MdAccessTime,
  MdOutlineNotificationsNone, MdOutlineSettings, MdLocationOn, MdPalette, MdAssignment, MdMenuBook
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useProfileMode } from "../ProfileModeContext";
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

export default function RomanticProfile() {
  const [activeSidebar, setActiveSidebar] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const { setMode }: { setMode: (mode: string) => void } = useProfileMode() as { setMode: (mode: string) => void };
  const navigate = useNavigate();

  const handleModeSelect = (mode: string) => {
    setMode(mode);
    setShowDropdown(false);
    navigate("/profile");
  };

  return (
    <div className="home-root">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo at the top */}
        <div className="sidebar-logo" onClick={() => navigate('/describe-elinity-personality')} style={{ cursor: 'pointer' }}>
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        {/* Navigation icons */}
        <nav className="sidebar-nav">
          {/* Main icons group */}
          <div className="sidebar-group main-icons">
            <button className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`} aria-label="Home" onClick={() => setActiveSidebar("home")}> <MdHome /> {activeSidebar === "home" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`} aria-label="Favorites" onClick={() => setActiveSidebar("favorite")}> <MdFavorite /> {activeSidebar === "favorite" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`} aria-label="Prompt" onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}> <MdAssignment /> {activeSidebar === "prompt" && <span className="sidebar-active-bar" />} </button>
            <button
              className={`sidebar-icon${activeSidebar === "games" ? " active" : ""}`}
              aria-label="Games"
              onClick={() => { setActiveSidebar("games"); navigate("/games"); }}
            >
              <FaGamepad />
              {activeSidebar === "games" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} aria-label="Search" onClick={() => setActiveSidebar("search")}> <MdSearch /> {activeSidebar === "search" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "message" ? " active" : ""}`} aria-label="Messages" onClick={() => setActiveSidebar("message")}> <MdMessage /> {activeSidebar === "message" && <span className="sidebar-active-bar" />} </button>
          </div>
          {/* Divider */}
          <div className="sidebar-divider" />
          {/* Secondary icons group */}
          <div className="sidebar-group secondary-icons">
            <button className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`} aria-label="Settings" onClick={() => setActiveSidebar("settings")}> <MdSettings /> {activeSidebar === "settings" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "clock" ? " active" : ""}`} aria-label="Clock" onClick={() => setActiveSidebar("clock")}> <MdAccessTime /> {activeSidebar === "clock" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "info" ? " active" : ""}`} aria-label="Info" onClick={() => setActiveSidebar("info")}> <MdInfo /> {activeSidebar === "info" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "trash" ? " active" : ""}`} aria-label="Trash" onClick={() => setActiveSidebar("trash")}> <MdDelete /> {activeSidebar === "trash" && <span className="sidebar-active-bar" />} </button>
          </div>
        </nav>
        {/* Logout icon at the bottom */}
        <button className="sidebar-logout red" aria-label="Logout"> <MdLogout /> </button>
      </aside>
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-center">
            <div style={{ position: 'relative', width: '420px', maxWidth: '100%' }}>
              <span className="search-bar-icon"><MdSearch /></span>
              <input className="search-bar" placeholder="Search..." />
            </div>
          </div>
          <div className="topbar-actions" style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
            <button className="topbar-icon"><MdOutlineNotificationsNone /></button>
            <button className="topbar-icon"><MdOutlineSettings /></button>
            <div className="topbar-divider" />
            <div style={{ position: 'relative' }}>
              <div className="topbar-avatar" style={{ cursor: 'pointer' }} onClick={() => setShowDropdown((v) => !v)}>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
              </div>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#23235b',
                  border: '1px solid #a259e6',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0003',
                  zIndex: 1000,
                  minWidth: 140,
                }}>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('leisure')}>Leisure Mode</button>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('romantic')}>Romantic Mode</button>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('collaborative')}>Collaborative Mode</button>
                  <div style={{ borderTop: '1px solid #444', margin: '6px 0' }} />
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => { setShowDropdown(false); navigate('/edit-profile'); }}>Edit Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
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
              <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400&facepad=2" alt="Romantic Woman 2" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2, padding: 20, background: 'linear-gradient(0deg, rgba(24,25,54,0.85) 60%, rgba(24,25,54,0.0) 100%)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ fontWeight: 600, fontSize: 22, color: '#fff', marginBottom: 4 }}>Alice Morgan</div>
                <div style={{ fontSize: 16, color: '#e0e0ff', marginBottom: 4 }}>28 F</div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#e0e0ff', marginBottom: 4 }}>
                  <MdLocationOn style={{ marginRight: 4 }} /> Paris, France
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#e0e0ff', marginBottom: 4 }}>
                  <MdPalette style={{ marginRight: 4 }} /> Digital Artist, Travel Writer
                </div>
              </div>
            </div>
          </div>
          {/* About Me (row 1, col 2-4) */}
          <div style={{ gridRow: '1', gridColumn: '2 / span 3', height: '100%' }}>
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>About Me —</div>
              <div style={{ fontSize: 15, color: '#fff' }}>
                Hi, I’m Alice Morgan — a 28-year-old digital artist and travel writer on a lifelong quest to capture the soul of places and moments. My journey blends pixels and passports. I paint dreamlike visuals inspired by the textures of old cities, ocean winds, and midnight conversations with strangers. Along the way, I write stories — part travel journal, part inner monologue — always grounded in wonder and honesty.<br /><br />
                Basically, I live for good art, deep convos, and the kind of travel that changes you. Let’s create something magical together.
              </div>
            </div>
          </div>
          {/* Looking for Cool People (row 2, col 2-3) */}
          <div style={{ gridRow: '2', gridColumn: '2 / span 2', height: '100%' }}>
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Looking for Cool People</div>
              <ul style={{ fontSize: 15, color: '#fff', paddingLeft: 18, margin: 0 }}>
                <li>Looking forward to connecting with cool humans, fellow wanderers, and anyone who vibes with art, stories, and slow travel. 🌍✨</li>
                <li>Always up for meeting cool people who love art, travel, and meaningful stuff. Let’s connect! ✨</li>
                <li>Looking forward to connecting with cool humans, fellow wanderers, and anyone who vibes with art, stories, and slow travel. 🌍✨</li>
              </ul>
            </div>
          </div>
          {/* Passion & Interest (row 2, col 4) */}
          <div style={{ gridRow: '2', gridColumn: '4', height: '100%' }}>
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Passion & Interest</div>
              <div>
                <span style={tagStyle}>Design</span>
                <span style={tagStyle}>Music</span>
                <span style={tagStyle}>Travel</span>
                <span style={tagStyle}>Art</span>
                <span style={tagStyle}>Example</span>
                <span style={tagStyle}>Etc</span>
              </div>
            </div>
          </div>
          {/* Empty cell for row 2, col 4 for balance */}
          <div style={{ gridRow: '2', gridColumn: '4' }} />
          {/* My Life Story and Background (long text, row 3, col 1-2) */}
          <div style={{ gridRow: '3', gridColumn: '1 / span 2', height: '100%' }}>
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>My Life Story and Background</div>
              <div style={{ fontSize: 15, color: '#fff' }}>
                I grew up in a small coastal town where the skies were always doing something poetic — thunder one minute, golden light the next. As a kid, I was the quiet one with ink-stained fingers, filling sketchbooks and scribbling stories about imaginary cities and people I’d never met.<br /><br />
                Art was always my way of understanding the world. I studied visual communication, worked with indie studios, and for a while, lived that 9-to-5 design life. But somewhere between the daily deadlines and digital chaos, I realized I was craving something slower — something more alive.<br /><br />
                Don’t believe in staying still — not just in geography, but in who you are. I’m always changing, and I think that’s the most beautiful part.
              </div>
            </div>
          </div>
          {/* Core Personality (row 3, col 3) */}
          <div style={{ gridRow: '3', gridColumn: '3', height: '100%' }}>
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Core Personality</div>
              <ul style={{ fontSize: 15, color: '#fff', paddingLeft: 18, margin: 0 }}>
                <li>🎨 Creative – Constantly imagining, sketching</li>
                <li>🌟 Free-spirited – Values independence</li>
                <li>💛 Emotionally intuitive – Deeply feels things</li>
                <li>😌 Calm but passionate</li>
              </ul>
            </div>
          </div>
          {/* Personal Value (row 3, col 4) */}
          <div style={{ gridRow: '3', gridColumn: '4', height: '100%' }}>
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Personal Value</div>
              <ul style={{ fontSize: 15, color: '#fff', paddingLeft: 18, margin: 0 }}>
                <li>🖌️ Authentic self-expression</li>
                <li>💡 Freedom & flexibility</li>
                <li>🧘‍♀️ Mindful living</li>
                <li>🤝 Real connection</li>
                <li>📖 Storytelling</li>
                <li>💛 Empathy & kindness</li>
              </ul>
            </div>
          </div>
          {/* My Life Story and Background Image (row 4, col 1) */}
          <div style={{ gridRow: '4', gridColumn: '1', height: '100%' }}>
            <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '3/4', minHeight: 320, maxHeight: 480 }}>
              <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" alt="Romantic Sunset" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
            </div>
          </div>
          {/* My Life Story and Background (short, row 4, col 2-5) */}
          <div style={{ gridRow: '4', gridColumn: '2 / span 4', height: '100%', marginLeft: '-10px' }}>
            <div style={{ ...cardStyle, height: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>My Life Story and Background</div>
              <div style={{ fontSize: 15, color: '#fff' }}>
                Launched her own digital art brand at 25 — selling dreamy travel-inspired prints and custom illustrations worldwide.<br /><br />
                Featured in 13 international art magazines, including The Wandering Brush and Canvas & Compass.<br /><br />
                Solo online exhibit titled "Light Between Cities" — a visual diary blending sketches and poetry from 12 countries.<br /><br />
                Built a Patreon community of over 300 supporters, sharing behind-the-scenes art, journals, and process videos.<br /><br />
                Her creative journey is fueled by a passion for exploring new cultures, capturing the beauty of everyday moments, and connecting with fellow artists around the world. When she's not painting or writing, you’ll find her hiking in the mountains, experimenting with new recipes, or planning her next adventure. Alice believes that every story, no matter how small, has the power to inspire and bring people together.<br /><br />
                Always eager to collaborate, she welcomes opportunities to work on meaningful projects that celebrate art, travel, and human connection.
              </div>
            </div>
          </div>
        </div>
        </main>
    </div>
  );
}