import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFavorite, MdFavoriteBorder, MdSend, MdPerson, MdChatBubbleOutline, MdClose, MdReply } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import { socialApi } from '../../api/social';
import { useProfile } from '../../profiles/ProfileContext';
import './ForumDiscussion.css';

interface ReplyTarget {
    id: string;
    userName: string;
}

const ForumDiscussion: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { profile } = useProfile();
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Fetch the post
    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => socialApi.getPost(postId!),
        enabled: !!postId,
    });

    // Handle Likes
    const likeMutation = useMutation({
        mutationFn: () => socialApi.likePost(postId!),
        onSuccess: (updatedPost) => {
            queryClient.setQueryData(['post', postId], updatedPost);
            queryClient.invalidateQueries({ queryKey: ['social-feed'] });
        },
        onError: (err: any) => {
            console.error('Like error details:', err.response?.data || err.message);
            alert('Unable to like post. Please check your connection.');
        }
    });

    // Handle Comments
    const commentMutation = useMutation({
        mutationFn: (content: string) => socialApi.addComment(postId!, content, replyingTo?.id),
        onSuccess: (updatedPost) => {
            queryClient.setQueryData(['post', postId], updatedPost);
            queryClient.invalidateQueries({ queryKey: ['social-feed'] });
            setCommentText('');
            setReplyingTo(null);
        },
        onError: (err: any) => {
            console.error('Comment error details:', err.response?.data || err.message);
            alert('Failed to share comment. Please try again.');
        }
    });

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!likeMutation.isPending) {
            likeMutation.mutate();
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() && !commentMutation.isPending) {
            commentMutation.mutate(commentText.trim());
        }
    };

    const handleReplyClick = (commentId: string, userName: string) => {
        setReplyingTo({ id: commentId, userName });
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    // Auto-focus the textarea on load 
    useEffect(() => {
        if (post && textareaRef.current && !replyingTo) {
            // Only auto-focus on initial load if not already replying
        }
    }, [post]);

    if (isLoading) {
        return (
            <div className="discussion-page-loading">
                <div className="premium-spinner"></div>
                <p>Connecting to secure discussion...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="discussion-page-error">
                <h3>Conversation Unavailable</h3>
                <p>The post you are looking for might have been moved or you don't have access.</p>
                <Button variant="outline" onClick={() => navigate('/community')}>
                    Return to Feed
                </Button>
            </div>
        );
    }

    const currentUserId = profile?.id || 'anonymous';
    const isLiked = post.likes && post.likes.includes(currentUserId);
    const isOwner = post.author_id === currentUserId;

    // Helper to render comments and their replies
    const renderCommentsList = () => {
        if (!post.comments || post.comments.length === 0) {
            return (
                <div className="discussion-replies-empty">
                    <p>No perspectives shared yet. Be the first to start the conversation!</p>
                </div>
            );
        }

        // Filter top-level comments
        const mainComments = post.comments.filter((c: any) => !c.parent_id);

        return mainComments.map((comment: any, index: number) => (
            <div key={comment.id || index} className="comment-thread-group">
                <CommentCard
                    comment={comment}
                    currentUserId={currentUserId}
                    onReply={() => handleReplyClick(comment.id, comment.user?.full_name || 'Member')}
                />

                {/* Render replies indented */}
                {post.comments
                    .filter((c: any) => c.parent_id === comment.id)
                    .map((reply: any, rIdx: number) => (
                        <div key={reply.id || rIdx} className="nested-reply-wrapper">
                            <CommentCard
                                comment={reply}
                                currentUserId={currentUserId}
                                isReply
                            />
                        </div>
                    ))
                }
            </div>
        ));
    };

    return (
        <div className="discussion-page-wrapper">
            <div className="discussion-max-width">
                <header className="discussion-nav-header">
                    <button
                        className="back-control-btn"
                        onClick={() => navigate('/community')}
                    >
                        <MdArrowBack /> <span>Back to Feed</span>
                    </button>
                </header>

                <main className="discussion-content-thread">
                    <Card variant="glass" className="discussion-thread-starter">
                        <div className="discussion-post-header">
                            <div className="author-identity">
                                <div className="author-img-ring">
                                    {post.user?.avatar ? (
                                        <img src={post.user.avatar} alt={post.user.full_name} />
                                    ) : (
                                        <MdPerson />
                                    )}
                                </div>
                                <div className="author-text-meta">
                                    <h2 className="author-display-name">
                                        {isOwner ? 'You' : (post.user?.full_name || 'Community Member')}
                                    </h2>
                                    <span className="post-date-tag">
                                        Shared on {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="discussion-post-body">
                            {post.content}
                        </div>

                        <div className="discussion-post-interactions">
                            <button
                                type="button"
                                className={`discussion-interaction-btn ${isLiked ? 'active-liked' : ''}`}
                                onClick={handleLikeClick}
                                disabled={likeMutation.isPending}
                            >
                                {isLiked ? <MdFavorite color="#ff2d55" /> : <MdFavoriteBorder />}
                                <span>{post.likes?.length || 0} Likes</span>
                            </button>
                            <div className="discussion-interaction-info">
                                <MdChatBubbleOutline />
                                <span>{post.comments?.length || 0} Comments</span>
                            </div>
                        </div>
                    </Card>

                    <section className="discussion-reply-area">
                        <h3 className="discussion-reply-title">
                            {replyingTo ? `Replying to ${replyingTo.userName}` : 'Your Contribution'}
                        </h3>

                        <Card variant="glass" className="discussion-reply-compose">
                            <form onSubmit={handleCommentSubmit} className="reply-form-container">
                                {replyingTo && (
                                    <div className="active-reply-badge">
                                        <span>Replying to {replyingTo.userName}</span>
                                        <button type="button" onClick={cancelReply} className="cancel-reply-btn">
                                            <MdClose />
                                        </button>
                                    </div>
                                )}
                                <textarea
                                    id="discussion-comment-input"
                                    name="comment-content"
                                    ref={textareaRef}
                                    className="discussion-reply-textarea"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder={replyingTo ? "Write your reply..." : "Add depth to this discussion..."}
                                    rows={4}
                                    style={{ pointerEvents: 'auto', userSelect: 'text' }}
                                />
                                <div className="discussion-reply-footer">
                                    <span className="discussion-char-count">{commentText.length} characters</span>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        leftIcon={<MdSend />}
                                        disabled={!commentText.trim() || commentMutation.isPending}
                                        loading={commentMutation.isPending}
                                    >
                                        {replyingTo ? 'Post Reply' : 'Share Perspective'}
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <div className="discussion-replies-list">
                            <AnimatePresence>
                                {renderCommentsList()}
                            </AnimatePresence>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

// Sub-component for individual comments to keep main component clean
const CommentCard = ({ comment, currentUserId, onReply, isReply = false }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card variant="glass" className={`discussion-reply-item ${isReply ? 'is-nested' : ''}`}>
                <div className="reply-author-row">
                    <div className={`reply-author-avatar-${isReply ? 'xs' : 'small'}`}>
                        {comment.user?.avatar ? (
                            <img src={comment.user.avatar} alt={comment.user.full_name} />
                        ) : (
                            <MdPerson />
                        )}
                    </div>
                    <div className="reply-author-meta-info">
                        <span className="reply-author-name-text">
                            {comment.user_id === currentUserId ? 'You' : (comment.user?.full_name || 'Member')}
                        </span>
                        <span className="reply-date-label">
                            {new Date(comment.created_at).toLocaleString()}
                        </span>
                    </div>
                    {!isReply && onReply && (
                        <button className="inline-reply-btn" onClick={onReply}>
                            <MdReply /> Reply
                        </button>
                    )}
                </div>
                <div className="reply-content-text">
                    {comment.content}
                </div>
            </Card>
        </motion.div>
    );
};

export default ForumDiscussion;
