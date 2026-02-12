import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JournalPromptPage from '../JournalPromptPage';
import './SmartJournalsPage.css';

const SmartJournalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Items');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case 'All Items':
        return (
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'rgba(40, 40, 80, 0.6)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(10px)' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Items Expiring</h3>
                <p style={{ margin: '8px 0 0', color: '#ccc' }}>5 items will be permanently deleted soon. Review them before they are gone forever.</p>
                <button style={{ marginTop: '24px', background: '#444', border: 'none', borderRadius: '8px', padding: '10px 20px', color: 'white', cursor: 'pointer' }}>Empty Trash</button>
              </div>
              <div style={{ background: 'rgba(40, 40, 80, 0.6)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(10px)' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Store Management</h3>
                <p style={{ margin: '8px 0 0', color: '#ccc' }}>3 new entries from deleted this week.</p>
                <button style={{ marginTop: '24px', background: '#444', border: 'none', borderRadius: '8px', padding: '10px 20px', color: 'white', cursor: 'pointer' }}>Empty Trash</button>
              </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(40, 40, 80, 0.6)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Recently Deleted</h3>
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>☀️</span>
                    <div>
                      <div>Summer Reflection</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>Deleted 2 days ago</div>
                    </div>
                  </div>
                  <div>
                    <span style={{ cursor: 'pointer', marginRight: '12px' }}>🗑️</span>
                    <span style={{ cursor: 'pointer' }}>⋮</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>📖</span>
                    <div>
                      <div>Couple Journal 2025</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>Deleted 1 week ago</div>
                    </div>
                  </div>
                  <div>
                    <span style={{ cursor: 'pointer', marginRight: '12px' }}>🗑️</span>
                    <span style={{ cursor: 'pointer' }}>⋮</span>
                  </div>
                </div>
              </div>
              <h3 style={{ margin: '24px 0 16px', fontSize: '18px', fontWeight: 'bold' }}>Older Items</h3>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>❤️</span>
                    <div>
                      <div>Work Challanges</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>Deleted 1 week ago</div>
                    </div>
                  </div>
                  <div>
                    <span style={{ cursor: 'pointer', marginRight: '12px' }}>🗑️</span>
                    <span style={{ cursor: 'pointer' }}>⋮</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>🕔</span>
                    <div>
                      <div>Meditation Journey</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>Deleted 1 week ago</div>
                    </div>
                  </div>
                  <div>
                    <span style={{ cursor: 'pointer', marginRight: '12px' }}>🗑️</span>
                    <span style={{ cursor: 'pointer' }}>⋮</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Journal Entries':
        return (
          <div className="journal-entries-content">
            <div className="tabs secondary-tabs">
              {['All Items', 'Favourites', 'Recents', 'By date', 'By Emotions'].map(tab => (
                <button
                  key={tab}
                  className={`tab-button secondary-tab ${tab === 'All Items' ? 'active' : ''}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="journal-entries-grid">
              <div className="journal-card-figma">
                <h4>Emotions</h4>
                <div className="emotions-cards">
                  <div className="emotion-card">
                    <span role="img" aria-label="Mood Patterns">😊</span>
                    <p>Mood Patterns</p>
                    <button className="view-insights-btn">View Insights</button>
                  </div>
                  <div className="emotion-card">
                    <span role="img" aria-label="Anxiety">😰</span>
                    <p>Anxiety</p>
                    <button className="view-insights-btn">View Insights</button>
                  </div>
                </div>
              </div>
              <div className="journal-card-figma">
                <h4>Search by Emotions</h4>
                <div className="emotion-tags">
                  {['Happy', 'Sad', 'Angry', 'Calm'].map(tag => (
                    <button key={tag} className="emotion-tag">{tag}</button>
                  ))}
                </div>
                <h4>Popular Tags</h4>
                <div className="popular-tags">
                  {['Work', 'Family', 'Goals', 'Meditation', 'Self-awareness', 'Mindful Living'].map(tag => (
                    <button key={tag} className="tag-btn">{tag}</button>
                  ))}
                </div>
              </div>
              <div className="journal-card-figma-large">
                <div className="timeline-header">
                  <span className="timeline-icon">📊</span>
                  <h4>Timeline View</h4>
                </div>
                <p className="subtitle">Browse By Date</p>
                <p className="description">View your journal entries organized chronologically on an interactive timeline.</p>
                <div className="timeline-buttons">
                  <button className="open-timeline-btn">Open Timeline</button>
                  <button className="select-date-btn">Select Date Range</button>
                </div>
              </div>
              <div className="journal-card-figma-large">
                <div className="sentimental-header">
                  <span className="sentimental-icon">📈</span>
                  <h4>Sentimental Analysis</h4>
                </div>
                <p className="subtitle">Emotional Trends</p>
                <p className="description">Your mood improves significantly after morning meditation sessions, consider making this consistent daily practice</p>
                <button className="view-analysis-btn">View Analysis</button>
              </div>
            </div>
          </div>
        );
      case 'AI Conversations':
        return <JournalPromptPage />;
      default:
        return null;
    }
  };

  return (
    <div className="smart-journal-content" style={{ padding: '24px', color: 'white' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Smart Journals</h1>
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #444', marginTop: '24px' }}>
        {['All Items', 'Journal Entries', 'AI Conversations'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab ? 'white' : '#aaa',
              padding: '16px 0',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid white' : '2px solid transparent',
              fontWeight: 'bold'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default SmartJournalsPage;