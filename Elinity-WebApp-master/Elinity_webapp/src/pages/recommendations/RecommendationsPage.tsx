import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdClose, MdLocationOn, MdWork, MdSchool, MdFilterList } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { recommendationsApi } from '../../api/recommendations';
import './RecommendationsPage.css';

const RecommendationsPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all');
    const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({});

    const toggleInsight = (id: string) => {
        setExpandedInsights(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const { data: recommendations, isLoading } = useQuery({
        queryKey: ['recommendations'],
        queryFn: recommendationsApi.getRecommendations,
    });

    const connectMutation = useMutation({
        mutationFn: (targetId: string) => recommendationsApi.sendConnectionRequest(targetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recommendations'] });
            alert('Connection request sent!');
        },
        onError: (error) => {
            console.error('Connection request failed:', error);
            alert('Failed to send connection request.');
        }
    });


    const cleanInsight = (text: string) => {
        if (!text) return '';

        // 1. Remove specific technical header block if the AI repeats it
        // Matches things like: "AI Insight for Name (ID: ...) - Match Score: 0.X"
        let cleaned = text.replace(/AI Insight for.*?(Match Score|Score):?\s*\d*\.?\d*/gi, '');

        // 2. Remove any UUIDs/IDs
        cleaned = cleaned.replace(/\(ID: [a-f0-9-]+\)/gi, '');
        cleaned = cleaned.replace(/ID: [a-f0-9-]+/gi, '');

        // 3. Remove labels like "Core Insight:", "Summary:", etc.
        cleaned = cleaned.replace(/(Core Insight|Match Summary|Reasoning|Overall Compatibility):/gi, '');

        // 4. Remove Markdown bold/italic/headers
        cleaned = cleaned.replace(/\*\*/g, '').replace(/\*/g, '').replace(/###/g, '').replace(/##/g, '').replace(/#/g, '');

        // 5. Final trim and cleanup of any leftover technical symbols or double spaces
        cleaned = cleaned.replace(/-\s*Match Score:?.*$/i, '');
        cleaned = cleaned.replace(/\s\s+/g, ' ');

        return cleaned.trim();
    };

    const filterOptions = [
        { value: 'all', label: 'All Matches' },
        { value: 'romantic', label: 'Romantic' },
        { value: 'friendship', label: 'Friendship' },
        { value: 'collaboration', label: 'Collaboration' },
    ];

    return (
        <div className="recommendations-page-content">
            {/* Header */}
            <div className="recommendations-header">
                <div>
                    <h1 className="recommendations-title">💫 Discover Connections</h1>
                    <p className="recommendations-subtitle">
                        Find people who match your values and interests
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-tabs">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`filter-tab ${filter === option.value ? 'active' : ''}`}
                            onClick={() => setFilter(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <Button variant="ghost" leftIcon={<MdFilterList />}>
                    More Filters
                </Button>
            </div>

            {/* Recommendations Grid */}
            <div className="recommendations-grid">
                {isLoading ? (
                    <div className="recommendations-loading">
                        Finding your perfect matches...
                    </div>
                ) : recommendations && recommendations.length > 0 ? (
                    recommendations.map((rec: any) => {
                        const tenant = rec.tenant;
                        const displayName = tenant.personal_info
                            ? `${tenant.personal_info.first_name} ${tenant.personal_info.last_name}`.trim() || tenant.email
                            : tenant.email;

                        return (
                            <Card key={tenant.id} variant="glass" className="recommendation-card">
                                {/* Profile Image */}
                                <div className="profile-image-container">
                                    <div className="profile-image">
                                        {tenant.profile_pictures?.[0]?.url ? (
                                            <img src={tenant.profile_pictures[0].url} alt={displayName} />
                                        ) : (
                                            displayName[0]
                                        )}
                                    </div>
                                    <div className="compatibility-badge">
                                        {Math.round((rec.score || 0) * 100)}% Match
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="profile-info">
                                    <h3 className="profile-name">{displayName}</h3>

                                    {tenant.personal_info && (
                                        <div className="profile-details">
                                            {tenant.personal_info.age && (
                                                <span>{tenant.personal_info.age} yrs</span>
                                            )}
                                            {tenant.personal_info.location && (
                                                <div className="detail-item">
                                                    <MdLocationOn />
                                                    <span>{tenant.personal_info.location}</span>
                                                </div>
                                            )}
                                            {tenant.personal_info.occupation && (
                                                <div className="detail-item">
                                                    <MdWork />
                                                    <span>{tenant.personal_info.occupation}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {rec.ai_insight && (
                                        <div className="ai-insight-box">
                                            <div className="ai-insight-title">✨ AI Insight</div>
                                            <div className="ai-insight-content">
                                                <p className={`profile-bio ${expandedInsights[tenant.id] ? 'expanded' : 'summarized'}`}>
                                                    {cleanInsight(rec.ai_insight)}
                                                </p>
                                                {rec.ai_insight.length > 180 && (
                                                    <button
                                                        className="read-more-btn"
                                                        onClick={() => toggleInsight(tenant.id)}
                                                    >
                                                        {expandedInsights[tenant.id] ? 'Read Less' : 'Read Full Insight'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Shared Interests */}
                                    {tenant.interests_and_hobbies?.interests && tenant.interests_and_hobbies.interests.length > 0 && (
                                        <div className="shared-interests">
                                            {tenant.interests_and_hobbies.interests.slice(0, 4).map((interest: string, idx: number) => (
                                                <span key={idx} className="interest-tag">
                                                    #{interest}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="profile-actions">
                                    <div className="action-buttons-container">
                                        {rec.connection_status === 'matched' || rec.connection_status === 'personal_circle' ? (
                                            <Button
                                                variant="primary"
                                                className="action-btn message-btn"
                                                onClick={() => navigate(`/chat/${tenant.id}`)}
                                                fullWidth
                                            >
                                                Send Message
                                            </Button>
                                        ) : rec.connection_status === 'pending_b' ? (
                                            <Button
                                                variant="ghost"
                                                className="action-btn pending-btn"
                                                disabled
                                                fullWidth
                                            >
                                                Request Pending
                                            </Button>
                                        ) : (
                                            <div className="discovery-actions">
                                                <button
                                                    className="discovery-btn pass-btn"
                                                    title="Pass"
                                                >
                                                    <MdClose />
                                                </button>
                                                <button
                                                    className={`discovery-btn connect-btn ${connectMutation.isPending && connectMutation.variables === tenant.id ? 'loading' : ''}`}
                                                    onClick={() => connectMutation.mutate(tenant.id)}
                                                    disabled={connectMutation.isPending}
                                                >
                                                    {connectMutation.isPending && connectMutation.variables === tenant.id ? (
                                                        'Connecting...'
                                                    ) : (
                                                        <>
                                                            <MdFavorite className="heart-icon" />
                                                            Connect
                                                        </>
                                                    )}
                                                </button>

                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })

                ) : (
                    <Card variant="glass" className="recommendations-empty">
                        <div className="empty-icon">🔍</div>
                        <h3>No Recommendations Yet</h3>
                        <p>
                            Complete your profile to get personalized recommendations
                            based on your interests and values.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/edit-profile')}
                        >
                            Complete Profile
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default RecommendationsPage;
