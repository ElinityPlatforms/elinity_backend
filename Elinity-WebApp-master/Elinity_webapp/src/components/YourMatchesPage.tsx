import React, { useState } from "react";
import { MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdInfo, MdDelete, MdLogout, MdAccessTime, MdOutlineNotificationsNone, MdOutlineSettings, MdMenuBook, MdBook } from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../HomePage.css";

import { useApiClient } from "../services/apiClient";

const YourMatchesPage: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState("favorite");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showYourMatchesLabel, setShowYourMatchesLabel] = useState(false);
  const [showJournalLabel, setShowJournalLabel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth('/connections/?status_filter=matched');
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item: any) => ({
            id: item.connection_id,
            name: item.name,
            location: "Unknown Location",
            avatar: item.avatar || "https://via.placeholder.com/150",
            description: item.bio || "No description available.",
            tags: ["Match", item.mode || "General"],
            compatibility: item.metrics?.healthScore || 80,
            aiInsights: "You share similar interests and values!"
          }));
          setMatches(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, [fetchWithAuth]);

  return (
    <div className="home-root">
      {/* Sidebar  */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
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
              onClick={() => { setActiveSidebar("favorite"); navigate("/your-matches"); }}
              onMouseEnter={() => setShowYourMatchesLabel(true)}
              onMouseLeave={() => setShowYourMatchesLabel(false)}
              style={{ position: 'relative' }}
            >
              <MdFavorite />
              {activeSidebar === "favorite" && <span className="sidebar-active-bar" />}
              {showYourMatchesLabel && (
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
            >
              <MdAssignment />
              {activeSidebar === "prompt" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`}
              aria-label="Search"
              onClick={() => setActiveSidebar("search")}
            >
              <MdSearch />
              {activeSidebar === "search" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "message" ? " active" : ""}`}
              aria-label="Messages"
              onClick={() => setActiveSidebar("message")}
            >
              <MdMessage />
              {activeSidebar === "message" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "games" ? " active" : ""}`}
              aria-label="Games"
              onClick={() => { setActiveSidebar("games"); navigate("/games"); }}
            >
              <FaGamepad />
              {activeSidebar === "games" && <span className="sidebar-active-bar" />}
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
      {/* Topbar (copied from HomePage) */}
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
                <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>Leisure Mode</button>
                <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>Romantic Mode</button>
                <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>Collaborative Mode</button>
                <div style={{ borderTop: '1px solid #444', margin: '6px 0' }} />
                <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>View Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main content below topbar */}
      <main className="main-content">
        {/* Remove the search bar above the tabs, keep only the topbar search */}
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", marginBottom: 36, marginTop: 64 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              background: "rgba(61,56,112,0.18)",
              boxShadow: "0 2px 8px #a259e622",
              borderRadius: 18,
              backdropFilter: "blur(16px)",
              padding: "12px 24px",
              // marginTop removed from here, now on parent
            }}
          >
            {/* Only render the tabs here, not the search bar */}
            <div style={{ display: "flex", gap: 8 }}>
              {['All matches', 'Tab1', 'Tab2', 'Tab3'].map((tab, i) => (
                <button
                  key={tab}
                  className={"tab-btn" + (activeTab === i ? " active" : "")}
                  style={{
                    background: activeTab === i ? "linear-gradient(90deg, #a259e6 0%, #3a6cf6 100%)" : "#23235b",
                    color: activeTab === i ? "#fff" : "#bdbdf7",
                    border: "none",
                    borderRadius: 12,
                    padding: "8px 28px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: activeTab === i ? "0 2px 12px #a259e655" : "none",
                    letterSpacing: 0.2,
                    transition: "all 0.2s",
                  }}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#fff", paddingTop: 40 }}>Loading matches...</div>
          ) : matches.length === 0 ? (
            <div style={{ textAlign: "center", color: "#fff", paddingTop: 40 }}>No matches found.</div>
          ) : (
            <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
              {matches.map((user) => (
                <div
                  key={user.id}
                  style={{
                    background: "rgba(61, 56, 112, 0.32)",
                    borderRadius: 28,
                    boxShadow: "0 8px 40px 0 #a259e655, 0 2px 8px 0 #fff1 inset",
                    backdropFilter: "blur(32px)",
                    border: "1.5px solid rgba(162, 89, 230, 0.12)",
                    padding: 40,
                    minWidth: 480,
                    maxWidth: 520,
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3.5px solid #fff", boxShadow: "0 2px 12px #0006" }}
                    />
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 26, color: "#fff" }}>{user.name}</div>
                      <div style={{ color: "#bdbdf7", fontSize: 17, fontWeight: 500, marginLeft: 10 }}>{user.location}</div>
                    </div>
                    <span style={{ background: "#2ecc71", color: "#fff", fontWeight: 700, fontSize: 15, borderRadius: 10, padding: "6px 18px", boxShadow: "0 2px 8px #2ecc7133" }}>
                      High Compatibility
                    </span>
                  </div>
                  <div style={{ color: "#e0d7fa", fontSize: 16, marginBottom: 4, maxWidth: 420, lineHeight: 1.5 }}>{user.description}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 8 }}>
                    {user.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "rgba(162, 89, 230, 0.18)",
                          color: "#bdbdf7",
                          borderRadius: 16,
                          padding: "4px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          letterSpacing: 0.1,
                          marginBottom: 2,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, margin: "10px 0 2px 0", color: "#fff" }}>AI Scores</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ color: "#bdbdf7", fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Compatibility</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, background: "#23235b", borderRadius: 8, height: 6, overflow: "hidden" }}>
                        <div style={{ width: user.compatibility + "%", height: 6, background: "linear-gradient(90deg, #a259e6 0%, #4cd137 100%)" }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{user.compatibility}%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 16, background: "rgba(61,56,112,0.22)", borderRadius: 16, padding: 18, boxShadow: "0 2px 8px #a259e622", border: "1.5px solid #a259e6", backdropFilter: "blur(12px)" }}>
                    <span style={{ fontSize: 28, color: "#a259e6", marginTop: 2 }}>🧠</span>
                    <div style={{ color: "#fff", fontSize: 15, lineHeight: 1.5 }}>{user.aiInsights}</div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default YourMatchesPage;