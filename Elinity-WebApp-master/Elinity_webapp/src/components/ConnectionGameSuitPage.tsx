import React, { useState } from 'react';
import {
  MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdAccessTime, MdInfo, MdDelete, MdLogout, MdOutlineNotificationsNone, MdOutlineSettings, MdMenuBook, MdQuiz, MdForum
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../HomePage.css";

const gamepadImg = 'https://openmoji.org/data/color/png/256/1F3AE.png';
const games = [
  {
    title: 'Flirt or Fact',
    desc: 'Each person shares 3 statements. One is a real fact, one is a compliment/flirty line, and one is nonsense. The other must guess which is which.',
    img: gamepadImg,
  },
  {
    title: 'Rom Com',
    desc: 'Each player pitches a made-up romantic comedy based on your personalities',
    img: gamepadImg,
  },
  {
    title: 'Alternate Universe Dating Profile',
    desc: 'You and your match each invent a dating profile for yourself - but in an alternate universe',
    img: gamepadImg,
  },
  {
    title: 'The Tiny Turn-On Test',
    desc: 'AI gives subtle prompts like “What’s a tiny detail that instantly makes someone more attractive to you?”',
    img: gamepadImg,
  },
  // Repeat for demo
  {
    title: 'Flirt or Fact',
    desc: 'Each person shares 3 statements. One is a real fact, one is a compliment/flirty line, and one is nonsense. The other must guess which is which.',
    img: gamepadImg,
  },
  {
    title: 'Rom Com',
    desc: 'Each player pitches a made-up romantic comedy based on your personalities',
    img: gamepadImg,
  },
  {
    title: 'Alternate Universe Dating Profile',
    desc: 'You and your match each invent a dating profile for yourself - but in an alternate universe',
    img: gamepadImg,
  },
  {
    title: 'The Tiny Turn-On Test',
    desc: 'AI gives subtle prompts like “What’s a tiny detail that instantly makes someone more attractive to you?”',
    img: gamepadImg,
  },
];

export default function ConnectionGameSuitPage() {
  const [activeSidebar, setActiveSidebar] = useState("games");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showFavoriteLabel, setShowFavoriteLabel] = useState(false);
  const [showPromptLabel, setShowPromptLabel] = useState(false);
  const [showSearchLabel, setShowSearchLabel] = useState(false);
  const [showMessageLabel, setShowMessageLabel] = useState(false);
  const [showGamesLabel, setShowGamesLabel] = useState(false);
  const [showCommunityLabel, setShowCommunityLabel] = useState(false);

  return (
    <div className="home-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group main-icons">
            <button className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`} aria-label="Home" onClick={() => { setActiveSidebar("home"); navigate("/"); }}
              onMouseEnter={() => setShowHomeLabel(true)}
              onMouseLeave={() => setShowHomeLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdHome />
              {activeSidebar === "home" && <span className="sidebar-active-bar" />}
              {showHomeLabel && (
                <span style={{
                  position: 'absolute',
                  left: '70%',
                  top: '120%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(35,35,91,0.98)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                }}>
                  Home
                </span>
              )}
            </button>
            <button className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`} aria-label="Favorites" onClick={() => { setActiveSidebar("favorite"); navigate("/your-matches"); }}
              onMouseEnter={() => setShowFavoriteLabel(true)}
              onMouseLeave={() => setShowFavoriteLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdFavorite />
              {activeSidebar === "favorite" && <span className="sidebar-active-bar" />}
              {showFavoriteLabel && (
                <span style={{
                  position: 'absolute',
                  left: '70%',
                  top: '120%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(35,35,91,0.98)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                }}>
                  Your Matches
                </span>
              )}
            </button>
            <button className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`} aria-label="Prompt" onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}
              onMouseEnter={() => setShowPromptLabel(true)}
              onMouseLeave={() => setShowPromptLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdAssignment />
              {activeSidebar === "prompt" && <span className="sidebar-active-bar" />}
              {showPromptLabel && (
                <span style={{
                  position: 'absolute',
                  left: '70%',
                  top: '120%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(35,35,91,0.98)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                }}>
                  Prompt
                </span>
              )}
            </button>
            <button className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} aria-label="Search" onClick={() => setActiveSidebar("search") }
              onMouseEnter={() => setShowSearchLabel(true)}
              onMouseLeave={() => setShowSearchLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdSearch />
              {activeSidebar === "search" && <span className="sidebar-active-bar" />}
              {showSearchLabel && (
                <span style={{
                  position: 'absolute',
                  left: '70%',
                  top: '120%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(35,35,91,0.98)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                }}>
                  Search
                </span>
              )}
            </button>
            <button className={`sidebar-icon${location.pathname === "/chat" ? " active" : ""}`} aria-label="Messages" onClick={() => { setActiveSidebar("message"); navigate("/chat"); }}
              onMouseEnter={() => setShowMessageLabel(true)}
              onMouseLeave={() => setShowMessageLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdMessage />
              {activeSidebar === "message" && <span className="sidebar-active-bar" />}
              {showMessageLabel && (
                <span style={{
                  position: 'absolute',
                  left: '70%',
                  top: '120%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(35,35,91,0.98)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                }}>
                  Messages
                </span>
              )}
            </button>
            <button className={`sidebar-icon${activeSidebar === "games" ? " active" : ""}`} aria-label="Games" onClick={() => { setActiveSidebar("games"); navigate("/games"); }}
              onMouseEnter={() => setShowGamesLabel(true)}
              onMouseLeave={() => setShowGamesLabel(false)}
              style={{ position: 'relative' }}
            >
              <FaGamepad />
              {activeSidebar === "games" && <span className="sidebar-active-bar" />}
              {showGamesLabel && (
                <span style={{
                  position: 'absolute',
                  left: '70%',
                  top: '120%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(35,35,91,0.98)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                }}>
                  Games
                </span>
              )}
            </button>
            <button className={`sidebar-icon${activeSidebar === "community" ? " active" : ""}`} aria-label="Community" onClick={() => { setActiveSidebar("community"); navigate("/community"); }}
              onMouseEnter={() => setShowCommunityLabel(true)}
              onMouseLeave={() => setShowCommunityLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdForum />
              {activeSidebar === "community" && <span className="sidebar-active-bar" />}
              {showCommunityLabel && (
                <span style={{
                  position: 'absolute',
                  left: '70%',
                  top: '120%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(35,35,91,0.98)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                  whiteSpace: 'nowrap',
                  zIndex: 100,
                }}>
                  Community
                </span>
              )}
            </button>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-group secondary-icons">
            <button className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`} aria-label="Settings" onClick={() => setActiveSidebar("settings")}><MdSettings />{activeSidebar === "settings" && <span className="sidebar-active-bar" />}</button>
            <button className={`sidebar-icon${activeSidebar === "clock" ? " active" : ""}`} aria-label="Clock" onClick={() => setActiveSidebar("clock")}><MdAccessTime />{activeSidebar === "clock" && <span className="sidebar-active-bar" />}</button>
            <button className={`sidebar-icon${activeSidebar === "info" ? " active" : ""}`} aria-label="Info" onClick={() => setActiveSidebar("info")}><MdInfo />{activeSidebar === "info" && <span className="sidebar-active-bar" />}</button>
            <button className={`sidebar-icon${activeSidebar === "trash" ? " active" : ""}`} aria-label="Trash" onClick={() => setActiveSidebar("trash")}><MdDelete />{activeSidebar === "trash" && <span className="sidebar-active-bar" />}</button>
          </div>
        </nav>
        <button className="sidebar-logout red" aria-label="Logout"><MdLogout /></button>
      </aside>
      <main className="main-content with-topbar-margin">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-center">
            <div style={{ position: 'relative', width: 420, maxWidth: '100%' }}>
              <span className="search-bar-icon"><MdSearch /></span>
              <input className="search-bar" placeholder="Search" />
            </div>
          </div>
          <div className="topbar-actions" style={{ alignItems: 'center', display: 'flex', gap: 20 }}>
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
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => { setShowDropdown(false); navigate('/edit-profile'); }}>Edit Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div style={{ padding: '32px 24px', minHeight: '100vh', background: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 28, margin: 0 }}>Connection Game Suit</h2>
            <button
              onClick={() => navigate('/quizzes')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <MdQuiz size={20} />
              Quizzes & Activities
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 32,
            justifyContent: 'center',
          }}>
            {games.map((game, idx) => (
              <div key={idx} style={{
                background: 'rgba(61, 56, 112, 0.22)',
                borderRadius: 24,
                boxShadow: '0 8px 32px 0 #a259e655',
                padding: '32px 18px 24px 18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 320,
                position: 'relative',
              }}>
                <img src={game.img} alt={game.title} style={{ width: 90, height: 90, borderRadius: 16, marginBottom: 18, objectFit: 'cover', background: '#fff' }} />
                <button
                  style={{ position: 'absolute', top: 18, left: 18, background: 'rgba(162, 89, 230, 0.18)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, cursor: 'pointer' }}
                  onClick={() => {
                    navigate('/game-info', { state: { title: game.title, desc: game.desc, img: game.img } });
                  }}
                >&#9654;</button>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 18, marginBottom: 12, textAlign: 'center' }}>{game.title}</div>
                <div style={{ color: '#bdbdf7', fontSize: 14, textAlign: 'center' }}>{game.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 