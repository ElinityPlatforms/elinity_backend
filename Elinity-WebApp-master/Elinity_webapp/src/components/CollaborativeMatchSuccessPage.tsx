import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdInfo, MdDelete, MdLogout, MdAccessTime, MdOutlineNotificationsNone, MdOutlineSettings, MdChevronLeft, MdPerson, MdGroupWork } from "react-icons/md";
import { FaMapMarkerAlt, FaBriefcase, FaHandshake } from "react-icons/fa";
import "../App.css";

const CollaborativeMatchSuccessPage: React.FC = () => {
  // Placeholder user data for collaborative profile
  const user1 = {
    name: "Emma Williams",
    age: 31,
    gender: "F",
    location: "Berlin, Germany",
    description: "UX Designer, Startup Mentor",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80",
    profession: "UX Designer, Startup Mentor",
  };
  const user2 = {
    name: "Lucas Brown",
    age: 34,
    gender: "M",
    location: "Amsterdam, NL",
    description: "Product Manager & Hackathon Winner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80",
    profession: "Product Manager & Hackathon Winner",
  };
  const [activeSidebar, setActiveSidebar] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showYourMatchesLabel, setShowYourMatchesLabel] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="home-root">
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
            <button className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`} aria-label="Prompt" onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}>
              <MdAssignment />
              {activeSidebar === "prompt" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} aria-label="Search" onClick={() => setActiveSidebar("search") }>
              <MdSearch />
              {activeSidebar === "search" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "message" ? " active" : ""}`} aria-label="Messages" onClick={() => setActiveSidebar("message") }>
              <MdMessage />
              {activeSidebar === "message" && <span className="sidebar-active-bar" />}
            </button>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-group secondary-icons">
            <button className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`} aria-label="Settings" onClick={() => setActiveSidebar("settings") }>
              <MdSettings />
              {activeSidebar === "settings" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "clock" ? " active" : ""}`} aria-label="Clock" onClick={() => setActiveSidebar("clock") }>
              <MdAccessTime />
              {activeSidebar === "clock" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "info" ? " active" : ""}`} aria-label="Info" onClick={() => setActiveSidebar("info") }>
              <MdInfo />
              {activeSidebar === "info" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "trash" ? " active" : ""}`} aria-label="Trash" onClick={() => setActiveSidebar("trash") }>
              <MdDelete />
              {activeSidebar === "trash" && <span className="sidebar-active-bar" />}
            </button>
          </div>
        </nav>
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
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>View Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Collaborative Match Success Content */}
        <div className="content-wrapper">
          <div className="match-success-bg match-success-main">
            <div className="match-success-bgcard">
              <div className="match-success-chip-float-wrapper">
                <span className="match-success-chip">
                  <span className="chip-arrow"><MdChevronLeft /></span>
                  Collaborative Matchup
                  <span className="chip-icon-glass"><FaHandshake /></span>
                </span>
              </div>
              <h2 className="match-success-title">Collaboration Success!</h2>
              <div className="match-success-cards-row">
                {/* User 1 Card */}
                <div className="match-success-user-card modern-card">
                  <div className="modern-card-img-wrapper">
                    <img src={user1.image} alt={user1.name} className="match-success-user-img modern-card-img" />
                    <div className="modern-card-info-overlay">
                      <div className="match-success-user-name">{user1.name}</div>
                      <div className="match-success-user-age-gender">{user1.age} {user1.gender}</div>
                      <div className="match-success-user-location"><FaMapMarkerAlt className="icon-detail" /> {user1.location}</div>
                      <div className="match-success-user-desc"><FaBriefcase className="icon-detail" /> {user1.profession}</div>
                    </div>
                  </div>
                </div>
                {/* Handshake Icon replaced with circle image */}
                <div className="match-success-heart-wrapper">
                  <img src="/Circle.png" alt="Circle" className="match-success-heart-img" />
                </div>
                {/* User 2 Card */}
                <div className="match-success-user-card modern-card">
                  <div className="modern-card-img-wrapper">
                    <img src={user2.image} alt={user2.name} className="match-success-user-img modern-card-img" />
                    <div className="modern-card-info-overlay">
                      <div className="match-success-user-name">{user2.name}</div>
                      <div className="match-success-user-age-gender">{user2.age} {user2.gender}</div>
                      <div className="match-success-user-location"><FaMapMarkerAlt className="icon-detail" /> {user2.location}</div>
                      <div className="match-success-user-desc"><FaBriefcase className="icon-detail" /> {user2.profession}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="match-success-actions">
                <button className="match-success-btn match-success-btn-primary glassy-btn" onClick={() => alert('Message sent!')}>
                  <span className="btn-icon" role="img" aria-label="chat">💬</span> Send a Message
                </button>
                <button className="match-success-btn match-success-btn-secondary glassy-btn" onClick={() => alert('Viewing profile!')}>
                  <span className="btn-icon" role="img" aria-label="profile"><MdPerson /></span> View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaborativeMatchSuccessPage;