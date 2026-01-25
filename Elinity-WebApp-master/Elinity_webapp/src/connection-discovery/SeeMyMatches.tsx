import React, { useState, useEffect } from 'react';
import { MdMessage, MdMoreVert, MdLocationOn, MdWork, MdFavorite, MdFilterList } from 'react-icons/md';
import { FaHeart, FaHandshake, FaUmbrellaBeach } from 'react-icons/fa';

interface Match {
  id: number;
  name: string;
  age: number;
  location: string;
  profession: string;
  image: string;
  compatibility: number;
  mode: 'romantic' | 'leisure' | 'collaborative';
  matchedDate: string;
  lastMessage?: string;
  unreadCount?: number;
  tags: string[];
}

import { useApiClient } from '../services/apiClient';

const SeeMyMatches: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'romantic' | 'leisure' | 'collaborative'>('all');
  const [showDropdown, setShowDropdown] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const res = await fetchWithAuth('/connections/?status_filter=matched');
        if (res.ok) {
          const data = await res.json();
          const mapped: Match[] = data.map((item: any) => ({
            id: item.connection_id, // Use connection id for keys
            name: item.name,
            age: 25, // Placeholder as backend doesn't return age yet
            location: "Unknown", // Placeholder
            profession: "Unknown",
            image: item.avatar || "https://via.placeholder.com/400",
            compatibility: item.metrics?.healthScore || 50,
            mode: item.mode || 'romantic',
            matchedDate: "Recently", // Placeholder
            lastMessage: "Start a conversation!",
            unreadCount: 0,
            tags: ["New"]
          }));
          setMatches(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [fetchWithAuth]);

  const filteredMatches = filterMode === 'all'
    ? matches
    : matches.filter(m => m.mode === filterMode);

  const toggleDropdown = (id: number) => {
    setShowDropdown({ ...showDropdown, [id]: !showDropdown[id] });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'romantic': return <FaHeart />;
      case 'leisure': return <FaUmbrellaBeach />;
      case 'collaborative': return <FaHandshake />;
      default: return null;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'romantic': return '#ff6b9d';
      case 'leisure': return '#4ecdc4';
      case 'collaborative': return '#a259e6';
      default: return '#bdbdf7';
    }
  };

  return (
    <div className="see-my-matches">
      <div className="matches-header">
        <h2>My Matches</h2>
        <div className="matches-filters">
          <button
            className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All ({matches.length})
          </button>
          <button
            className={`filter-btn ${filterMode === 'romantic' ? 'active' : ''}`}
            onClick={() => setFilterMode('romantic')}
          >
            <FaHeart /> Romantic ({matches.filter(m => m.mode === 'romantic').length})
          </button>
          <button
            className={`filter-btn ${filterMode === 'leisure' ? 'active' : ''}`}
            onClick={() => setFilterMode('leisure')}
          >
            <FaUmbrellaBeach /> Leisure ({matches.filter(m => m.mode === 'leisure').length})
          </button>
          <button
            className={`filter-btn ${filterMode === 'collaborative' ? 'active' : ''}`}
            onClick={() => setFilterMode('collaborative')}
          >
            <FaHandshake /> Collaborative ({matches.filter(m => m.mode === 'collaborative').length})
          </button>
        </div>
      </div>

      <div className="matches-grid">
        {filteredMatches.map((match) => (
          <div key={match.id} className="match-card">
            <div className="match-card-header">
              <div className="match-image-wrapper">
                <img src={match.image} alt={match.name} className="match-image" />
                <div
                  className="match-mode-badge"
                  style={{ backgroundColor: getModeColor(match.mode) }}
                >
                  {getModeIcon(match.mode)}
                </div>
              </div>
              <button
                className="match-more-btn"
                onClick={() => toggleDropdown(match.id)}
              >
                <MdMoreVert />
              </button>
              {showDropdown[match.id] && (
                <div className="match-dropdown">
                  <button>View Profile</button>
                  <button>Unmatch</button>
                  <button>Report</button>
                </div>
              )}
            </div>

            <div className="match-card-content">
              <h3 className="match-name">{match.name}, {match.age}</h3>
              <div className="match-details">
                <div className="match-detail-item">
                  <MdLocationOn /> <span>{match.location}</span>
                </div>
                <div className="match-detail-item">
                  <MdWork /> <span>{match.profession}</span>
                </div>
              </div>

              <div className="match-compatibility">
                <div className="compatibility-info">
                  <span className="compatibility-label">Compatibility</span>
                  <span className="compatibility-percentage">{match.compatibility}%</span>
                </div>
                <div className="compatibility-bar-small">
                  <div
                    className="compatibility-fill-small"
                    style={{ width: `${match.compatibility}%` }}
                  />
                </div>
              </div>

              <div className="match-tags">
                {match.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="match-tag">{tag}</span>
                ))}
              </div>

              {match.lastMessage && (
                <div className="match-last-message">
                  <p>{match.lastMessage}</p>
                  {match.unreadCount && match.unreadCount > 0 && (
                    <span className="unread-badge">{match.unreadCount}</span>
                  )}
                </div>
              )}

              <div className="match-footer">
                <span className="match-date">Matched {match.matchedDate}</span>
                <button className="message-btn">
                  <MdMessage /> Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="no-matches">
          <p>No matches found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default SeeMyMatches;
