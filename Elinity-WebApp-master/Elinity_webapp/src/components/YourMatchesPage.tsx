import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../HomePage.css";
import { useApiClient } from "../services/apiClient";

const YourMatchesPage: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth('/connections/?status_filter=matched');
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item: any) => ({
            id: item.id, // User ID
            connection_id: item.connection_id,
            name: item.name,
            location: "Connection Hub",
            avatar: item.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(item.name || "User") + "&background=a259e6&color=fff",
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
    <div className="matches-page-root" style={{ padding: '24px' }}>
      {/* Search and Tabs Header */}
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", marginBottom: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(61,56,112,0.18)",
            boxShadow: "0 2px 8px #a259e622",
            borderRadius: 18,
            backdropFilter: "blur(16px)",
            padding: "12px 24px",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {['All matches', 'Soul-Syncs', 'Collaborators'].map((tab, i) => (
              <button
                key={tab}
                className={"tab-btn" + (activeTab === i ? " active" : "")}
                style={{
                  background: activeTab === i ? "linear-gradient(90deg, #a259e6 0%, #3a6cf6 100%)" : "transparent",
                  color: activeTab === i ? "#fff" : "#bdbdf7",
                  border: "none",
                  borderRadius: 12,
                  padding: "8px 20px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '300px' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
              <MdSearch size={20} />
            </span>
            <input
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(162, 89, 230, 0.2)',
                borderRadius: 12,
                color: '#fff',
                outline: 'none'
              }}
              placeholder="Search matches..."
            />
          </div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#fff", paddingTop: 40 }}>
            <div className="loading-spinner" />
            <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Loading your connections...</p>
          </div>
        ) : matches.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: '80px 40px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 24,
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🤝</div>
            <h3 style={{ color: '#fff', marginBottom: 12 }}>No matches yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 24px' }}>
              Explore new people in Discovery to find your perfect Soul-Sync partner or collaborator.
            </p>
            <button
              className="action-btn-primary"
              onClick={() => navigate('/recommendations')}
              style={{ padding: '12px 24px', borderRadius: 12, background: 'var(--primary-gradient)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Go to Discovery
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 32 }}>
            {matches.map((user) => (
              <div
                key={user.id}
                className="match-card"
                style={{
                  background: "rgba(61, 56, 112, 0.32)",
                  borderRadius: 28,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  backdropFilter: "blur(32px)",
                  border: "1.5px solid rgba(162, 89, 230, 0.12)",
                  padding: 32,
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/chat')}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 20, color: "#fff" }}>{user.name}</div>
                    <div style={{ color: "var(--text-tertiary)", fontSize: 14 }}>{user.location}</div>
                  </div>
                  <div style={{ background: 'rgba(76, 209, 55, 0.1)', color: '#4cd137', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    MATCHED
                  </div>
                </div>

                <p style={{ color: "#e0d7fa", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{user.description}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {user.tags.map((tag: string) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(162, 89, 230, 0.1)",
                        color: "#a259e6",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>Compatibility</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#4cd137' }}>{user.compatibility}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ width: user.compatibility + "%", height: "100%", background: "linear-gradient(90deg, #a259e6 0%, #4cd137 100%)" }} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4, background: "rgba(162,89,230,0.05)", borderRadius: 12, padding: 12, border: "1px solid rgba(162,89,230,0.2)" }}>
                  <span style={{ fontSize: 20 }}>🧠</span>
                  <div style={{ color: "#fff", fontSize: 13, lineHeight: 1.4 }}>{user.aiInsights}</div>
                </div>

                <button
                  style={{
                    marginTop: 8,
                    padding: '10px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  Start Chatting
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourMatchesPage;

