import React, { useState } from "react";
import { useProfileMode } from "../ProfileModeContext";
import "../HomePage.css";
import { useNavigate } from "react-router-dom";
import {
  MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdInfo, MdDelete, MdLogout, MdAccessTime,
  MdOutlineNotificationsNone, MdOutlineSettings, MdPeople, MdArrowForwardIos, MdStars, MdMenuBook
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { TbArrowsShuffle } from "react-icons/tb";

import { useApiClient } from "../services/apiClient";

const promptSuggestions = [
  "Someone who loves to talk about Quantum Physics and psychology stuff.",
  "A foodie who enjoys exploring new restaurants.",
  "Looking for a travel buddy for spontaneous adventures.",
  "Someone passionate about AI and startups.",
  "A bookworm who loves deep conversations.",
  "An artist who finds beauty in the ordinary.",
  "A music lover who enjoys live concerts.",
  "Someone who loves hiking and the outdoors."
];

const defaultPrompt = promptSuggestions[0];

const PromptPage: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const { mode, setMode } = useProfileMode();
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [curated, setCurated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const navigate = useNavigate();
  const [activeSidebar, setActiveSidebar] = useState("prompt");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleModeSelect = (selectedMode: string) => {
    setMode(selectedMode);
    setCurated(false);
    setResults([]);
  };

  const handleCurate = async () => {
    if (!mode || !(inputValue.trim() || defaultPrompt)) return;
    setLoading(true);
    try {
      const prompt = inputValue.trim() || defaultPrompt;
      // Fetch recommendations based on prompt
      const res = await fetchWithAuth(`/recommendations/search?query=${encodeURIComponent(prompt)}`);
      if (res.ok) {
        const data = await res.json();
        const matches = data.map((item: any) => {
          const t = item.tenant;
          const p = t.personal_info || {};
          return {
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
            role: p.business_title || p.occupation || 'Member',
            avatar: t.profile_image_url || 'https://via.placeholder.com/150',
            info: t.bio || ((t.interests_and_hobbies?.interests || []).join(', ')) || "No bio available",
            insight: item.ai_insight,
            score: Math.round((item.score || 0) * 100)
          };
        });
        setLoading(false);
        navigate("/results", { state: { results: matches } });
      } else {
        console.error("Failed to fetch recommendations");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleNextPrompt = () => {
    const nextIdx = (currentPromptIdx + 1) % promptSuggestions.length;
    setCurrentPromptIdx(nextIdx);
    setInputValue("");
    setCurated(false);
    setResults([]);
  };

  const handleClear = () => {
    setInputValue("");
    setCurated(false);
    setResults([]);
    setLoading(false);
  };

  const isCurateDisabled = !mode || !(inputValue.trim() || defaultPrompt);

  // Add a simple spinner component
  const Spinner = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
      <div style={{
        border: '4px solid #eceafd',
        borderTop: '4px solid #a259e6',
        borderRadius: '50%',
        width: 36,
        height: 36,
        animation: 'spin 1s linear infinite',
        marginBottom: 16
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={{ color: '#bdbdf7', fontWeight: 400, fontSize: 16, marginTop: 2 }}>Finding your vibe-matched people...</div>
    </div>
  );

  return (
    <div className="home-root" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group main-icons">
            <button
              className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`}
              aria-label="Home"
              onClick={() => { setActiveSidebar("home"); navigate("/"); }}
            >
              <MdHome />
              {activeSidebar === "home" && <span className="sidebar-active-bar" />}
            </button>
            <button
              className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`}
              aria-label="Favorites"
              onClick={() => setActiveSidebar("favorite")}
            >
              <MdFavorite />
              {activeSidebar === "favorite" && <span className="sidebar-active-bar" />}
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
      {/* Topbar (copied from HomePage/YourMatchesPage) */}
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
      {/* Main Content */}
      <main className="main-content" style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 80, padding: "0 48px 0 72px" }}>
        {/* Left: Prompt Card and Input */}
        <div style={{ flex: 2, maxWidth: 600, minWidth: 320, display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 32 }}>
          <h2 style={{ color: "#f5f6fa", fontWeight: 400, marginBottom: 24, alignSelf: "flex-start", fontSize: 28, letterSpacing: 0.2 }}>Prompt your way to Your People</h2>
          <div className="card" style={{ borderRadius: 28, boxShadow: "0 8px 32px 0 #a259e655, 0 1.5px 8px 0 #fff1 inset", padding: 48, minHeight: 240, marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#f5f6fa", fontWeight: 300, position: "relative", width: "100%", background: "linear-gradient(135deg, rgba(162,89,230,0.18) 0%, rgba(58,108,246,0.18) 100%)", backdropFilter: "blur(12px)", border: "2.5px solid rgba(162, 89, 230, 0.18)" }}>
            <span style={{ textAlign: "left", width: "100%", fontWeight: 300, color: "#f5f6fa", letterSpacing: 0.1 }}>{inputValue.trim() || promptSuggestions[currentPromptIdx]}</span>
            <button onClick={handleNextPrompt} style={{ position: "absolute", bottom: 18, right: 24, background: "rgba(162,89,230,0.12)", color: "#fff", border: "1.5px solid #a259e6", borderRadius: 8, padding: "4px 14px", fontWeight: 400, fontSize: 15, cursor: "pointer", boxShadow: "0 1px 4px #a259e622", opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
              <TbArrowsShuffle style={{ fontSize: 16, opacity: 0.8 }} /> Next
            </button>
          </div>
          <div className="card" style={{ marginBottom: 18, width: "100%", padding: 0, background: "rgba(24,25,54,0.12)", borderRadius: 18, boxShadow: "0 2px 8px 0 #a259e622", border: "1.5px solid rgba(162, 89, 230, 0.10)", backdropFilter: "blur(8px)" }}>
            <input
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setCurated(false); setResults([]); }}
              placeholder="+ Type Here"
              style={{ width: "100%", padding: 18, borderRadius: 18, border: "none", background: "transparent", color: "#f5f6fa", fontSize: 18, outline: "none", backgroundClip: "padding-box", fontWeight: 300, letterSpacing: 0.1 }}
            />
          </div>
          {loading && (
            <div style={{ marginTop: 32, color: "#a259e6", fontWeight: 500, fontSize: 20 }}>Curating people...</div>
          )}
        </div>
        {/* Right: Mode Selector and Curate Button */}
        <div style={{ flex: 1, maxWidth: 320, minWidth: 220, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: "100%" }}>
          <div style={{ color: "#f5f6fa", fontWeight: 300, fontSize: 17, marginBottom: 32, alignSelf: "flex-start" }}>Choose a mode to match your intention..</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32, width: "100%" }}>
            <button
              onClick={() => handleModeSelect("romantic")}
              className={mode === "romantic" ? "active-mode-btn" : ""}
              style={{ padding: 18, borderRadius: 14, border: "none", background: mode === "romantic" ? "#23235b" : "#181936", color: mode === "romantic" ? "#fff" : "#bdbdf7", fontWeight: 400, fontSize: 18, boxShadow: mode === "romantic" ? "0 0 0 2px #a259e6" : "0 2px 8px 0 #a259e622", cursor: "pointer", outline: "none", width: "100%", letterSpacing: 0.1 }}
            >
              Romantic Mode
            </button>
            <button
              onClick={() => handleModeSelect("leisure")}
              className={mode === "leisure" ? "active-mode-btn" : ""}
              style={{ padding: 18, borderRadius: 14, border: "none", background: mode === "leisure" ? "#fff" : "#181936", color: mode === "leisure" ? "#23235b" : "#bdbdf7", fontWeight: 400, fontSize: 18, boxShadow: mode === "leisure" ? "0 0 0 2px #a259e6" : "0 2px 8px 0 #a259e622", cursor: "pointer", outline: "none", width: "100%", letterSpacing: 0.1 }}
            >
              Leisure Mode
            </button>
            <button
              onClick={() => handleModeSelect("collaboration")}
              className={mode === "collaboration" ? "active-mode-btn" : ""}
              style={{ padding: 18, borderRadius: 14, border: "none", background: mode === "collaboration" ? "#23235b" : "#181936", color: mode === "collaboration" ? "#fff" : "#bdbdf7", fontWeight: 400, fontSize: 18, boxShadow: mode === "collaboration" ? "0 0 0 2px #a259e6" : "0 2px 8px 0 #a259e622", cursor: "pointer", outline: "none", width: "100%", letterSpacing: 0.1 }}
            >
              Collaboration Mode
            </button>
          </div>
          <button
            onClick={handleCurate}
            disabled={isCurateDisabled || loading}
            style={{
              width: "100%",
              padding: 18,
              borderRadius: 14,
              border: "none",
              background: !isCurateDisabled && !loading ? "#a259e6" : "#eceafd",
              color: !isCurateDisabled && !loading ? "#fff" : "#7a7a8c",
              fontWeight: 600,
              fontSize: 20,
              cursor: !isCurateDisabled && !loading ? "pointer" : "not-allowed",
              marginTop: 12,
              boxShadow: !isCurateDisabled && !loading ? "0 2px 8px #a259e655" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: isCurateDisabled || loading ? 1 : 1
            }}
          >
            <MdStars style={{ fontSize: 24, opacity: 0.85, color: !isCurateDisabled && !loading ? "#fff" : "#7a7a8c" }} />
            {loading ? "Curating..." : "Curate People"}
          </button>
          {loading && <Spinner />}
        </div>
      </main>
    </div>
  );
};

export default PromptPage; 