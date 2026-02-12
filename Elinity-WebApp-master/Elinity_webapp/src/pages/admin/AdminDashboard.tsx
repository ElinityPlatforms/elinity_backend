import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    MdInsights, MdTrendingUp, MdVisibility, MdFavorite,
    MdMessage, MdPsychology, MdAutoAwesome, MdArticle,
    MdMoreVert, MdArrowForward
} from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/admin';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { data: insights, isLoading, error } = useQuery({
        queryKey: ['professional-insights'],
        queryFn: adminApi.getProfessionalInsights,
    });

    React.useEffect(() => {
        if (insights) {
            console.log("Dashboard Insights Loaded:", insights);
        }
    }, [insights]);

    if (isLoading) {
        return (
            <div className="admin-loading">Analyzing your digital presence...</div>
        );
    }

    const totalEngagement = (insights?.engagement?.total_likes || 0) + (insights?.engagement?.total_comments || 0);

    return (
        <div className="admin-content">
            <div className="admin-header">
                <div className="header-badge">Creative Studio</div>
                <h1 className="admin-title">Professional Dashboard</h1>
                <p className="admin-subtitle">Track your impact, content performance, and AI-monitored growth.</p>
            </div>

            {/* Reach Summary */}
            <div className="stats-grid dashboard-stats">
                <Card variant="glass" className="stat-card p-stats">
                    <div className="stat-header">
                        <div className="stat-label">Profile Reach</div>
                        <div className="stat-trend positive">{insights?.reach?.impression_growth || '+0%'}</div>
                    </div>
                    <div className="stat-value">{insights?.reach?.profile_views || 0}</div>
                    <div className="stat-footer">Accounts reached in last 7 days</div>
                </Card>

                <Card variant="glass" className="stat-card p-stats">
                    <div className="stat-header">
                        <div className="stat-label">Engagement</div>
                        <div className="stat-trend">{insights?.engagement?.engagement_rate || '0%'}</div>
                    </div>
                    <div className="stat-value">{totalEngagement}</div>
                    <div className="stat-footer">Direct social interactions</div>
                </Card>

                <Card variant="glass" className="stat-card p-stats">
                    <div className="stat-header">
                        <div className="stat-label">Consistency Score</div>
                    </div>
                    <div className="stat-value">92%</div>
                    <div className="stat-footer">Daily ritual engagement</div>
                </Card>
            </div>

            <div className="dashboard-grid">
                {/* Lumi AI Observation Section */}
                <div className="dashboard-left">
                    <Card variant="glass" className="ai-report-card">
                        <div className="ai-report-header">
                            <div className="ai-avatar">
                                <MdAutoAwesome />
                            </div>
                            <div className="ai-title-group">
                                <h3>Lumi's Observer Report</h3>
                                <span className="live-badge">LIVE OBSERVATION</span>
                            </div>
                        </div>

                        <div className="ai-current-status">
                            <span className="vibe-label">Current Vibe:</span>
                            <span className="vibe-value">{insights?.ai_insights?.current_vibe || 'Analyzing...'}</span>
                        </div>

                        <p className="ai-summary">
                            "{insights?.ai_insights?.summary || 'Observing your journey to provide deep insights...'}"
                        </p>

                        <div className="ai-recommendation">
                            <div className="rec-icon"><MdPsychology /></div>
                            <div className="rec-text">
                                <strong>Lumi's Suggestion:</strong>
                                <p>{insights?.ai_insights?.suggested_next_move || 'Keep engaging with your daily rituals.'}</p>
                            </div>
                        </div>
                    </Card>

                    <div className="quick-actions-bar">
                        <Button variant="outline" fullWidth onClick={() => navigate('/blogs')}>
                            Manage My Articles
                        </Button>
                        <Button variant="outline" fullWidth onClick={() => navigate('/community')}>
                            View Social Insights
                        </Button>
                    </div>
                </div>

                {/* Activity & Performance Breakdown */}
                <div className="dashboard-right">
                    <Card variant="glass" className="performance-section">
                        <h3>Account Performance</h3>
                        <div className="performance-list">
                            <div className="performance-item" onClick={() => navigate('/journal')}>
                                <div className="p-item-icon journals"><MdInsights /></div>
                                <div className="p-item-info">
                                    <h4>Journals</h4>
                                    <p>{insights?.activity_metrics?.journals_completed || 0} entries this week</p>
                                </div>
                                <MdArrowForward />
                            </div>

                            <div className="performance-item" onClick={() => navigate('/my-circle')}>
                                <div className="p-item-icon matches"><MdTrendingUp /></div>
                                <div className="p-item-info">
                                    <h4>Circle Growth</h4>
                                    <p>{insights?.activity_metrics?.connections_made || 0} connections</p>
                                </div>
                                <MdArrowForward />
                            </div>

                            <div className="performance-item" onClick={() => navigate('/blogs')}>
                                <div className="p-item-icon articles"><MdArticle /></div>
                                <div className="p-item-info">
                                    <h4>Published Articles</h4>
                                    <p>{insights?.activity_metrics?.blogs_published || 0} articles</p>
                                </div>
                                <MdArrowForward />
                            </div>
                        </div>
                    </Card>

                    <Card variant="glass" className="tips-card">
                        <h3>Tip of the Day</h3>
                        <p>Profiles with more than 3 journal entries per week see a 40% increase in high-quality connection matches.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
