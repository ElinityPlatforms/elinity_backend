import React, { useState } from 'react';
import {
  MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdAccessTime, MdInfo, MdDelete, MdLogout,
  MdOutlineNotificationsNone, MdOutlineSettings, MdBook, MdSelfImprovement, MdPalette, MdLightbulb, MdPsychology
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import '../HomePage.css';
import './SanctuaryRoom.css';
import MeditationBox from './MeditationBox';
import VisualizationBox from './VisualizationBox';
import LifePaintingBox from './LifePaintingBox';
import IntentionsBox from './IntentionsBox';
import AICoachRoomBox from './AICoachRoomBox';

const SanctuaryRoom: React.FC = () => {
  const [activeSidebar, setActiveSidebar] = useState("sanctuary");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showFavoriteLabel, setShowFavoriteLabel] = useState(false);
  const [showPromptLabel, setShowPromptLabel] = useState(false);
  const [showSearchLabel, setShowSearchLabel] = useState(false);
  const [showMessageLabel, setShowMessageLabel] = useState(false);
  const [showGamesLabel, setShowGamesLabel] = useState(false);
  const [showJournalLabel, setShowJournalLabel] = useState(false);
  const [showSanctuaryLabel, setShowSanctuaryLabel] = useState(false);

  return (
    <div className="home-root" style={{ minHeight: '100vh', height: '100%', background: 'linear-gradient(135deg, #23235b 0%, #2a1a4a 100%)' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/describe-elinity-personality')} style={{ cursor: 'pointer' }}>
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group main-icons">
            <button
              className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`}
              aria-label="Home"
              onClick={() => { setActiveSidebar("home"); navigate("/"); }}
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
            <button
              className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`}
              aria-label="Favorites"
              onClick={() => { setActiveSidebar("favorite"); navigate("/your-matches"); }}
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
            <button
              className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`}
              aria-label="Prompt"
              onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}
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
            <button
              className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`}
              aria-label="Search"
              onClick={() => setActiveSidebar("search")}
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
            <button
              className={`sidebar-icon${activeSidebar === "message" ? " active" : ""}`}
              aria-label="Messages"
              onClick={() => { setActiveSidebar("message"); navigate("/chat"); }}
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
            <button
              className={`sidebar-icon${activeSidebar === "games" ? " active" : ""}`}
              aria-label="Games"
              onClick={() => { setActiveSidebar("games"); navigate("/games"); }}
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
            <button
              className={`sidebar-icon${activeSidebar === "journal" ? " active" : ""}`}
              aria-label="Journal"
              onClick={() => { setActiveSidebar("journal"); navigate("/journal"); }}
              onMouseEnter={() => setShowJournalLabel(true)}
              onMouseLeave={() => setShowJournalLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdBook />
              {activeSidebar === "journal" && <span className="sidebar-active-bar" />}
              {showJournalLabel && (
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
                  Journal
                </span>
              )}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "sanctuary" ? " active" : ""}`}
              aria-label="Sanctuary"
              onClick={() => { setActiveSidebar("sanctuary"); navigate("/sanctuary"); }}
              onMouseEnter={() => setShowSanctuaryLabel(true)}
              onMouseLeave={() => setShowSanctuaryLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdSelfImprovement />
              {activeSidebar === "sanctuary" && <span className="sidebar-active-bar" />}
              {showSanctuaryLabel && (
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
                  Sanctuary
                </span>
              )}
            </button>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-group secondary-icons">
            <button
              className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`}
              aria-label="Settings"
              onClick={() => setActiveSidebar("settings")}
            >
              <MdSettings />
              {activeSidebar === "settings" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "clock" ? " active" : ""}`}
              aria-label="Clock"
              onClick={() => setActiveSidebar("clock")}
            >
              <MdAccessTime />
              {activeSidebar === "clock" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "info" ? " active" : ""}`}
              aria-label="Info"
              onClick={() => setActiveSidebar("info")}
            >
              <MdInfo />
              {activeSidebar === "info" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "trash" ? " active" : ""}`}
              aria-label="Trash"
              onClick={() => setActiveSidebar("trash")}
            >
              <MdDelete />
              {activeSidebar === "trash" && <span className="sidebar-active-bar" />}
            </button>
          </div>
        </nav>
        <button className="sidebar-logout red" aria-label="Logout">
          <MdLogout />
        </button>
      </aside>

      <main className="main-content with-topbar-margin" style={{ width: '100%' }}>
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-center">
            <div style={{ position: 'relative', width: 420, maxWidth: '100%' }}>
              <span className="search-bar-icon"><MdSearch /></span>
              <input className="search-bar" placeholder="Search..." />
            </div>
          </div>
          <div className="topbar-actions" style={{ alignItems: 'center', display: 'flex', gap: 20 }}>
            <button className="topbar-icon"><MdOutlineNotificationsNone /></button>
            <button className="topbar-icon"><MdOutlineSettings /></button>
            <div className="topbar-divider" />
            <div style={{ position: 'relative' }}>
              <div
                className="topbar-avatar"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowDropdown((v) => !v)}
              >
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
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setShowDropdown(false)}>Edit Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sanctuary Room Header */}
        <section className="sanctuary-header">
          <h1 className="sanctuary-title">Personal Sanctuary</h1>
          <p className="sanctuary-subtitle">Your space for mindfulness, growth, and self-discovery</p>
        </section>

        {/* Sanctuary Boxes Grid */}
        <section className="sanctuary-grid">
          <MeditationBox />
          <VisualizationBox />
          <LifePaintingBox />
          <IntentionsBox />
          <AICoachRoomBox />
        </section>
      </main>
    </div>
  );
};

export default SanctuaryRoom;
