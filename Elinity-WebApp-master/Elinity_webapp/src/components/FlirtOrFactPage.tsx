import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdAccessTime, MdInfo, MdDelete, MdLogout, MdOutlineNotificationsNone, MdOutlineSettings
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import '../HomePage.css';

export default function FlirtOrFactPage() {
  const [activeSidebar, setActiveSidebar] = useState("games");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="home-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group main-icons">
            <button className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`} aria-label="Home" onClick={() => { setActiveSidebar("home"); navigate("/"); }}><MdHome />{activeSidebar === "home" && <span className="sidebar-active-bar" />}</button>
            <button className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`} aria-label="Favorites" onClick={() => { setActiveSidebar("favorite"); navigate("/your-matches"); }}><MdFavorite />{activeSidebar === "favorite" && <span className="sidebar-active-bar" />}</button>
            <button className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`} aria-label="Prompt" onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}><MdAssignment />{activeSidebar === "prompt" && <span className="sidebar-active-bar" />}</button>
            <button className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} aria-label="Search" onClick={() => setActiveSidebar("search") }><MdSearch />{activeSidebar === "search" && <span className="sidebar-active-bar" />}</button>
            <button className={`sidebar-icon${location.pathname === "/chat" ? " active" : ""}`} aria-label="Messages" onClick={() => { setActiveSidebar("message"); navigate("/chat"); }}><MdMessage />{activeSidebar === "message" && <span className="sidebar-active-bar" />}</button>
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
        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 28, marginBottom: 32 }}>Flirt Or Fact</h2>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
          {/* Left Card */}
          <div style={{
            background: 'rgba(61, 56, 112, 0.22)',
            borderRadius: 24,
            boxShadow: '0 8px 32px 0 #a259e655',
            padding: '32px 32px 24px 32px',
            minWidth: 340,
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 420,
          }}>
            <img src="https://openmoji.org/data/color/png/256/1F91D.png" alt="Flirt or Fact" style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: 24, objectFit: 'cover', background: '#fff' }} />
            <div style={{ fontWeight: 600, color: '#fff', fontSize: 16, marginBottom: 12, alignSelf: 'flex-start' }}>Instruction</div>
            <div style={{ color: '#bdbdf7', fontSize: 15, marginBottom: 8, alignSelf: 'flex-start' }}>🎮 Game : Flirt</div>
            <div style={{ color: '#bdbdf7', fontSize: 15, marginBottom: 32, alignSelf: 'flex-start' }}>👥 Number of Players : 2 ( You and your match )</div>
            <button style={{ marginTop: 'auto', background: '#fff', color: '#23235b', border: 'none', borderRadius: 8, padding: '10px 36px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #a259e622' }} onClick={() => { /* Start game logic here */ }}>Start</button>
          </div>
          {/* Right Card */}
          <div style={{
            background: 'rgba(61, 56, 112, 0.22)',
            borderRadius: 24,
            boxShadow: '0 8px 32px 0 #a259e655',
            padding: '32px 32px 24px 32px',
            minWidth: 340,
            maxWidth: 480,
            minHeight: 420,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>📝 Rules</div>
            <ol style={{ color: '#fff', fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
              <li>You and your match each write 3 statements:
                <ul style={{ color: '#bdbdf7', fontSize: 14, marginTop: 4, marginBottom: 4 }}>
                  <li>a) One true fact about yourself</li>
                  <li>b) One flirty compliment</li>
                  <li>c) One nonsense (something random or silly)</li>
                </ul>
              </li>
              <li>You take turns guessing which one is which</li>
              <li>No repeating the same line twice.</li>
              <li>Keep it fun, respectful, and light-hearted!</li>
            </ol>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 18 }}>💡 How to play?</div>
            <ul style={{ color: '#bdbdf7', fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
              <li>Write your 3 lines.</li>
              <li>Send them to your match.</li>
              <li>They guess the fact, flirt, and nonsense.</li>
              <li>Then swap!</li>
            </ul>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 18 }}>✨ Role of AI</div>
            <ul style={{ color: '#bdbdf7', fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
              <li>Stuck? AI can help you write fun flirts or silly lines.</li>
              <li>It can also give feedback or remix your ideas.</li>
            </ul>
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 18 }}>🌟 What can you learn</div>
            <ul style={{ color: '#bdbdf7', fontSize: 15, marginLeft: 18, marginBottom: 0 }}>
              <li>Their charm, creativity, and banter style.</li>
              <li>Whether they’re smooth, chaotic, or wildly unpredictable</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}