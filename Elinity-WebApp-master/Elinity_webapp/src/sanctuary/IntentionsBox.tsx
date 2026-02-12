import React, { useState, useEffect } from 'react';
import { MdLightbulb, MdAdd, MdCheckCircle, MdEdit, MdDelete } from 'react-icons/md';
import { useApiClient } from '../services/apiClient';

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface GoalRitual {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  streak_count: number;
  history: string[];
  is_active: boolean;
  created_at: string;
}

const IntentionsBox: React.FC = () => {
  const fetchWithAuth = useApiClient();
  const [intentions, setIntentions] = useState<GoalRitual[]>([]);
  const [newIntention, setNewIntention] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRituals();
  }, [fetchWithAuth]);

  const loadRituals = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/tools/rituals`);
      if (res.ok) {
        const data = await res.json();
        setIntentions(data);
      }
    } catch (err) {
      console.error("Failed to load rituals", err);
    } finally {
      setLoading(false);
    }
  };

  const addIntention = async () => {
    if (!newIntention.trim()) return;

    try {
      const res = await fetchWithAuth(`${API_BASE}/tools/rituals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newIntention, frequency: 'daily' })
      });
      if (res.ok) {
        const created = await res.json();
        setIntentions([...intentions, created]);
        setNewIntention('');
      }
    } catch (err) {
      console.error("Failed to add ritual", err);
    }
  };

  const toggleIntention = async (id: string, isCompleted: boolean) => {
    if (isCompleted) return; // Cannot un-complete in current API

    try {
      const res = await fetchWithAuth(`${API_BASE}/tools/rituals/${id}/complete`, {
        method: 'POST'
      });
      if (res.ok) {
        const updated = await res.json();
        setIntentions(prev => prev.map(i => i.id === id ? updated : i));
      }
    } catch (err) {
      console.error("Failed to complete ritual", err);
    }
  };

  const deleteIntention = (id: string) => {
    // Backend DELETE endpoint not implemented yet
    console.log("Delete not implemented for ritual", id);
    alert("Deleting rituals is coming soon!");
  };

  // Helper to check if completed today
  // Date format from backend is ISO string. Simple check:
  const isCompletedToday = (history: string[]) => {
    if (!history || history.length === 0) return false;
    const today = new Date().toISOString().split('T')[0];
    return history.some(h => h.startsWith(today));
  };

  return (
    <div className="sanctuary-box intentions-box">
      <div className="box-header">
        <div className="box-icon intentions-icon">
          <MdLightbulb />
        </div>
        <h2 className="box-title">Intentions & Rituals</h2>
      </div>
      <p className="box-description">
        Set daily intentions and rituals to guide your journey.
      </p>

      <div className="intentions-content">
        <div className="add-intention">
          <input
            type="text"
            className="intention-input"
            placeholder="New daily ritual..."
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addIntention()}
          />
          <button className="add-intention-btn" onClick={addIntention}>
            <MdAdd /> Add
          </button>
        </div>

        <div className="intentions-list">
          <h3 className="list-title">Today's Rituals</h3>
          {loading ? <p>Loading...</p> : intentions.length === 0 ? (
            <div className="empty-state">
              <p>No rituals set yet.</p>
            </div>
          ) : (
            <div className="intention-items">
              {intentions.map((item) => {
                const completed = isCompletedToday(item.history);
                return (
                  <div
                    key={item.id}
                    className={`intention-item ${completed ? 'completed' : ''}`}
                  >
                    <button
                      className="intention-check"
                      onClick={() => toggleIntention(item.id, completed)}
                      title={completed ? "Done for today" : "Mark as done"}
                    >
                      <MdCheckCircle
                        className={completed ? 'checked' : 'unchecked'}
                      />
                    </button>
                    <div style={{ flex: 1 }}>
                      <span className="intention-text">{item.title}</span>
                      <div style={{ fontSize: '0.8em', color: '#aaa', marginLeft: 8 }}>
                        Streak: {item.streak_count} 🔥
                      </div>
                    </div>
                    <div className="intention-actions">
                      <button
                        className="intention-action-btn delete-btn"
                        onClick={() => deleteIntention(item.id)}
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="intentions-stats">
          <div className="stat-item">
            <span className="stat-value">
              {intentions.filter(i => isCompletedToday(i.history)).length}
            </span>
            <span className="stat-label">Done Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{intentions.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentionsBox;
