import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';

const MainLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hide layout for auth pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthPage) {
        return <Outlet />;
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="layout-container">
                <Topbar />
                <main className="layout-main">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Navigation Bar */}
            <nav className="mobile-nav">
                <div
                    className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={() => navigate('/')}
                >
                    <span className="nav-icon">🏠</span>
                </div>
                <div
                    className={`mobile-nav-item ${location.pathname.startsWith('/sanctuary') ? 'active' : ''}`}
                    onClick={() => navigate('/sanctuary')}
                >
                    <span className="nav-icon">🧘</span>
                </div>
                <div
                    className={`mobile-nav-item ${location.pathname.startsWith('/chat') ? 'active' : ''}`}
                    onClick={() => navigate('/chat')}
                >
                    <span className="nav-icon">💬</span>
                </div>
                <div
                    className={`mobile-nav-item ${location.pathname.startsWith('/journal') ? 'active' : ''}`}
                    onClick={() => navigate('/journal')}
                >
                    <span className="nav-icon">📖</span>
                </div>
                <div
                    className={`mobile-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
                    onClick={() => navigate('/profile')}
                >
                    <span className="nav-icon">👤</span>
                </div>
            </nav>
        </div>
    );
};

export default MainLayout;
