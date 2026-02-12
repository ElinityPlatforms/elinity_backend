import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSend, MdInfoOutline, MdErrorOutline } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { socialApi } from '../../api/social';
import './CreatePostPage.css';

const CreatePostPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [content, setContent] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPostMutation = useMutation({
        mutationFn: (newPost: { content: string }) => socialApi.createPost(newPost.content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['social-feed'] });
            setShowSuccess(true);
            setError(null);
            // Wait 2 seconds before navigating away so user sees success
            setTimeout(() => {
                navigate('/community');
            }, 2000);
        },
        onError: (err: any) => {
            console.error('Failed to create post:', err);
            setError(err.response?.data?.detail || 'Failed to save post. Please check your connection.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (content.trim()) {
            createPostMutation.mutate({ content });
        }
    };

    // Auto-focus the textarea on mount
    useEffect(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.focus();
    }, []);

    return (
        <div className="create-post-container">
            <div className="create-post-card-wrapper">
                <div className="create-post-header">
                    <Button
                        variant="ghost"
                        leftIcon={<MdArrowBack />}
                        onClick={() => navigate('/community')}
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        Back to Community
                    </Button>
                </div>

                <div className="create-post-card">
                    <h1 className="create-post-title">Create a Post</h1>
                    <p className="create-post-subtitle">
                        Share your insights, ask a question, or inspire others.
                        Your post will be stored securely in the Elinity Social Feed.
                    </p>

                    <form className="post-form" onSubmit={handleSubmit}>
                        <div className="post-textarea-wrapper">
                            <textarea
                                className="post-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind today?"
                                disabled={createPostMutation.isPending || showSuccess}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="error-message"
                                style={{
                                    color: '#ff4d4d',
                                    background: 'rgba(255, 77, 77, 0.1)',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <MdErrorOutline size={20} />
                                {error}
                            </motion.div>
                        )}

                        <div className="post-actions">
                            <div className="char-count">
                                {content.length} characters
                            </div>

                            <AnimatePresence mode="wait">
                                {showSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="success-indicator"
                                        style={{
                                            background: 'rgba(76, 209, 55, 0.2)',
                                            color: '#4cd137',
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        ✓ Saved to Database
                                    </motion.div>
                                ) : (
                                    <button
                                        type="submit"
                                        className="submit-post-btn"
                                        disabled={!content.trim() || createPostMutation.isPending}
                                    >
                                        {createPostMutation.isPending ? 'Saving...' : 'Post to Feed'}
                                        <MdSend />
                                    </button>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>

                <div style={{
                    marginTop: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    padding: '0 24px'
                }}>
                    <MdInfoOutline size={20} />
                    <span style={{ fontSize: '13px' }}>
                        All community posts are end-to-end encrypted and visible to your network.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;
