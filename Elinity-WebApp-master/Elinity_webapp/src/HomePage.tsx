import React, { useState } from "react";
import {
  MdHome, MdFavorite, MdSearch, MdMessage, MdSettings, MdInfo, MdDelete, MdLogout, MdAccessTime,
  MdPeople, MdAssignment, MdLayers, MdArrowForwardIos, MdOutlineNotificationsNone, MdOutlineSettings, MdBook, MdSelfImprovement, MdForum, MdAdminPanelSettings, MdGroup, MdCardMembership
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useProfileMode } from "./ProfileModeContext";
import { useAuth } from "./auth/AuthContext";
import "./HomePage.css";
const HomePage: React.FC = () => {
  const [activeSidebar, setActiveSidebar] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showFavoriteLabel, setShowFavoriteLabel] = useState(false);
  const [showPromptLabel, setShowPromptLabel] = useState(false);
  const [showSearchLabel, setShowSearchLabel] = useState(false);
  const [showMessageLabel, setShowMessageLabel] = useState(false);
  const [showGamesLabel, setShowGamesLabel] = useState(false);
  const [showJournalLabel, setShowJournalLabel] = useState(false);
  const [showSanctuaryLabel, setShowSanctuaryLabel] = useState(false);
  const [showCommunityLabel, setShowCommunityLabel] = useState(false);
  const { mode, setMode } = useProfileMode();
  const { state: authState, logout } = useAuth();
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
            <button
              className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`}
              aria-label="Home"
              onClick={() => setActiveSidebar("home")}
              onMouseEnter={() => setShowHomeLabel(true)}
              onMouseLeave={() => setShowHomeLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdHome />
              {activeSidebar === "home" && <span className="sidebar-active-bar" />}
              {showHomeLabel && (
                <span
                  style={{
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
                  }}
                >
                  Home
                </span>
              )}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`}
              aria-label="Favorites"
              onClick={() => { setActiveSidebar("favorite"); navigate("/memories"); }}
              onMouseEnter={() => setShowFavoriteLabel(true)}
              onMouseLeave={() => setShowFavoriteLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdFavorite />
              {activeSidebar === "favorite" && <span className="sidebar-active-bar" />}
              {showFavoriteLabel && (
                <span
                  style={{
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
                  }}
                >
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
                <span
                  style={{
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
                  }}
                >
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
                <span
                  style={{
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
                  }}
                >
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
                <span
                  style={{
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
                  }}
                >
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
                <span
                  style={{
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
                  }}
                >
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
            <button
              className={`sidebar-icon${activeSidebar === "community" ? " active" : ""}`}
              aria-label="Community"
              onClick={() => { setActiveSidebar("community"); navigate("/community"); }}
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
          {/* Divider */}
          <div className="sidebar-divider" />
          {/* Secondary icons group */}
            <button
              className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`}
              aria-label="Settings"
              onClick={() => setActiveSidebar("settings")}
            >
              <MdSettings />
              {activeSidebar === "settings" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "subscription" ? " active" : ""}`}
              aria-label="Subscription"
              onClick={() => { setActiveSidebar("subscription"); navigate("/subscription"); }}
            >
              <MdCardMembership />
              {activeSidebar === "subscription" && <span className="sidebar-active-bar" />}
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
        {/* Logout icon at the bottom */}
        <button className="sidebar-logout red" aria-label="Logout">
          <MdLogout />
        </button>
      </aside>
      <main className="main-content">
        {/* Top bar with centered search and right actions */}
        <div className="topbar">
          <div className="topbar-center">
            <div style={{ position: 'relative', width: '420px', maxWidth: '100%' }}>
              <span className="search-bar-icon"><MdSearch /></span>
              <input className="search-bar" placeholder="Search..." />
            </div>
          </div>
          <div className="topbar-actions" style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
            <button className="topbar-icon" onClick={() => navigate('/notifications')}><MdOutlineNotificationsNone /></button>
            <button className="topbar-icon"><MdOutlineSettings /></button>
            <div className="topbar-divider" />
            {!authState?.isAuthenticated ? (
              <button className="topbar-login" onClick={() => navigate('/login')}>Login</button>
            ) : (
              <button className="topbar-logout" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
            )}
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
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('leisure')}>Leisure Mode</button>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('romantic')}>Romantic Mode</button>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('collaborative')}>Collaborative Mode</button>
                  <div style={{ borderTop: '1px solid #444', margin: '6px 0' }} />
                  <button
                    style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                    onClick={() => {
                      setShowDropdown(false);
                      if (mode === 'leisure') {
                        navigate('/leisure-profile');
                      } else if (mode === 'romantic') {
                        navigate('/romantic-profile');
                      } else if (mode === 'collaborative') {
                        navigate('/collaborative-profile');
                      } else {
                        navigate('/profile'); // fallback
                      }
                    }}
                  >
                    View Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Greeting */}
        <section className="greeting">
          <h1 className="greeting-title">Hey Suraj,</h1>
          <p className="greeting-sub">What would You like to do?</p>
        </section>
        {/* Cards Grid */}
        <section className="cards-section">
          <div className="cards-row">
            <div className="card large card-vertical" onClick={() => navigate("/daily-suggestions")} style={{ cursor: 'pointer' }}>
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdPeople /></div>
                <h2>Explore your daily Recommendation</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
            <div className="card large card-vertical" onClick={() => navigate("/admin")} style={{ cursor: 'pointer' }}>
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdAdminPanelSettings /></div>
                <h2>Admin Panel</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
          </div>
          <div className="cards-row">
            <div className="card large card-vertical" onClick={() => navigate("/sanctuary")} style={{ cursor: 'pointer' }}>
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdSelfImprovement /></div>
                <h2>Personal Sanctuary</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
            <div className="card large card-vertical" onClick={() => navigate("/connection-discovery")} style={{ cursor: 'pointer' }}>
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdFavorite /></div>
                <h2>Connection & Discovery</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
            <div className="card large card-vertical" onClick={() => navigate("/blogs")} style={{ cursor: 'pointer' }}>
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdBook /></div>
                <h2>Blogs & Insights</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
          </div>
          <div className="cards-row">
            <div className="card large card-vertical" onClick={() => navigate("/resources")} style={{ cursor: 'pointer' }}>
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdAssignment /></div>
                <h2>Relationship Resources</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
            <div className="card large card-vertical" onClick={() => navigate("/my-circle")} style={{ cursor: 'pointer' }}>
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdGroup /></div>
                <h2>My Circle</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
          </div>
          {/* Purple gradient divider */}
          <div className="divider-glow"></div>
          <div className="cards-row small">
            <div className="card small card-vertical">
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdPeople /></div>
                <h2>Relationship Dashboard</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
            <div className="card small card-vertical">
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdLayers /></div>
                <h2>Question Cards</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
            <div className="card small card-vertical">
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdLayers /></div>
                <h2>Relationship Coach</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
            <div className="card small card-vertical">
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdAssignment /></div>
                <h2>Relationship Pad</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
          </div>
          <div className="cards-row">
            <div className="card large card-vertical">
              <div className="card-icon-with-text">
                <div className="card-icon no-bg"><MdHome /></div>
                <h2>Your Relationship Home</h2>
              </div>
              <span className="card-arrow"><MdArrowForwardIos /></span>
            </div>
          </div>
        </section>
        {/* See more row (optional, for Figma completeness) */}
        <div className="see-more-row">
          <button className="see-more-btn">See more <MdArrowForwardIos /></button>
        </div>
      </main>
    </div >
  );
};

export default HomePage;