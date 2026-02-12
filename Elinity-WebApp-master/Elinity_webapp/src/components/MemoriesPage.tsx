import React, { useState, useEffect } from 'react';
import { MdSearch, MdOutlineNotificationsNone, MdOutlineSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../HomePage.css';
import './MemoriesPage.css';
import { useApiClient } from "../services/apiClient";

const MemoriesPage: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const navigate = useNavigate();
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
    <div className="memories-page-content" style={{ padding: '24px' }}>

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
    </div>
  );
};

export default MemoriesPage;
