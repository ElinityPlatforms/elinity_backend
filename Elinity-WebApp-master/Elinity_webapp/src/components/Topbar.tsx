import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdOutlineNotificationsNone, MdOutlineSettings } from 'react-icons/md';
import { useAuth } from '../auth/AuthContext';
import { useProfile } from '../profiles/ProfileContext';
import { useProfileMode } from '../ProfileModeContext';

const Topbar: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { profile } = useProfile();
    const { setMode } = useProfileMode() as { setMode: (mode: string) => void };
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleModeSelect = (mode: string) => {
        setMode(mode);
        setShowDropdown(false);
        navigate("/profile");
    };

    return (
        <div className="topbar">
            <form onSubmit={handleSearch} className="search-bar-container">
                <span className="search-bar-icon"><MdSearch /></span>
                <input
                    className="search-bar"
                    placeholder="Search for people, rituals, or insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            <div className="topbar-actions">
                <button className="topbar-icon" onClick={() => navigate('/notifications')}>
                    <MdOutlineNotificationsNone />
                </button>
                <button className="topbar-icon" onClick={() => navigate('/edit-profile')}>
                    <MdOutlineSettings />
                </button>
                <div style={{ position: 'relative' }}>
                    <div className="topbar-avatar" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer' }}>
                        <img
                            src={profile.profileImg || 'https://ui-avatars.com/api/?name=User&background=a259e6&color=fff'}
                            alt={profile.displayName || 'User'}
                        />
                    </div>
                    {showDropdown && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '120%',
                            background: '#1a1a36',
                            border: '1px solid rgba(162, 89, 230, 0.3)',
                            borderRadius: 12,
                            padding: '8px 0',
                            zIndex: 1000,
                            minWidth: 180,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(20px)'
                        }}>
                            <div style={{ padding: '8px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Switch Mode</div>
                            <button className="dropdown-item" onClick={() => handleModeSelect('leisure')}>Leisure Mode</button>
                            <button className="dropdown-item" onClick={() => handleModeSelect('romantic')}>Romantic Mode</button>
                            <button className="dropdown-item" onClick={() => handleModeSelect('collaborative')}>Collaborative Mode</button>
                            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
                            <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/edit-profile'); }}>Edit Profile</button>
                            <button className="dropdown-item" style={{ color: '#ff5b5b' }} onClick={() => { setShowDropdown(false); logout(); }}>Sign Out</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Topbar;
