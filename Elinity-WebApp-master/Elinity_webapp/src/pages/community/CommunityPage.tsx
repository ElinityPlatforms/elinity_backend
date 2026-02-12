import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdChatBubbleOutline, MdFavorite, MdFavoriteBorder, MdTrendingUp, MdNewReleases, MdPerson, MdAutoAwesome, MdRefresh } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { socialApi } from '../../api/social';
import { useProfile } from '../../profiles/ProfileContext';
import { BASE_URL } from '../../api/client';
import './CommunityPage.css';

const CommunityPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useProfile();
    const [filter, setFilter] = useState('all');

    const { data: posts, isLoading } = useQuery({
        queryKey: ['social-feed'],
        queryFn: socialApi.getFeed,
    });

    const filterOptions = [
        { value: 'all', label: 'All Posts', icon: <MdTrendingUp /> },
        { value: 'trending', label: 'Trending', icon: <MdTrendingUp /> },
        { value: 'new', label: 'New', icon: <MdNewReleases /> },
    ];

    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const handleGenerateMoodscape = async (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        setGeneratingId(postId);
        try {
            await socialApi.generateMoodscape(postId);
            // Refresh feed after generation
            window.location.reload();
        } catch (error) {
            console.error("Moodscape generation failed:", error);
        } finally {
            setGeneratingId(null);
        }
    };

    return (
        <div className="community-page-content" style={{ padding: '24px' }}>
            {/* Header */}
            <div className="community-header">
                <div>
                    <h1 className="community-title">💬 Community Forum</h1>
                    <p className="community-subtitle">
                        Connect, share, and learn from the community
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<MdAdd />}
                    onClick={() => navigate('/community/post')}
                >
                    Create Post
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`filter-tab ${filter === option.value ? 'active' : ''}`}
                        onClick={() => setFilter(option.value)}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
                {isLoading ? (
                    <div className="posts-loading">
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Loading the latest shared insights...
                        </motion.div>
                    </div>
                ) : posts && posts.length > 0 ? (
                    <AnimatePresence>
                        {posts.map((post: any, index: number) => {
                            const isLiked = post.likes?.includes(profile.id);
                            const isOwnPost = post.author_id === profile.id;

                            return (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        variant="glass"
                                        hoverable
                                        clickable
                                        className="post-card"
                                        onClick={() => navigate(`/community/discussion/${post.id}`)}
                                    >
                                        <div className="post-header">
                                            <div className="post-author">
                                                <div className="author-avatar" style={{
                                                    background: isOwnPost ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                                                    border: isOwnPost ? '2px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    {post.user?.avatar ? (
                                                        <img src={post.user.avatar} alt={post.user.full_name} />
                                                    ) : (
                                                        <MdPerson />
                                                    )}
                                                </div>
                                                <div className="author-info">
                                                    <div className="author-name" style={{ color: isOwnPost ? '#a259ff' : '#fff' }}>
                                                        {isOwnPost ? 'You' : (post.user?.full_name || 'Member')}
                                                    </div>
                                                    <div className="post-time">
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="post-content">
                                            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                                            {/* AI Generated Images Display */}
                                            {post.media_urls && post.media_urls.length > 0 && (
                                                <div className="post-media-grid" style={{ marginTop: '16px' }}>
                                                    {post.media_urls.map((url: string, i: number) => (
                                                        <div key={i} className="post-media-item" style={{
                                                            borderRadius: '12px',
                                                            overflow: 'hidden',
                                                            border: '1px solid rgba(162, 89, 230, 0.2)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                        }}>
                                                            <img
                                                                src={`${BASE_URL}${url}`}
                                                                alt="Visual Perspective"
                                                                style={{ width: '100%', height: 'auto', display: 'block' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Generate Visual Button */}
                                            {(!post.media_urls || post.media_urls.length === 0) && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <button
                                                        onClick={(e) => handleGenerateMoodscape(e, post.id)}
                                                        disabled={generatingId === post.id}
                                                        className="generate-perspective-btn"
                                                        style={{
                                                            background: 'rgba(162, 89, 230, 0.1)',
                                                            color: '#a259e6',
                                                            border: '1px solid rgba(162, 89, 230, 0.3)',
                                                            borderRadius: '20px',
                                                            padding: '6px 14px',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {generatingId === post.id ? (
                                                            <>
                                                                <MdRefresh className="pulse" />
                                                                Visualizing Perspective...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MdAutoAwesome />
                                                                Generate Visual Perspective
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="post-actions">
                                            <div className={`post-action-btn ${isLiked ? 'liked' : ''}`}>
                                                {isLiked ? <MdFavorite /> : <MdFavoriteBorder />}
                                                <span>{post.likes?.length || 0} Likes</span>
                                            </div>
                                            <div className="post-action-btn">
                                                <MdChatBubbleOutline />
                                                <span>{post.comments?.length || 0} Comments</span>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                ) : (
                    <Card variant="glass" className="posts-empty">
                        <div className="empty-icon">💭</div>
                        <h3>No Posts Yet</h3>
                        <p>Be the first to start a conversation in the community!</p>
                        <Button
                            variant="primary"
                            leftIcon={<MdAdd />}
                            onClick={() => navigate('/community/post')}
                        >
                            Create First Post
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
