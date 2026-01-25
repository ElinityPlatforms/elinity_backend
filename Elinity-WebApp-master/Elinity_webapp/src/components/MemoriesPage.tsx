import React, { useState } from 'react';
import { MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdLogout, MdOutlineNotificationsNone, MdOutlineSettings } from 'react-icons/md';
import { FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../HomePage.css';
import './MemoriesPage.css';

import { useApiClient } from "../services/apiClient";

const MemoriesPage: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const navigate = useNavigate();
  const [activeSidebar, setActiveSidebar] = useState('favorite');
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const res = await fetchWithAuth('/social-feed/');
        if (res.ok) {
          const data = await res.json();
          // Filter for posts with media or meaningful content
          const withMedia = data.filter((post: any) => post.media_urls && post.media_urls.length > 0);
          setMemories(withMedia);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMemories();
  }, [fetchWithAuth]);

  return (
    <div className="memories-page-container">
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group main-icons">
            <button className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`} aria-label="Home" onClick={() => { setActiveSidebar("home"); navigate("/"); }}>
              <MdHome />
              {activeSidebar === "home" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`} aria-label="Favorites" onClick={() => { setActiveSidebar("favorite"); navigate("/your-matches"); }}>
              <MdFavorite />
              {activeSidebar === "favorite" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`} aria-label="Prompt" onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}>
              <MdAssignment />
              {activeSidebar === "prompt" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} aria-label="Search" onClick={() => setActiveSidebar("search")}>
              <MdSearch />
              {activeSidebar === "search" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "message" ? " active" : ""}`} aria-label="Messages" onClick={() => { setActiveSidebar("message"); navigate("/chat"); }}>
              <MdMessage />
              {activeSidebar === "message" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "games" ? " active" : ""}`} aria-label="Games" onClick={() => { setActiveSidebar("games"); navigate("/games"); }}>
              <FaGamepad />
              {activeSidebar === "games" && <span className="sidebar-active-bar" />}
            </button>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-group secondary-icons">
            <button className={`sidebar-icon${activeSidebar === "notifications" ? " active" : ""}`} aria-label="Notifications" onClick={() => setActiveSidebar("notifications")}>
              <MdOutlineNotificationsNone />
              {activeSidebar === "notifications" && <span className="sidebar-active-bar" />}
            </button>
            <button className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`} aria-label="Settings" onClick={() => setActiveSidebar("settings")}>
              <MdOutlineSettings />
              {activeSidebar === "settings" && <span className="sidebar-active-bar" />}
            </button>
          </div>
        </nav>
        <div className="sidebar-logout">
          <button className="sidebar-icon red" aria-label="Logout">
            <MdLogout />
          </button>
        </div>
      </aside>

      <main className="memories-content">
        <div className="memories-header">
          <div className="search-bar">
            <span className="search-icon"><MdSearch /></span>
            <input type="text" placeholder="Search" />
          </div>
          <div className="header-actions">
            <button className="icon-button"><MdOutlineNotificationsNone /></button>
            <button className="icon-button"><MdOutlineSettings /></button>
            <div className="user-avatar">
              <img src="https://i.pravatar.cc/150?img=68" alt="User" />
            </div>
          </div>
        </div>

        <div className="mood-filters">
          <h3>Find according to you mood ...</h3>
          <div className="filter-buttons">
            <button className="active">All</button>
            <button>Trips</button>
            <button>Birthday</button>
            <button>Anniversaries</button>
          </div>
        </div>

        <section className="memories-section">
          <h2>All Memories</h2>
          {loading ? (
            <p>Loading memories...</p>
          ) : memories.length === 0 ? (
            <p>No memories found. Upload posts with photos to see them here!</p>
          ) : (
            <div className="memories-grid">
              {memories.map((mem) => (
                <div key={mem.id} className="memory-card">
                  <div className="memory-card-header">
                    <h4>Memory</h4>
                    <p>{new Date(mem.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="memory-card-images">
                    {mem.media_urls.slice(0, 3).map((url: string, i: number) => (
                      <img key={i} src={url} alt={`Memory ${i}`} />
                    ))}
                  </div>
                  <p className="memory-card-description">{mem.content || "No caption"}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MemoriesPage;