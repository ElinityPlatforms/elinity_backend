import React, { useState, useEffect } from 'react';
import { MdSearch, MdBook, MdMoreVert } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useLifebookService, type Lifebook } from '../services/lifebookService';
import '../HomePage.css';

export default function ArchivePage() {
  const [lifebooks, setLifebooks] = useState<Lifebook[]>([]);
  const [loading, setLoading] = useState(true);
  const lifebookService = useLifebookService();

  useEffect(() => {
    async function loadLifebooks() {
      try {
        const service = await lifebookService;
        const data = await service.getLifebooks();
        setLifebooks(data);
      } catch (err) {
        console.error("Failed to load lifebooks", err);
      } finally {
        setLoading(false);
      }
    }
    loadLifebooks();
  }, []);

  return (
    <div className="archive-page-root" style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>Your Archive</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review and manage your past reflections and Lifebook entries.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0 }}>Archived Items</h3>
          <div style={{ position: 'relative' }}>
            <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              placeholder="Search archive..."
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '8px 12px 8px 36px',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading archive...</div>
        ) : lifebooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <MdBook size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--text-secondary)' }}>No archived items found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {lifebooks.map((lb) => (
              <div
                key={lb.id}
                className="archive-item-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    📖
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>{lb.name}</h4>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{lb.description || "No description provided"}</p>
                  </div>
                </div>
                <MdMoreVert color="var(--text-tertiary)" size={20} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 32, padding: 24, background: 'var(--primary-gradient)', borderRadius: 24, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.9 }}>
        <div>
          <h4 style={{ margin: '0 0 4px' }}>Archive Management</h4>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Optimize your storage and organization settings.</p>
        </div>
        <button style={{ background: '#fff', color: 'var(--primary)', border: 'none', padding: '10px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
          Manage Settings
        </button>
      </div>
    </div>
  );
}
