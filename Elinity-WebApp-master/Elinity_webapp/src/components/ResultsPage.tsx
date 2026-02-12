import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdFavoriteBorder, MdFavorite, MdRefresh, MdMoreVert, MdPersonAddAlt, MdLightbulb,
  MdOutlineNotificationsNone, MdOutlineSettings
} from "react-icons/md";
import { useProfileMode } from "../ProfileModeContext";
import { useApiClient } from "../services/apiClient";
import Sidebar from "./Sidebar";

const filterChips = ["Location", "Interest", "Availability", "Mutuals", "Availability"];

const mockPeople = [
  { name: "Jessica M.", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "Artist", info: "Loves painting and nature.", score: 88, insight: "Great artistic compatibility." },
  { name: "David K.", avatar: "https://randomuser.me/api/portraits/men/44.jpg", role: "Engineer", info: "Tech enthusiast and hiker.", score: 91, insight: "Shared interest in technology." },
  { name: "Sarah L.", avatar: "https://randomuser.me/api/portraits/women/45.jpg", role: "Writer", info: "Coffee addict and bookworm.", score: 85, insight: "Intellectual connection." },
];

const ResultsPage: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useProfileMode();
  // Get people data from navigation state
  const initialPeople = location.state?.results || [];
  const [people, setPeople] = useState(initialPeople);
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  // Change connected state to track 0 (none), 1 (one-sided), 2 (mutual)
  const [connected, setConnected] = useState<{ [key: number]: number }>({});
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>({});
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [bookmarked, setBookmarked] = useState<{ [key: number]: boolean }>({});
  const [checked, setChecked] = useState<{ [key: number]: boolean }>({});
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  let toastId = 0;
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);

  // Search logic using API
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      setSearchLoading(true);
      setSearchOpen(true);
      setSearchResults([]);
      try {
        const res = await fetchWithAuth(`/search/global?q=${encodeURIComponent(searchValue.trim())}`);
        if (res.ok) {
          const data = await res.json();
          // Combine results
          let combined: any[] = [];
          if (data.events) combined = combined.concat(data.events.map((e: any) => ({ title: e.title, snippet: "Event", url: "#" })));
          if (data.posts) combined = combined.concat(data.posts.map((p: any) => ({ title: "Post", snippet: p.content || "", url: "#" })));
          if (data.journals) combined = combined.concat(data.journals.map((j: any) => ({ title: j.title || "Journal", snippet: "Private Journal", url: "#" })));
          if (data.users) combined = combined.concat(data.users.map((u: any) => ({ title: u.name, snippet: "User", url: "#" })));

          if (combined.length === 0) combined.push({ title: "No results", snippet: "Try another query", url: "#" });

          setSearchResults(combined);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  // Close search results on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      setSearchOpen(false);
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.keys(dropdownRefs.current).forEach((key) => {
        const idx = Number(key);
        if (dropdownRefs.current[idx] && !dropdownRefs.current[idx]?.contains(event.target as Node)) {
          setDropdownOpen((prev) => ({ ...prev, [idx]: false }));
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler for like button
  const handleLike = (idx: number) => {
    setLiked((prev: { [key: number]: boolean }) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Handler for connect button (simulate mutual connection)
  const handleConnect = (idx: number) => {
    setConnected((prev) => {
      const newState = { ...prev };
      if (!newState[idx]) newState[idx] = 1; // First click: request sent
      else if (newState[idx] === 1) newState[idx] = 2; // Second click: mutual
      return newState;
    });
  };

  // Handler for confirming connection
  const handleConfirmConnect = () => {
    if (confirmIdx === null) return;
    setConnected((prev: any) => ({ ...prev, [confirmIdx]: 1 }));
    // Show toast
    const person = people[confirmIdx];
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message: `Connection request sent to ${person.name}!` }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
    setConfirmIdx(null);
    // Navigate to the correct Match Success page based on profile mode
    if (mode === "romantic") navigate("/romantic-match-success");
    else if (mode === "leisure") navigate("/leisure-match-success");
    else if (mode === "collaborative") navigate("/collaborative-match-success");
  };

  // Handler for canceling confirmation
  const handleCancelConnect = () => {
    setConfirmIdx(null);
  };

  // Handler for bookmark button
  const handleBookmark = (idx: number) => {
    setBookmarked((prev: { [key: number]: boolean }) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Handler for check circle button
  const handleCheck = (idx: number) => {
    setChecked((prev: { [key: number]: boolean }) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Handler for refresh button
  const handleRefresh = (idx: number) => {
    // Pick a random mock profile (different from current)
    let newProfile;
    do {
      newProfile = mockPeople[Math.floor(Math.random() * mockPeople.length)];
    } while (newProfile.name === people[idx].name && mockPeople.length > 1);
    setPeople((prev: typeof people) => prev.map((p: typeof people[number], i: number) => (i === idx ? newProfile : p)));
  };

  // Handler for see more button
  const handleSeeMore = () => {
    setPeople((prev: typeof people) => [...prev, ...mockPeople]);
  };

  const handleMoreClick = (idx: number) => {
    setDropdownOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleViewProfile = (idx: number) => {
    setDropdownOpen((prev) => ({ ...prev, [idx]: false }));
    navigate("/profile", { state: { person: people[idx] } });
  };

  // useEffect to watch for mutual connection and navigate
  React.useEffect(() => {
    Object.entries(connected).forEach(([idx, state]) => {
      if (state === 2) {
        // Navigate to the correct Match Success page based on profile mode
        if (mode === "romantic") navigate("/romantic-match-success");
        else if (mode === "leisure") navigate("/leisure-match-success");
        else if (mode === "collaborative") navigate("/collaborative-match-success");
      }
    });
    // eslint-disable-next-line
  }, [connected]);

  return (
    <div className="home-root" style={{ minHeight: "100vh" }}>
      {/* Toasts */}
      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 3000, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ background: '#23235b', color: '#fff', border: '1.5px solid #a259e6', borderRadius: 10, padding: '14px 28px', fontWeight: 500, fontSize: 16, boxShadow: '0 2px 8px #a259e655', minWidth: 220, textAlign: 'center', opacity: 0.97 }}>
            {toast.message}
          </div>
        ))}
      </div>
      {/* Confirmation Modal */}
      {confirmIdx !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,25,54,0.55)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23235b', border: '2px solid #a259e6', borderRadius: 16, padding: '36px 40px', minWidth: 320, boxShadow: '0 8px 32px #a259e655', color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 18 }}>
              Are you sure you want to send a connection request to <span style={{ color: '#a259e6', fontWeight: 600 }}>{people[confirmIdx].name}</span>?
            </div>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 18 }}>
              <button onClick={handleConfirmConnect} style={{ background: '#a259e6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #a259e655' }}>Yes</button>
              <button onClick={handleCancelConnect} style={{ background: 'none', color: '#fff', border: '1.5px solid #a259e6', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <Sidebar />
      {/* Main Content */}
      <main className="main-content" style={{ width: "100%", minHeight: "100vh", padding: "0 48px 0 72px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        {/* Topbar */}
        <div className="topbar" style={{ marginBottom: 32, padding: "0 24px", width: "100%", position: 'relative' }}>
          <div className="topbar-center" style={{ position: 'relative' }}>
            <input
              className="search-bar"
              placeholder="Search"
              style={{ width: 320, maxWidth: "100%" }}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
            />
            {searchOpen && (
              <div style={{ position: 'absolute', top: 44, left: 0, width: 320, background: '#23235b', border: '1px solid #a259e6', borderRadius: 8, boxShadow: '0 2px 8px #0003', zIndex: 2000, maxHeight: 320, overflowY: 'auto', color: '#fff' }}>
                {searchLoading ? (
                  <div style={{ padding: 16, color: '#a259e6' }}>Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: 16, color: '#bdbdf7' }}>No results found.</div>
                ) : (
                  searchResults.map((result, idx) => (
                    <a key={idx} href={result.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: 12, color: '#fff', textDecoration: 'none', borderBottom: '1px solid #333' }}>
                      <div style={{ fontWeight: 500 }}>{result.title}</div>
                      <div style={{ fontSize: 13, color: '#bdbdf7', marginTop: 2 }}>{result.snippet}</div>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="topbar-actions" style={{ alignItems: "center", display: "flex", gap: 20 }}>
            <button className="topbar-icon"><MdOutlineNotificationsNone /></button>
            <button className="topbar-icon"><MdOutlineSettings /></button>
            <div className="topbar-avatar">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
            </div>
          </div>
        </div>
        {/* Filters */}
        <h2 style={{ color: "#fff", fontWeight: 400, marginBottom: 18, fontSize: 24 }}>Find people you like based on ..</h2>
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {filterChips.map((chip, idx) => (
            <button key={idx} style={{
              background: "rgba(236,234,253,0.12)",
              color: "#eceafd",
              border: "none",
              borderRadius: 16,
              padding: "8px 22px",
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer"
            }}>{chip}</button>
          ))}
        </div>
        {/* People Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(340px, 1fr))", gap: 36, marginBottom: 32, width: "100%", alignItems: "stretch" }}>
          {people.map((person: any, idx: number) => (
            <div key={idx} style={{ background: "rgba(236,234,253,0.13)", borderRadius: 22, boxShadow: "0 8px 32px 0 #a259e655, 0 1.5px 8px 0 #fff1 inset", padding: 32, color: "#fff", display: "flex", flexDirection: "column", gap: 18, position: "relative", backdropFilter: "blur(12px)", border: "2px solid rgba(162, 89, 230, 0.10)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 8 }}>
                <img src={person.avatar} alt={person.name} style={{ width: 54, height: 54, borderRadius: "50%", border: "2px solid #a259e6" }} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 18, color: '#fff' }}>{person.name}</div>
                  <div style={{ color: "#bdbdf7", fontWeight: 400, fontSize: 14 }}>{person.role || ""}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10, position: 'relative' }}>
                  <button onClick={() => handleRefresh(idx)} style={{ background: "none", border: "none", color: "#eceafd", fontSize: 22, cursor: "pointer", transition: 'color 0.2s', outline: 'none' }}><MdRefresh /></button>
                  <button onClick={() => handleLike(idx)} style={{ background: "none", border: "none", color: liked[idx] ? "#ff4b6b" : "#eceafd", fontSize: 22, cursor: "pointer", transition: 'color 0.2s', outline: 'none' }}>{liked[idx] ? <MdFavorite /> : <MdFavoriteBorder />}</button>
                  <button onClick={() => handleMoreClick(idx)} style={{ background: "none", border: "none", color: "#eceafd", fontSize: 22, cursor: "pointer", outline: 'none', transition: 'color 0.2s' }}><MdMoreVert /></button>
                  {dropdownOpen[idx] && (
                    <div ref={el => { dropdownRefs.current[idx] = el; }} style={{ position: 'absolute', top: 36, right: 0, background: '#23235b', border: '1px solid #a259e6', borderRadius: 8, boxShadow: '0 2px 8px #0003', zIndex: 1000, minWidth: 120 }}>
                      <button style={{ width: '100%', padding: 10, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', borderRadius: 8 }} onClick={() => handleViewProfile(idx)}>
                        View Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 14, color: "#eceafd", marginBottom: 2, fontWeight: 400 }}>
                <b style={{ fontWeight: 500, color: '#fff' }}>Brief Info:</b> {person.info || "Passionate about psychology, and experiences. Loves hiking and reading sci-fi novels."}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#eceafd", fontSize: 14, marginBottom: 2, fontWeight: 400 }}>
                <MdLightbulb style={{ color: "#ffe066", fontSize: 18 }} />
                <b style={{ fontWeight: 500, color: '#fff' }}>AI Insight:</b>
              </div>
              <div style={{ color: "#eceafd", fontSize: 13, marginBottom: 10, fontWeight: 400 }}>
                "{person.insight || `Emma was suggested because of your shared interest in behavioral psychology, and creative problem-solving.`}"
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <div style={{ color: "#eceafd", fontWeight: 400, fontSize: 13 }}>Compatibility Score</div>
                <div style={{ flex: 1, height: 6, background: "#eceafd33", borderRadius: 4, margin: "0 8px" }}>
                  <div style={{ width: `${person.score || 92}%`, height: "100%", background: "linear-gradient(90deg, #a259e6 60%, #3a6cf6 100%)", borderRadius: 4 }} />
                </div>
                <div style={{ color: "#eceafd", fontWeight: 500, fontSize: 13 }}>{person.score || 92}%</div>
              </div>
              <button
                onClick={() => handleConnect(idx)}
                disabled={connected[idx] === 2}
                style={{
                  marginTop: 16,
                  alignSelf: "flex-end",
                  background: connected[idx] === 2 ? "#a259e6" : connected[idx] === 1 ? "#eceafd33" : "rgba(236,234,253,0.10)",
                  color: connected[idx] === 2 ? "#fff" : connected[idx] === 1 ? "#7a7a8c" : "#eceafd",
                  border: "1.5px solid #eceafd",
                  borderRadius: 8,
                  padding: "7px 20px",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: connected[idx] === 2 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: 'none',
                  opacity: connected[idx] === 2 ? 1 : connected[idx] === 1 ? 0.7 : 1
                }}
              >
                <MdPersonAddAlt style={{ fontSize: 18 }} />
                {connected[idx] === 2 ? "Mutual Connection!" : connected[idx] === 1 ? "Request Sent" : "Connect"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginTop: 12 }}>
          <button onClick={handleSeeMore} style={{ background: "#eceafd", color: "#23235b", border: "none", borderRadius: 8, padding: "7px 18px", fontWeight: 500, fontSize: 14, cursor: "pointer", boxShadow: 'none' }}>See more</button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage; 
