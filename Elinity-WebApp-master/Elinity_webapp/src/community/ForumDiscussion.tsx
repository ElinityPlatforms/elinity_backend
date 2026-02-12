import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, addComment } from "./forumService";
import type { Comment } from "./types";
import "./Community.css";
import { MdArrowBack, MdThumbUp } from "react-icons/md";

export default function ForumDiscussion() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const post = postId ? getPostById(postId) : null;

  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);

  if (!post) {
    return (
      <div className="discussion-page">
        <button className="back-btn" onClick={() => navigate("/community")}>
          <MdArrowBack size={20} />
          Back to Forum
        </button>
        <div className="error-message">Post not found</div>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert("Please write a comment");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        authorName: "You",
        content: commentText,
        createdAt: new Date(),
        likes: 0,
      };

      addComment(post.id, newComment);
      setComments([...comments, newComment]);
      setCommentText("");
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="discussion-page">
      <button className="back-btn" onClick={() => navigate("/community")}>
        <MdArrowBack size={20} />
        Back to Forum
      </button>

      <div className="discussion-container">
        <article className="post-detail">
          <header className="post-detail-header">
            <h1>{post.title}</h1>
            <div className="post-detail-meta">
              <span className="author-badge">
                {post.authorName.split(" ")[0].charAt(0)}
              </span>
              <div className="author-info-detail">
                <span className="author-name">{post.authorName}</span>
                <span className="post-time">
                  {post.createdAt.toLocaleDateString()} at{" "}
                  {post.createdAt.toLocaleTimeString()}
                </span>
              </div>
              <span className="post-category-detail">{post.category}</span>
            </div>
          </header>

          <div className="post-content">
            <p>{post.content}</p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags-detail">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <footer className="post-footer">
            <div className="post-interactions">
              <button className="interaction-btn">
                <MdThumbUp size={18} />
                Like ({post.likes})
              </button>
              <span className="stat-item">
                💬 {comments.length} Comments
              </span>
              <span className="stat-item">👁️ {post.views} Views</span>
            </div>
          </footer>
        </article>

        <section className="comments-section">
          <h2>{comments.length} Comments</h2>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Share your thoughts or advice..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
            <button type="submit" className="btn-comment" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to respond!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author-avatar">
                      {comment.authorName.split(" ")[0].charAt(0)}
                    </span>
                    <div className="comment-author-info">
                      <span className="comment-author-name">
                        {comment.authorName}
                      </span>
                      <span className="comment-time">
                        {comment.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="comment-content">{comment.content}</p>

                  <div className="comment-actions">
                    <button className="comment-action-btn">
                      👍 Like ({comment.likes})
                    </button>
                    <button className="comment-action-btn">💬 Reply</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
