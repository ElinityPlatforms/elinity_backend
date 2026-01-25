import React, { useState } from 'react';
import {
  MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdAccessTime, MdInfo, MdDelete, MdLogout, MdOutlineNotificationsNone, MdOutlineSettings, MdBook, MdChatBubbleOutline, MdPsychology, MdSentimentSatisfiedAlt, MdSentimentNeutral, MdPlayCircleOutline, MdDownloadForOffline, MdKeyboardVoice
} from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import '../HomePage.css';
import { useApiClient } from "../services/apiClient";

export default function JournalPage() {
  const fetchWithAuth = useApiClient();
  const [activeSidebar, setActiveSidebar] = useState("journal");
  const [showDropdown, setShowDropdown] = useState(false);
  const [tab, setTab] = useState('write');
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadJournals = async () => {
      try {
        const res = await fetchWithAuth('/journal/');
        if (res.ok) {
          const data = await res.json();
          setJournals(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJournals();
  }, [fetchWithAuth]);

  const handlePost = async () => {
    if (!message.trim()) return;
    try {
      const res = await fetchWithAuth('/journal/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Entry', content: message }),
      });
      if (res.ok) {
        const newJ = await res.json();
        setJournals([newJ, ...journals]);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showFavoriteLabel, setShowFavoriteLabel] = useState(false);
  const [showPromptLabel, setShowPromptLabel] = useState(false);
  const [showSearchLabel, setShowSearchLabel] = useState(false);
  const [showMessageLabel, setShowMessageLabel] = useState(false);
  const [showGamesLabel, setShowGamesLabel] = useState(false);
  const [showJournalLabel, setShowJournalLabel] = useState(false);

  return (
    <div className="home-root" style={{ minHeight: '100vh', height: '100%', background: 'linear-gradient(180deg, #23235b 0%, #3a6cf6 100%)' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/describe-elinity-personality')} style={{ cursor: 'pointer' }}>
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
        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 26, marginBottom: 18 }}>AI Journal <span role="img" aria-label="journal">📝</span></h2>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
          <button onClick={() => navigate('/memories')} style={{ background: 'none', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Memories</button>
          <button onClick={() => setTab('write')} style={{ background: tab === 'write' ? 'rgba(162,89,230,0.18)' : 'none', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Write</button>
          <button onClick={() => navigate('/archive')} style={{ background: 'none', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Archive</button>
          <button onClick={() => setTab('tags')} style={{ background: tab === 'tags' ? 'rgba(162,89,230,0.18)' : 'none', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Tags</button>
        </div>
        {/* Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: 'minmax(220px,1fr) minmax(220px,1fr) minmax(220px,1fr)',
            gap: 8,
            marginBottom: 18,
            minHeight: 'calc(100vh - 120px)',
            height: 'auto',
            alignItems: 'stretch',
          }}
        >
          {/* Write Card spanning first two rows, first column */}
          <div style={{ gridColumn: '1/2', gridRow: '1/3', background: 'rgba(61, 56, 112, 0.22)', borderRadius: 24, boxShadow: '0 4px 32px 0 #3a6cf655', border: '1.5px solid #3a6cf6aa', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(16px)', height: '100%', minHeight: 0, minWidth: 0 }}>
            {/* Orb and Write Card Content */}
            <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 60% 40%, #fffbe6 0%, #ffb347 30%, #3a6cf6 60%, #23235b 100%)',
                boxShadow: '0 0 96px 48px #3a6cf633, 0 0 192px 96px #ffb34722',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                position: 'relative',
                overflow: 'visible',
              }}>
                {/* Starburst/Energy effect */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(58,108,246,0.06) 60%, rgba(255,179,71,0.04) 100%)',
                  filter: 'blur(32px)',
                  zIndex: 0,
                }} />
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #fffbe6 0%, #ffb347 30%, #3a6cf6 60%, #23235b 100%)',
                  boxShadow: '0 0 32px 16px #fffbe6aa, 0 0 64px 32px #3a6cf6aa',
                  filter: 'blur(2px)',
                  zIndex: 1,
                }} />
              </div>
              <div style={{ color: '#fff', fontWeight: 400, fontSize: 13, marginBottom: 4, lineHeight: 1.1 }}>Hi, what's on your mind today ?</div>
              <div style={{ color: '#bdbdf7', fontSize: 12, marginBottom: 4, textAlign: 'center', maxWidth: 320, lineHeight: 1.2 }}>
                Probably staring the stars. Imagine just sitting down and playing a beautiful piece effortlessly. What about you?
              </div>
              <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <button style={{
                  background: 'linear-gradient(135deg, #a259e6 60%, #3a6cf6 100%)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 16px #a259e655, 0 1.5px 0 #fff3 inset',
                  cursor: 'pointer',
                  position: 'relative',
                  outline: 'none',
                  padding: 0,
                }}>
                  <MdKeyboardVoice style={{ fontSize: 32, color: '#fff', filter: 'drop-shadow(0 0 6px #a259e6)' }} />
                </button>
                <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="0,12 5,10 10,14 15,8 20,16 25,6 30,18 35,8 40,16 45,10 50,14 55,12 60,12" stroke="#a259e6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#bdbdf7', fontSize: 16, marginRight: 4 }}><MdSearch /></span>
                <input
                  style={{ flex: 1, borderRadius: 10, border: '1.5px solid #3a6cf6', padding: '8px 10px', fontSize: 12, background: 'rgba(255,255,255,0.14)', color: '#fff', boxShadow: '0 2px 8px #3a6cf622', backdropFilter: 'blur(8px)' }}
                  placeholder="Type here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handlePost(); }}
                />
                <button
                  onClick={handlePost}
                  style={{ background: 'linear-gradient(90deg,#a259e6,#3a6cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 500, fontSize: 12, cursor: 'pointer', boxShadow: '0 2px 6px #3a6cf622, 0 1px 0 #fff2 inset' }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
          {/* AI Journal Card spanning columns 2 and 3 in row 1 */}
          <div style={{ gridColumn: '2/4', gridRow: '1/2', background: 'rgba(61, 56, 112, 0.22)', borderRadius: 24, boxShadow: '0 4px 32px 0 #3a6cf655', border: '1.5px solid #3a6cf6aa', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, backdropFilter: 'blur(16px)', height: '100%', minHeight: 0, minWidth: 0 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 500, fontSize: 12, marginBottom: 4, lineHeight: 1.1 }}>AI Journal <span style={{ fontSize: 11, color: '#bdbdf7', fontWeight: 400 }}>| Today's Prompt</span></div>
              <div style={{ color: '#bdbdf7', fontSize: 12, marginBottom: 4 }}>What's one small win you experienced today?</div>
            </div>
            <button style={{ background: 'linear-gradient(90deg,#a259e6,#3a6cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 500, fontSize: 12, cursor: 'pointer', boxShadow: '0 2px 6px #3a6cf622, 0 1px 0 #fff2 inset', alignSelf: 'flex-end', marginTop: 'auto' }}>Start Writing</button>
          </div>
          {/* Recent Entries Card spanning columns 2 and 3 in row 2 */}
          <div style={{ gridColumn: '2/4', gridRow: '2/3', background: 'rgba(61, 56, 112, 0.22)', borderRadius: 24, boxShadow: '0 4px 32px 0 #3a6cf655', border: '1.5px solid #3a6cf6aa', padding: 24, display: 'flex', flexDirection: 'column', gap: 6, backdropFilter: 'blur(16px)', height: '100%', minHeight: 0, minWidth: 0, overflowY: 'auto' }}>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: 12, marginBottom: 4, lineHeight: 1.1 }}>Recent Entries</div>
            {loading ? (
              <div style={{ color: '#ccc', fontSize: 12 }}>Loading...</div>
            ) : journals.length === 0 ? (
              <div style={{ color: '#ccc', fontSize: 12 }}>No entries yet.</div>
            ) : (
              journals.map((journal) => (
                <div key={journal.id} style={{ color: '#ffd700', fontSize: 13, marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, marginRight: 3 }}>📝</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>{journal.content || journal.title}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ color: '#fff', fontWeight: 400, fontSize: 10 }}>{new Date(journal.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
          {/* Progress Card (row 3, col 1) */}
          <div style={{ gridColumn: '1/2', gridRow: '3/4', background: 'rgba(61, 56, 112, 0.22)', borderRadius: 24, boxShadow: '0 4px 32px 0 #3a6cf655', border: '1.5px solid #3a6cf6aa', padding: 24, display: 'flex', flexDirection: 'column', gap: 6, backdropFilter: 'blur(16px)', height: '100%', minHeight: 0, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: 11, marginBottom: 4, lineHeight: 1.1 }}>📈 Overall your entries show increased optimism this week.</div>
            <div style={{ color: '#bdbdf7', fontSize: 11, marginBottom: 4 }}>Optimism</div>
            <div style={{ background: 'rgba(162,89,230,0.18)', borderRadius: 8, height: 2, width: '100%', marginBottom: 4, boxShadow: '0 0 2px #a259e6aa' }}>
              <div style={{ background: 'linear-gradient(90deg,#a259e6,#3a6cf6)', borderRadius: 8, height: 2, width: '92%', boxShadow: '0 0 2px #3a6cf6aa' }}></div>
            </div>
            <div style={{ color: '#bdbdf7', fontSize: 11, marginBottom: 4 }}>Productivity</div>
            <div style={{ background: 'rgba(162,89,230,0.18)', borderRadius: 8, height: 2, width: '100%', marginBottom: 4, boxShadow: '0 0 2px #a259e6aa' }}>
              <div style={{ background: 'linear-gradient(90deg,#a259e6,#3a6cf6)', borderRadius: 8, height: 2, width: '62%', boxShadow: '0 0 2px #3a6cf6aa' }}></div>
            </div>
            <button style={{ background: 'linear-gradient(90deg,#a259e6,#3a6cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 500, fontSize: 11, cursor: 'pointer', boxShadow: '0 2px 6px #3a6cf622, 0 1px 0 #fff2 inset', alignSelf: 'flex-end' }}>View Details</button>
          </div>
          {/* Meditation Card (row 3, col 2) */}
          <div style={{ gridColumn: '2/3', gridRow: '3/4', background: 'rgba(61, 56, 112, 0.22)', borderRadius: 24, boxShadow: '0 4px 32px 0 #3a6cf655', border: '1.5px solid #3a6cf6aa', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, backdropFilter: 'blur(16px)', height: '100%', minHeight: 0, minWidth: 0 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="22" width="6" height="10" rx="3" fill="url(#medBar1)" />
              <rect x="18" y="12" width="6" height="20" rx="3" fill="url(#medBar2)" />
              <rect x="28" y="18" width="6" height="14" rx="3" fill="url(#medBar3)" />
              <defs>
                <linearGradient id="medBar1" x1="11" y1="22" x2="11" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#a259e6" />
                  <stop offset="1" stop-color="#3a6cf6" />
                </linearGradient>
                <linearGradient id="medBar2" x1="21" y1="12" x2="21" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#a259e6" />
                  <stop offset="1" stop-color="#3a6cf6" />
                </linearGradient>
                <linearGradient id="medBar3" x1="31" y1="18" x2="31" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#a259e6" />
                  <stop offset="1" stop-color="#3a6cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ color: '#fff', fontWeight: 300, fontSize: 11, marginBottom: 2, lineHeight: 1.1 }}>Meditation</div>
            <div style={{ color: '#bdbdf7', fontSize: 10, textAlign: 'center' }}>Guided mindfulness and self-awareness.</div>
          </div>
          {/* Resources Card (row 3, col 3) */}
          <div style={{ gridColumn: '3/4', gridRow: '3/4', background: 'rgba(61, 56, 112, 0.22)', borderRadius: 24, boxShadow: '0 4px 32px 0 #3a6cf655', border: '1.5px solid #3a6cf6aa', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, backdropFilter: 'blur(16px)', height: '100%', minHeight: 0, minWidth: 0 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 30 Q 14 10, 20 20 Q 26 30, 34 10" stroke="url(#resWave)" stroke-width="3" stroke-linecap="round" fill="none" />
              <defs>
                <linearGradient id="resWave" x1="6" y1="10" x2="34" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#a259e6" />
                  <stop offset="1" stop-color="#3a6cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ color: '#fff', fontWeight: 300, fontSize: 11, marginBottom: 2, lineHeight: 1.1 }}>Resources</div>
            <div style={{ color: '#bdbdf7', fontSize: 10, textAlign: 'center' }}>Goal setting and motivation.</div>
          </div>
        </div>
        {/* New Section: AI Journal, Meta Notes, Emotions, Tags, Add to Dashboard */}
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', marginBottom: 18 }}>
          {/* Row 1: Transcript (AI Journal) and Meta Notes (AI Generated Summary) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div className="card card--figma">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <MdChatBubbleOutline style={{ fontSize: 28, color: '#fff' }} />
                <span className="card--figma-header">Transcript</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#a259e6' }}>AI Journal</span>
              </div>
              <div className="card--figma-subtext">
                I woke up feeling refreshed today. The new morning routine is really working well for me: managed to do a 10-minute meditation and some light stretching before checking my phone. Work projects are moving forward, though I'm a bit concerned about the timeline for the Henderson project. Need to discuss this with the team tomorrow. Overall, I'm feeling optimistic about the week ahead.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, width: '100%' }}>
                <button
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: 36, cursor: 'pointer', padding: 0, boxShadow: '0 2px 8px #3a6cf655', outline: 'none' }}
                  title="Play Audio"
                  onClick={() => alert('Playing audio...')}
                  onMouseDown={e => e.preventDefault()}
                >
                  <MdPlayCircleOutline />
                </button>
                <button
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', padding: 0, boxShadow: '0 2px 8px #3a6cf655', outline: 'none' }}
                  title="Download"
                  onClick={() => alert('Downloading transcript...')}
                  onMouseDown={e => e.preventDefault()}
                >
                  <MdDownloadForOffline />
                </button>
              </div>
            </div>
            <div className="card card--figma card--figma-active">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <MdPsychology style={{ fontSize: 28, color: '#fff' }} />
                <span className="card--figma-header">Meta Notes</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#a259e6' }}>AI Generated Summary</span>
              </div>
              <div className="card--figma-subtext">
                Morning reflection focusing on positive effects of a new routine, including meditation and reduced screen time. Work concerns noted about the Henderson project timeline.
              </div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginTop: 6 }}>Overall mood: <span style={{ color: '#a259e6', fontWeight: 700 }}>optimistic</span>.</div>
            </div>
          </div>
          {/* Row 2: Emotions and Smart Tags */}
          <div className="card--figma-row">
            <div className="card card--figma">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <MdSentimentSatisfiedAlt style={{ fontSize: 32, color: '#fff' }} />
                <span className="card--figma-header" style={{ fontSize: 17 }}>Primary Emotion</span>
              </div>
              <div style={{ color: '#a259e6', fontWeight: 700, fontSize: 15 }}>Optimism <span style={{ color: '#bdbdf7', fontWeight: 500, fontSize: 14 }}>(65%)</span></div>
            </div>
            <div className="card card--figma">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <MdSentimentNeutral style={{ fontSize: 32, color: '#fff' }} />
                <span className="card--figma-header" style={{ fontSize: 17 }}>Secondary</span>
              </div>
              <div style={{ color: '#a259e6', fontWeight: 700, fontSize: 15 }}>Mild concern <span style={{ color: '#bdbdf7', fontWeight: 500, fontSize: 14 }}>(65%)</span></div>
            </div>
            <div className="card card--figma">
              <span className="card--figma-header" style={{ fontSize: 16, marginRight: 8 }}>Smart Tags</span>
              <span className="card--figma-tag">Morning Routine <span className="tag-x">×</span></span>
              <span className="card--figma-tag">Meditation <span className="tag-x">×</span></span>
              <button className="card--figma-tag" style={{ background: 'rgba(162,89,230,0.18)', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 500, fontSize: 14, cursor: 'pointer', marginLeft: 0, padding: '6px 18px' }}>Add Tag</button>
            </div>
          </div>
          {/* Row 3: Add to Dashboard Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <button style={{ background: 'linear-gradient(90deg,#a259e6,#3a6cf6)', color: '#fff', border: 'none', borderRadius: 18, padding: '12px 44px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 12px #3a6cf622, 0 1px 0 #fff2 inset', marginTop: 8 }}>Add to Dashboard</button>
          </div>
        </div>

      </main>
    </div>
  );
}