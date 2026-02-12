import React, { useState, useEffect } from 'react';
import {
  MdSearch, MdBook, MdChatBubbleOutline, MdPsychology,
  MdPlayCircleOutline, MdDownloadForOffline, MdKeyboardVoice,
  MdCalendarToday, MdMoreVert, MdAutoAwesome, MdRefresh
} from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useApiClient } from "../services/apiClient";
import { BASE_URL } from '../api/client';
import '../HomePage.css';

export default function JournalPage() {
  const fetchWithAuth = useApiClient();
  const [tab, setTab] = useState('write');
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setMessage(prev => prev + ' ' + finalTranscript);
    };
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

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
        body: JSON.stringify({ title: 'Note - ' + new Date().toLocaleDateString(), content: message }),
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

  const handleGenerateMoodscape = async (id: string) => {
    setGeneratingId(id);
    try {
      const res = await fetchWithAuth(`/journal/${id}/moodscape`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        // Update the local state to show the new media URL
        setJournals(prev => prev.map(journal =>
          journal.id === id ? { ...journal, media: data.image_url } : journal
        ));
      }
    } catch (err) {
      console.error("Moodscape generation failed:", err);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="journal-page-root" style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: 0 }}>Smart Journal</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>Capture your thoughts and let Lumi AI analyze your growth.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {['write', 'memories', 'archive'].map(t => (
            <button
              key={t}
              onClick={() => t === 'write' ? setTab(t) : navigate('/' + t)}
              style={{
                background: tab === t ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32, alignItems: 'start' }}>
        {/* Left: Input Section */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{
            background: 'rgba(61, 56, 112, 0.2)',
            borderRadius: 32,
            padding: 40,
            border: '1.5px solid rgba(162, 89, 230, 0.2)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div
              className={`ai-orb-container ${isListening ? 'pulse' : ''}`}
              onClick={toggleListening}
              style={{ position: 'relative', marginBottom: 32, cursor: 'pointer' }}
            >
              <div style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: isListening
                  ? 'radial-gradient(circle at 30% 30%, #ff4757, #ff6b81)'
                  : 'radial-gradient(circle at 30% 30%, #a259e6, #3a6cf6)',
                boxShadow: isListening
                  ? '0 0 60px rgba(255, 71, 87, 0.6), inset 0 0 20px rgba(255,255,255,0.2)'
                  : '0 0 40px rgba(162, 89, 230, 0.4), inset 0 0 20px rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}>
                <MdKeyboardVoice size={48} color="#fff" />
              </div>
              <div className="orb-ring" style={{ position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, border: `1px solid ${isListening ? 'rgba(255,71,87,0.3)' : 'rgba(162,89,230,0.3)'}`, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>{isListening ? "Listening..." : "How's your day going?"}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
              {isListening ? "I'm listening to your thoughts. Tap the orb to stop." : "Tap the orb to record your voice, or type below."}
            </p>

            <div style={{ width: '100%', position: 'relative' }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?..."
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  padding: '16px 48px 16px 16px',
                  color: '#fff',
                  fontSize: 15,
                  minHeight: 120,
                  resize: 'none',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              <button
                onClick={handlePost}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  background: 'var(--primary-gradient)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 16px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <MdPsychology size={24} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>Lumi Insight</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              "You've been expressing a lot of gratitude lately. This positive trend is helping your overall wellbeing score!"
            </p>
          </div>
        </div>


        {/* Right: History Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Recent Entries</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <MdSearch size={20} color="var(--text-tertiary)" />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading history...</div>
          ) : journals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px dashed rgba(255,255,255,0.1)' }}>
              <MdBook size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--text-secondary)' }}>No journal entries yet. Start writing on the left!</p>
            </div>
          ) : (
            journals.map((j) => (
              <div
                key={j.id}
                className="journal-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 20,
                  padding: 24,
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>
                    <MdCalendarToday size={14} />
                    {new Date(j.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <MdMoreVert color="var(--text-tertiary)" />
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: 18 }}>{j.title || 'Untitled Entry'}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {j.content}
                </p>

                {/* Moodscape Image Display */}
                {j.media ? (
                  <div style={{
                    marginTop: 16,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(162, 89, 230, 0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                  }}>
                    <img
                      src={`${BASE_URL}${j.media}`}
                      alt="Moodscape"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: 16 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleGenerateMoodscape(j.id); }}
                      disabled={generatingId === j.id}
                      style={{
                        background: 'rgba(162, 89, 230, 0.1)',
                        color: 'var(--primary)',
                        border: '1px solid rgba(162, 89, 230, 0.3)',
                        borderRadius: 12,
                        padding: '8px 16px',
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(162, 89, 230, 0.2)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(162, 89, 230, 0.1)'}
                    >
                      {generatingId === j.id ? (
                        <>
                          <MdRefresh className="pulse" />
                          Visualizing with Flux AI...
                        </>
                      ) : (
                        <>
                          <MdAutoAwesome />
                          Generate Moodscape
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* AI Summary Placeholder (if content is long) */}
                {j.content.length > 100 && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16 }}>✨</span>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                      AI Summary: Focusing on personal growth and routine adjustments.
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

