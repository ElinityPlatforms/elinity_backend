import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    MdSelfImprovement, MdPeople, MdFavorite, MdBook,
    MdVideogameAsset, MdForum, MdQuiz, MdArrowForward,
    MdTrendingUp, MdNotifications, MdEvent, MdPsychology, MdSchool
} from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { dashboardApi } from '../../api/dashboard';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    // Fetch dashboard data
    const { data: personalStats, isLoading } = useQuery({
        queryKey: ['dashboard', 'personal'],
        queryFn: dashboardApi.getPersonalDashboard,
    });

    const { data: dailyCard } = useQuery({
        queryKey: ['dashboard', 'daily-card'],
        queryFn: dashboardApi.getDailyCard,
    });

    const mainModules = [
        {
            icon: <MdSelfImprovement />,
            title: "Personal Sanctuary",
            subtitle: isLoading ? "Loading..." : `${personalStats?.active_rituals || 0} Active Rituals`,
            path: "/sanctuary",
            color: "#a259e6",
            gradient: "linear-gradient(135deg, #a259e6 0%, #8b3fd9 100%)"
        },
        {
            icon: <MdPeople />,
            title: "Connection Discovery",
            subtitle: "Find meaningful connections",
            path: "/recommendations",
            color: "#3a6cf6",
            gradient: "linear-gradient(135deg, #3a6cf6 0%, #2952cc 100%)"
        },
        {
            icon: <MdFavorite />,
            title: "Your Matches",
            subtitle: isLoading ? "Loading..." : `${personalStats?.total_matches || 0} Connections`,
            path: "/your-matches",
            color: "#ff6b9d",
            gradient: "linear-gradient(135deg, #ff6b9d 0%, #ff4d7d 100%)"
        },
        {
            icon: <MdBook />,
            title: "AI Journal",
            subtitle: isLoading ? "Loading..." : `${personalStats?.journal_entries || 0} Entries`,
            path: "/journal",
            color: "#ffa726",
            gradient: "linear-gradient(135deg, #ffa726 0%, #ff8f00 100%)"
        },
        {
            icon: <MdVideogameAsset />,
            title: "Connection Games",
            subtitle: "Play & connect with others",
            path: "/games",
            color: "#66bb6a",
            gradient: "linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)"
        },
        {
            icon: <MdForum />,
            title: "Community Forum",
            subtitle: "Join discussions & share",
            path: "/community",
            color: "#ab47bc",
            gradient: "linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)"
        },
        {
            icon: <MdQuiz />,
            title: "Quizzes & Insights",
            subtitle: isLoading ? "Loading..." : `${personalStats?.completed_quizzes || 0} Completed`,
            path: "/quizzes",
            color: "#26c6da",
            gradient: "linear-gradient(135deg, #26c6da 0%, #00acc1 100%)"
        },
        {
            icon: <MdPsychology />,
            title: "AI Personas",
            subtitle: "Talk to Socrates, Jung & more",
            path: "/ai-personas",
            color: "#a259e6",
            gradient: "linear-gradient(135deg, #a259e6 0%, #8b3fd9 100%)"
        },
        {
            icon: <MdSchool />,
            title: "AI Life Skills",
            subtitle: "Relationship & Growth coaching",
            path: "/skills",
            color: "#3f51b5",
            gradient: "linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)"
        }
    ];

    const quickStats = [
        {
            icon: <MdTrendingUp />,
            label: "Active Rituals",
            value: personalStats?.active_rituals || 0,
            color: "#a259e6"
        },
        {
            icon: <MdFavorite />,
            label: "Total Matches",
            value: personalStats?.total_matches || 0,
            color: "#ff6b9d"
        },
        {
            icon: <MdNotifications />,
            label: "Unread Notifications",
            value: personalStats?.unread_messages || 0,
            color: "#3a6cf6"
        },

        {
            icon: <MdEvent />,
            label: "Journal Entries",
            value: personalStats?.journal_entries || 0,
            color: "#ffa726"
        }
    ];

    return (
        <div className="dashboard-content">
            {/* Welcome Section */}
            <div className="dashboard-welcome">
                <div>
                    <h1 className="dashboard-title">Welcome back! 👋</h1>
                    <p className="dashboard-subtitle">
                        {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}!
                        Ready to continue your journey?
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-stats-grid">
                {quickStats.map((stat, index) => (
                    <Card key={index} variant="glass" className="stat-card">
                        <div className="stat-icon" style={{ color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Daily Card */}
            {dailyCard && (
                <Card variant="glass" className="daily-card">
                    <div className="daily-card-header">
                        <h3>💫 Daily Inspiration</h3>
                    </div>
                    <div className="daily-card-content">
                        <h4>{dailyCard.title}</h4>
                        <p>{dailyCard.content}</p>
                    </div>
                </Card>
            )}

            {/* Main Modules Grid */}
            <div className="modules-section">
                <h2 className="section-title">Explore Your Journey</h2>
                <div className="modules-grid">
                    {mainModules.map((module, index) => (
                        <Card
                            key={index}
                            variant="glass"
                            hoverable
                            clickable
                            className="module-card"
                            onClick={() => {
                                if (module.path === '/games') {
                                    window.location.href = 'http://136.113.118.172/auth/login';
                                } else {
                                    navigate(module.path);
                                }
                            }}
                        >
                            <div className="module-icon" style={{ background: `${module.color}20` }}>
                                <div style={{ color: module.color, fontSize: 32 }}>
                                    {module.icon}
                                </div>
                            </div>
                            <div className="module-content">
                                <h3 className="module-title">{module.title}</h3>
                                <p className="module-subtitle">{module.subtitle}</p>
                            </div>
                            <div className="module-arrow">
                                <MdArrowForward />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="quick-actions-grid">
                    <Button
                        variant="primary"
                        size="lg"
                        leftIcon={<MdPeople />}
                        onClick={() => navigate('/prompt')}
                    >
                        Set Your Priorities
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        leftIcon={<MdBook />}
                        onClick={() => navigate('/journal')}
                    >
                        Write Journal Entry
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        leftIcon={<MdVideogameAsset />}
                        onClick={() => window.location.href = 'http://136.113.118.172/auth/login'}
                    >
                        Play a Game
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        leftIcon={<MdForum />}
                        onClick={() => navigate('/community')}
                    >
                        Browse Community
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

