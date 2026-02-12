import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings,
    MdLogout, MdBook, MdPeople, MdSelfImprovement, MdForum, MdQuiz,
    MdNotifications, MdArticle, MdVideogameAsset, MdPsychology, MdSchool,
    MdAutoAwesome, MdStyle, MdMic, MdInsights
} from 'react-icons/md';
import { useAuth } from '../auth/AuthContext';
import { useProfile } from '../profiles/ProfileContext';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { profile } = useProfile();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const mainNavItems: NavItem[] = [
        { icon: <MdHome />, label: 'Home', path: '/' },
        { icon: <MdSelfImprovement />, label: 'Sanctuary', path: '/sanctuary' },
        { icon: <MdBook />, label: 'Journal', path: '/journal' },
        { icon: <MdPsychology />, label: 'Psychology', path: '/ai-personas' },
        { icon: <MdMessage />, label: 'Messages', path: '/chat' },
        { icon: <MdSchool />, label: 'Skills', path: '/skills' },
        { icon: <MdStyle />, label: 'Persona Cards', path: '/question-cards' },
        { icon: <MdMic />, label: 'Voice Onboarding', path: '/onboarding/voice' },
        { icon: <MdPeople />, label: 'Discovery', path: '/recommendations' },
        { icon: <MdVideogameAsset />, label: 'Games', path: '/games' },
        { icon: <MdForum />, label: 'Community', path: '/community' },
        { icon: <MdAutoAwesome />, label: 'Lumi AI', path: '/lumi' },
    ];

    const secondaryNavItems: NavItem[] = [
        { icon: <MdNotifications />, label: 'Notifications', path: '/notifications' },
        { icon: <MdFavorite />, label: 'Subscriptions', path: '/subscription' },
        { icon: <MdInsights />, label: 'Professional Dashboard', path: '/admin' },
        { icon: <MdSettings />, label: 'Settings', path: '/edit-profile' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img src="/mainlogo.png" alt="Elinity" className="ee-logo-img" />
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-group">
                    {mainNavItems.map((item) => (
                        <button
                            key={item.path}
                            className={`sidebar-icon${isActive(item.path) ? ' active' : ''}`}
                            onClick={() => {
                                if (item.path === '/games') {
                                    window.location.href = 'http://136.113.118.172/auth/login';
                                } else {
                                    navigate(item.path);
                                }
                            }}
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            title={item.label}
                        >
                            {item.icon}
                            {isActive(item.path) && <span className="sidebar-active-bar" />}
                            {hoveredItem === item.label && (
                                <span className="sidebar-tooltip">{item.label}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="sidebar-divider" />

                <div className="sidebar-group">
                    {secondaryNavItems.map((item) => (
                        <button
                            key={item.path}
                            className={`sidebar-icon${isActive(item.path) ? ' active' : ''}`}
                            onClick={() => navigate(item.path)}
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            title={item.label}
                        >
                            {item.icon}
                            {hoveredItem === item.label && (
                                <span className="sidebar-tooltip">{item.label}</span>
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            <button
                className="sidebar-logout"
                onClick={logout}
                title="Logout"
                onMouseEnter={() => setHoveredItem('Logout')}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <MdLogout />
                {hoveredItem === 'Logout' && (
                    <span className="sidebar-tooltip">Logout</span>
                )}
            </button>
        </aside>
    );
};

export default Sidebar;

