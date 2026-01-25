import React, { useState, useEffect, useCallback } from "react";
import { MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdAccessTime, MdInfo, MdDelete, MdLogout, MdOutlineNotificationsNone, MdOutlineSettings, MdCall, MdVideocam, MdMoreVert, MdSend, MdMenuBook, MdCardMembership } from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useProfile } from "../profiles/ProfileContext";
import { useProfileMode } from "../ProfileModeContext";
import "../HomePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useApiClient } from "../services/apiClient";

export default function ChatPage() {
  const fetchWithAuth = useApiClient();
  const { profile } = useProfile();
  const [activeSidebar, setActiveSidebar] = useState("message");
  const [showDropdown, setShowDropdown] = useState(false);
  const { setMode }: { setMode: (mode: string) => void } = useProfileMode() as { setMode: (mode: string) => void };
  const navigate = useNavigate();
  const location = useLocation();

  // State for Chats
  const [inbox, setInbox] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Group Chats State (Mock for now or reuse logic if backend supports)
  const [activeTab, setActiveTab] = useState<'chat' | 'groups'>('chat');

  // AI Suggestion State
  const [askAiInput, setAskAiInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  // Load Inbox
  const loadInbox = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth('/chats/inbox');
      if (res.ok) {
        let data = await res.json();
        // If empty, seed data (for demo purposes)
        if (data.length === 0) {
          await fetchWithAuth('/chats/seed', { method: 'POST' });
          const res2 = await fetchWithAuth('/chats/inbox');
          if (res2.ok) data = await res2.json();
        }
        setInbox(data);
        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);  // Removed selectedChat dependency to prevent loops

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  // Load Messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;
    const loadHistory = async () => {
      try {
        const res = await fetchWithAuth(`/chats/history/${selectedChat.group_id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadHistory();
    // Poll for new messages every 5s (simple realtime)
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, [selectedChat, fetchWithAuth]);

  // Send Message
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedChat) return;

    // Optimistic UI update
    const tempMsg = {
      id: "temp-" + Date.now(),
      sender_name: "Me",
      text: chatInput,
      time: new Date().toISOString(),
      is_me: true
    };
    setMessages(prev => [...prev, tempMsg]);
    const txt = chatInput;
    setChatInput("");

    try {
      await fetchWithAuth('/chats/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group: selectedChat.group_id,
          message: txt
        })
      });
      // Refresh history to get real ID/time
      const res = await fetchWithAuth(`/chats/history/${selectedChat.group_id}`);
      if (res.ok) {
        setMessages(await res.json());
      }
      // Reload inbox to update last message snippet
      loadInbox();
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  const handleModeSelect = (mode: string) => {
    setMode(mode);
    setShowDropdown(false);
    navigate("/profile");
  };

  // AI Suggestion Logic
  const handleAskAi = () => {
    if (!askAiInput.trim()) return;
    setAiSuggestion(`You could reply: "${askAiInput.trim()}"`); // Simplified for now
  };

  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      setChatInput(aiSuggestion.replace(/^You could reply: "/, "").replace(/"$/, ""));
      setAiSuggestion(null);
    }
  };

  // Contextual Helpers
  function getContextualSuggestionType() {
    if (messages.length === 0) return null;
    const lastMsg = messages[messages.length - 1]; // items are sorted chronological in backend response? verify sort.
    // Backend returns history sorted ASC by time (oldest first).
    // So last element is latest.
    if (!lastMsg) return null;
    const text = (lastMsg.text || "").toLowerCase();
    if (text.includes('coffee') || text.includes('cafe')) return 'places';
    if (text.includes('pizza') || text.includes('sushi') || text.includes('food')) return 'food';
    if (text.includes('movie') || text.includes('cinema')) return 'movies';
    return null;
  }
  const contextualType = getContextualSuggestionType();

  // render grouping logic replaced with simple list for now as backend sends flat history with 'is_me' flag
  // actually backend sends `sender_name`, `is_me`, `sender_avatar`.
  // We can group consecutive messages in UI if needed, or just map them.
  // The existing UI grouped by sender. Let's recreate that small helper for `messages`
  const groupedMessages = (() => {
    const groups: { is_me: boolean; sender_name: string; text: string[], avatar: string }[] = [];
    let lastGroup: any = null;
    messages.forEach(msg => {
      const isMe = msg.is_me;
      if (lastGroup && lastGroup.is_me === isMe && lastGroup.sender_name === msg.sender_name) {
        lastGroup.text.push(msg.text);
      } else {
        lastGroup = {
          is_me: isMe,
          sender_name: msg.sender_name,
          avatar: msg.sender_avatar,
          text: [msg.text]
        };
        groups.push(lastGroup);
      }
    });
    return groups;
  })();



  const [showHomeLabel, setShowHomeLabel] = useState(false);
  const [showFavoriteLabel, setShowFavoriteLabel] = useState(false);
  const [showPromptLabel, setShowPromptLabel] = useState(false);
  const [showSearchLabel, setShowSearchLabel] = useState(false);
  const [showMessageLabel, setShowMessageLabel] = useState(false);
  const [showGamesLabel, setShowGamesLabel] = useState(false);

  return (
    <div className="home-root" style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #23235b 0%, #2a1a4a 100%)', overflowX: 'hidden', width: '100vw' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group main-icons">
            <button className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`} aria-label="Home" onClick={() => setActiveSidebar("home")}
              onMouseEnter={() => setShowHomeLabel(true)}
              onMouseLeave={() => setShowHomeLabel(false)}
              style={{ position: 'relative' }}
            > <MdHome /> {activeSidebar === "home" && <span className="sidebar-active-bar" />} {showHomeLabel && (<span style={{ position: 'absolute', left: '70%', top: '120%', transform: 'translateX(-50%)', background: 'rgba(35,35,91,0.98)', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #0003', whiteSpace: 'nowrap', zIndex: 100, }}>Home</span>)} </button>
            <button className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`} aria-label="Favorites" onClick={() => setActiveSidebar("favorite")}
              onMouseEnter={() => setShowFavoriteLabel(true)}
              onMouseLeave={() => setShowFavoriteLabel(false)}
              style={{ position: 'relative' }}
            > <MdFavorite /> {activeSidebar === "favorite" && <span className="sidebar-active-bar" />} {showFavoriteLabel && (<span style={{ position: 'absolute', left: '70%', top: '120%', transform: 'translateX(-50%)', background: 'rgba(35,35,91,0.98)', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #0003', whiteSpace: 'nowrap', zIndex: 100, }}>Your Matches</span>)} </button>
            <button className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`} aria-label="Prompt" onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}
              onMouseEnter={() => setShowPromptLabel(true)}
              onMouseLeave={() => setShowPromptLabel(false)}
              style={{ position: 'relative' }}
            > <MdAssignment /> {activeSidebar === "prompt" && <span className="sidebar-active-bar" />} {showPromptLabel && (<span style={{ position: 'absolute', left: '70%', top: '120%', transform: 'translateX(-50%)', background: 'rgba(35,35,91,0.98)', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #0003', whiteSpace: 'nowrap', zIndex: 100, }}>Prompt</span>)} </button>
            <button className={`sidebar-icon${activeSidebar === "games" ? " active" : ""}`} aria-label="Games" onClick={() => { setActiveSidebar("games"); navigate("/games"); }}
              onMouseEnter={() => setShowGamesLabel(true)}
              onMouseLeave={() => setShowGamesLabel(false)}
              style={{ position: 'relative' }}
            > <FaGamepad /> {activeSidebar === "games" && <span className="sidebar-active-bar" />} {showGamesLabel && (<span style={{ position: 'absolute', left: '70%', top: '120%', transform: 'translateX(-50%)', background: 'rgba(35,35,91,0.98)', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #0003', whiteSpace: 'nowrap', zIndex: 100, }}>Games</span>)} </button>
            <button className={`sidebar-icon${location.pathname === "/chat" ? " active" : ""}`} aria-label="Messages" onClick={() => { setActiveSidebar("message"); navigate("/chat"); }}
              onMouseEnter={() => setShowMessageLabel(true)}
              onMouseLeave={() => setShowMessageLabel(false)}
              style={{ position: 'relative' }}
            > <MdMessage /> {activeSidebar === "message" && <span className="sidebar-active-bar" />} {showMessageLabel && (<span style={{ position: 'absolute', left: '70%', top: '120%', transform: 'translateX(-50%)', background: 'rgba(35,35,91,0.98)', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #0003', whiteSpace: 'nowrap', zIndex: 100, }}>Messages</span>)} </button>
            <button className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} aria-label="Search" onClick={() => setActiveSidebar("search")}
              onMouseEnter={() => setShowSearchLabel(true)}
              onMouseLeave={() => setShowSearchLabel(false)}
              style={{ position: 'relative' }}
            > <MdSearch /> {activeSidebar === "search" && <span className="sidebar-active-bar" />} {showSearchLabel && (<span style={{ position: 'absolute', left: '70%', top: '120%', transform: 'translateX(-50%)', background: 'rgba(35,35,91,0.98)', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #0003', whiteSpace: 'nowrap', zIndex: 100, }}>Search</span>)} </button>
          </div>
          <div className="sidebar-group secondary-icons">
            <button className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`} aria-label="Settings" onClick={() => setActiveSidebar("settings")}> <MdSettings /> {activeSidebar === "settings" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "subscription" ? " active" : ""}`} aria-label="Subscription" onClick={() => { setActiveSidebar("subscription"); navigate("/subscription"); }}> <MdCardMembership /> {activeSidebar === "subscription" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "clock" ? " active" : ""}`} aria-label="Clock" onClick={() => setActiveSidebar("clock")}> <MdAccessTime /> {activeSidebar === "clock" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "info" ? " active" : ""}`} aria-label="Info" onClick={() => setActiveSidebar("info")}> <MdInfo /> {activeSidebar === "info" && <span className="sidebar-active-bar" />} </button>
            <button className={`sidebar-icon${activeSidebar === "trash" ? " active" : ""}`} aria-label="Trash" onClick={() => setActiveSidebar("trash")}> <MdDelete /> {activeSidebar === "trash" && <span className="sidebar-active-bar" />} </button>
          </div>
        </nav>
        <button className="sidebar-logout red" aria-label="Logout"> <MdLogout /> </button>
      </aside>
      <main className="main-content with-topbar-margin" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', background: 'none', overflowX: 'hidden', minWidth: 0, padding: 0 }}>
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-center">
            <div style={{ position: 'relative', width: 420, maxWidth: '100%' }}>
              <span className="search-bar-icon"><MdSearch /></span>
              <input className="search-bar" placeholder="Search" />
            </div>
          </div>
          <div className="topbar-actions" style={{ alignItems: 'center', display: 'flex', gap: 20 }}>
            <button className="topbar-icon" onClick={() => navigate('/notifications')}><MdOutlineNotificationsNone /></button>
            <button className="topbar-icon"><MdOutlineSettings /></button>
            <div className="topbar-divider" />
            <div style={{ position: 'relative' }}>
              <div className="topbar-avatar" style={{ cursor: 'pointer' }} onClick={() => setShowDropdown((v) => !v)}>
                <img src={profile.profileImg || "https://randomuser.me/api/portraits/men/32.jpg"} alt="avatar" />
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
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('leisure')}>Leisure Mode</button>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('romantic')}>Romantic Mode</button>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => handleModeSelect('collaborative')}>Collaborative Mode</button>
                  <div style={{ borderTop: '1px solid #444', margin: '6px 0' }} />
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => { setShowDropdown(false); navigate('/edit-profile'); }}>Edit Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main Chat Layout */}
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'stretch', gap: 40, minHeight: 0, minWidth: 0, overflowX: 'hidden', height: 'calc(100vh - 90px)', padding: '24px 0 0 0' }}>
          {/* Chat List Card */}
          <div style={{ width: 340, background: 'rgba(61, 56, 112, 0.28)', borderRadius: 28, boxShadow: '0 8px 32px 0 #a259e655', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14, height: '100%', minHeight: 0, minWidth: 0, overflowX: 'hidden', border: '1.5px solid rgba(162,89,230,0.18)' }}>
            {/* Chat/Groups Toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 18 }}>
              <div style={{
                display: 'flex',
                background: 'rgba(24, 25, 54, 0.7)',
                borderRadius: 12,
                padding: 3,
                gap: 2,
                boxShadow: '0 2px 8px #23235b33',
              }}>
                <button
                  onClick={() => setActiveTab('chat')}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: activeTab === 'chat' ? 'rgba(162, 89, 230, 0.22)' : 'transparent',
                    color: activeTab === 'chat' ? '#fff' : '#bdbdf7',
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 8,
                    padding: '7px 28px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: activeTab === 'groups' ? 'rgba(162, 89, 230, 0.22)' : 'transparent',
                    color: activeTab === 'groups' ? '#fff' : '#bdbdf7',
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 8,
                    padding: '7px 28px',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Groups
                </button>
              </div>
            </div>
            <div style={{ color: '#bdbdf7', fontSize: 12, marginBottom: 8 }}>Notifications</div>
            <div className="chat-messages-scroll-hide" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
              {activeTab === 'chat' && (
                inbox.map((chat, idx) => (
                  <div
                    key={chat.group_id + idx}
                    className="chat-list-item"
                    onClick={() => setSelectedChat(chat)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 10px',
                      borderRadius: 16,
                      background: selectedChat?.group_id === chat.group_id ? 'rgba(162, 89, 230, 0.10)' : 'none',
                      boxShadow: selectedChat?.group_id === chat.group_id ? '0 2px 8px #a259e622' : 'none',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'background 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <img src={chat.avatar} alt={chat.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: selectedChat?.group_id === chat.group_id ? '2px solid #a259e6' : '2px solid transparent' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{chat.name}</div>
                      <div style={{ color: '#bdbdf7', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.last_message}</div>
                    </div>
                    <div style={{ color: '#bdbdf7', fontSize: 12 }}>{new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))
              )}
              {/* TODO: Add Group Chats when available from backend */}
            </div>
          </div>
          {/* Chat Window Card */}
          <div style={{ flex: 1, maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0, overflowX: 'hidden', height: '100%', minHeight: 0 }}>
            {/* Chat Window Glass Card */}
            <div style={{ background: 'none', borderRadius: 32, boxShadow: '0 12px 48px 0 #3a6cf655, 0 8px 32px 0 #a259e655', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', padding: '40px 56px', display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0, border: '2.5px solid rgba(162,89,230,0.28)', height: '100%', minHeight: 0 }}>
              {/* Chat Header (inside card) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <img src={selectedChat ? selectedChat.avatar : "https://randomuser.me/api/portraits/lego/1.jpg"} alt={selectedChat ? selectedChat.name : "chat"} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #a259e6' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{selectedChat ? selectedChat.name : "Chat"}</div>
                  {selectedChat ? (
                    <div style={{ color: '#3af67a', fontSize: 12, fontWeight: 500 }}>Active </div>
                  ) : <div />}
                </div>
                <button className="topbar-icon"><MdCall /></button>
                <button className="topbar-icon"><MdVideocam /></button>
                <button className="topbar-icon"><MdMoreVert /></button>
              </div>
              {/* Chat Messages (grouped) */}
              <div className="chat-messages-scroll-hide" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', background: 'rgba(61, 56, 112, 0.10)', borderRadius: 24, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
                {selectedChat && groupedMessages.map((group, groupIdx) => (
                  <div key={groupIdx} style={{ display: 'flex', flexDirection: group.is_me ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 10, justifyContent: group.is_me ? 'flex-end' : 'flex-start' }}>
                    {/* Avatar logic */}
                    {group.is_me ? (
                      <img
                        src={profile.profileImg || "https://randomuser.me/api/portraits/men/32.jpg"}
                        alt={group.sender_name}
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #a259e6', marginLeft: 6 }}
                      />
                    ) : (
                      <img
                        src={group.avatar || selectedChat.avatar}
                        alt={group.sender_name}
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #a259e6', marginRight: 6 }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: group.is_me ? 'flex-end' : 'flex-start', width: '100%' }}>
                      {group.text.map((text, idx) => (
                        <div
                          key={idx}
                          style={{
                            maxWidth: '75%',
                            background: group.is_me
                              ? 'linear-gradient(90deg, #a259e6 60%, #3a6cf6 100%)'
                              : '#181828',
                            color: '#fff',
                            borderRadius: 16,
                            padding: '14px 24px',
                            fontSize: 12,
                            fontWeight: 400,
                            boxShadow: group.is_me
                              ? '0 4px 16px #a259e655'
                              : '0 4px 16px #23235b55',
                            marginBottom: 4,
                            marginLeft: group.is_me ? 0 : 8,
                            marginRight: group.is_me ? 8 : 0,
                            alignSelf: group.is_me ? 'flex-end' : 'flex-start',
                            textAlign: 'left',
                            wordBreak: 'break-word',
                          }}
                        >
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {!selectedChat && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#bdbdf7' }}>
                    Select a conversation to start chatting
                  </div>
                )}
              </div>
            </div>
            {/* Ask AI and Type Here Bars at the bottom */}
            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'rgba(61, 56, 112, 0.32)', borderRadius: 24, boxShadow: '0 0 48px 0 #3a6cf655, 0 8px 32px 0 #a259e655', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 18, minWidth: 0, border: '2.5px solid rgba(58,108,246,0.28)', width: '100%' }}>
                <span style={{ color: '#bdbdf7', fontSize: 22 }}><MdSearch /></span>
                <input
                  style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, outline: 'none' }}
                  placeholder="Ask AI"
                  value={askAiInput}
                  onChange={e => setAskAiInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAskAi(); }}
                />
                <button
                  className="topbar-icon"
                  style={{ fontSize: 20, color: '#fff', background: 'linear-gradient(90deg, #a259e6 60%, #3a6cf6 100%)', borderRadius: 10, border: 'none', padding: '7px 16px', cursor: 'pointer', boxShadow: '0 0 24px 0 #3a6cf655' }}
                  onClick={handleAskAi}
                >
                  <MdSend />
                </button>
              </div>
              {/* AI Suggestion */}
              {aiSuggestion && (
                <div style={{ margin: '8px 0 0 0', color: '#bdbdf7', fontSize: 13, background: 'rgba(162, 89, 230, 0.10)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ flex: 1 }}>{aiSuggestion}</span>
                  <button style={{ background: 'linear-gradient(90deg, #a259e6 60%, #3a6cf6 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontSize: 13 }} onClick={handleAcceptSuggestion}>Use</button>
                </div>
              )}
              {/* Contextual Suggestion Box */}
              {contextualType === 'places' && (
                <div style={{ margin: '14px 0 0 0', background: 'rgba(61,56,112,0.22)', borderRadius: 18, padding: '18px 22px', boxShadow: '0 2px 12px #3a6cf633', color: '#fff' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Places Nearby</div>
                  <div style={{ display: 'flex', gap: 18 }}>
                    {mockPlaces.map((place, i) => (
                      <div key={i} style={{ background: 'rgba(162,89,230,0.10)', borderRadius: 12, padding: '12px 16px', minWidth: 160 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{place.name}</div>
                        <div style={{ fontSize: 12, color: '#bdbdf7', marginTop: 4 }}>{place.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {contextualType === 'food' && (
                <div style={{ margin: '14px 0 0 0', background: 'rgba(61,56,112,0.22)', borderRadius: 18, padding: '18px 22px', boxShadow: '0 2px 12px #3a6cf633', color: '#fff' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Food Suggestions</div>
                  <div style={{ display: 'flex', gap: 18 }}>
                    {mockFoods.map((food, i) => (
                      <div key={i} style={{ background: 'rgba(162,89,230,0.10)', borderRadius: 12, padding: '12px 16px', minWidth: 160 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{food.name}</div>
                        <div style={{ fontSize: 12, color: '#bdbdf7', marginTop: 4 }}>{food.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {contextualType === 'movies' && (
                <div style={{ margin: '14px 0 0 0', background: 'rgba(61,56,112,0.22)', borderRadius: 18, padding: '18px 22px', boxShadow: '0 2px 12px #3a6cf633', color: '#fff' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Movie Suggestions</div>
                  <div style={{ display: 'flex', gap: 18 }}>
                    {mockMovies.map((movie, i) => (
                      <div key={i} style={{ background: 'rgba(162,89,230,0.10)', borderRadius: 12, padding: '12px 16px', minWidth: 160 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{movie.name}</div>
                        <div style={{ fontSize: 12, color: '#bdbdf7', marginTop: 4 }}>{movie.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ background: 'rgba(61, 56, 112, 0.32)', borderRadius: 24, boxShadow: '0 0 48px 0 #3a6cf655, 0 8px 32px 0 #a259e655', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 18, minWidth: 0, border: '2.5px solid rgba(58,108,246,0.28)', width: '100%' }}>
                <input
                  style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, outline: 'none' }}
                  placeholder="Type Here"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button
                  className="topbar-icon"
                  style={{ fontSize: 20, color: '#fff', background: 'linear-gradient(90deg, #a259e6 60%, #3a6cf6 100%)', borderRadius: 10, border: 'none', padding: '7px 16px', cursor: 'pointer', boxShadow: '0 0 24px 0 #3a6cf655' }}
                  onClick={handleSendMessage}
                >
                  <MdSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}