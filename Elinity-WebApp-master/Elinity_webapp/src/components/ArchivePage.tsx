import React, { useState, useEffect } from 'react';
import {
  MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdAccessTime, MdInfo, MdDelete, MdLogout, MdOutlineNotificationsNone, MdOutlineSettings, MdBook, MdChatBubbleOutline, MdPsychology, MdSentimentSatisfiedAlt, MdSentimentNeutral, MdPlayCircleOutline, MdDownloadForOffline, MdKeyboardVoice
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import '../HomePage.css';
import { useLifebookService, Lifebook } from '../services/lifebookService';

export default function ArchivePage() {
  const [activeSidebar, setActiveSidebar] = useState("journal");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showFavoriteLabel, setShowFavoriteLabel] = useState(false);
  const [showPromptLabel, setShowPromptLabel] = useState(false);
  const [showSearchLabel, setShowSearchLabel] = useState(false);
  const [showMessageLabel, setShowMessageLabel] = useState(false);
  const [showGamesLabel, setShowGamesLabel] = useState(false);
  const [showJournalLabel, setShowJournalLabel] = useState(false);

  const [lifebooks, setLifebooks] = useState<Lifebook[]>([]);
  const [loading, setLoading] = useState(true);
  const lifebookService = useLifebookService();

  useEffect(() => {
    async function loadLifebooks() {
      try {
        const { getLifebooks } = await lifebookService; // useLifebookService is async in the file I created? No, wait. 
        // Let's check lifebookService.ts again.
        // It exports `useLifebookService` which is an async function that returns { getLifebooks, getEntries }. 
        // So I need to await it. 
        const service = await lifebookService;
        const data = await service.getLifebooks();
        setLifebooks(data);
      } catch (err) {
        console.error("Failed to load lifebooks", err);
      } finally {
        setLoading(false);
      }
    }
    loadLifebooks();
  }, []);

  return (
    <div className="home-root" style={{ minHeight: '100vh', height: '100%', background: 'linear-gradient(180deg, #23235b 0%, #3a6cf6 100%)' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
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
            <button className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} aria-label="Search" onClick={() => setActiveSidebar("search")}
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
            <button className={`sidebar-icon${activeSidebar === "journal" ? " active" : ""}`} aria-label="Journal" onClick={() => { setActiveSidebar("journal"); navigate("/journal"); }}
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
      <main className="main-content with-topbar-margin" style={{ width: '100%' }}>
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
        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 26, marginBottom: 18, display: 'flex', alignItems: 'center', gap: '10px' }}>Archive <span role="img" aria-label="archive" style={{ fontSize: '24px' }}>📚</span></h2>

        {/* Archive Content */}
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 40, marginBottom: 40, justifyContent: 'space-between' }}>
            {/* Dynamic Content from Lifebook Service */}
            <div style={{ flex: 3 }}>
              {loading ? (
                <div style={{ color: '#fff' }}>Loading archive...</div>
              ) : lifebooks.length === 0 ? (
                <div style={{ color: '#ccc' }}>No archived items found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {lifebooks.map((lb) => (
                    <div key={lb.id} className="card card--figma" style={{ minHeight: 90, width: '100%', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px', background: 'rgba(30, 30, 70, 0.5)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 30, color: '#a259e6' }}>📖</span>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>{lb.name}</div>
                          <div style={{ color: '#bdbdf7', fontSize: 13 }}>{lb.description || "No description"}</div>
                        </div>
                      </div>
                      <span style={{ color: '#fff', fontSize: 22, cursor: 'pointer' }}>⋮</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Archive Management Card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '33%' }}>
              <div className="card card--figma" style={{ minHeight: 120, width: '100%', padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '16px', background: 'rgba(30, 30, 70, 0.5)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)' }}>
                <div style={{ color: '#fff', fontWeight: 500, fontSize: 15, marginBottom: 18 }}>Archive Management</div>
                <div style={{ color: '#bdbdf7', fontSize: 14, marginBottom: 18 }}>3 new entries from your partner this week. Latest: "Weekend Plans"</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button style={{ background: 'linear-gradient(90deg,#a259e6,#3a6cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 8px rgba(58, 108, 246, 0.2), 0 1px 0 rgba(255, 255, 255, 0.1) inset' }}>Manage Setting</button>
                  <button style={{ background: 'rgba(162, 89, 230, 0.15)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Learn more</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}