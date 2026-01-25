import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { getBlogById } from './blogService';
import './Blogs.css';

const OpenBlog: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const blog = blogId ? getBlogById(blogId) : null;
  const [isLiked, setIsLiked] = useState(false);

  if (!blog) {
    return (
      <div className="blog-not-found">
        <p>Blog not found</p>
        <button onClick={() => navigate('/blogs')}>Back to Blogs</button>
      </div>
    );
  }

  return (
    <div className="open-blog">
      <button className="back-button" onClick={() => navigate('/blogs')}>
        <MdArrowBack /> Back to Blogs
      </button>

      <article className="blog-article">
        <div className="blog-article-header">
          <h1>{blog.title}</h1>
          <div className="article-meta">
            <div className="article-author">
              <img src={blog.avatar} alt={blog.author} className="author-avatar-large" />
              <div>
                <p className="author-name-large">{blog.author}</p>
                <p className="article-date">{blog.publishedDate}</p>
              </div>
            </div>
            <div className="article-stats">
              <span className="read-time">{blog.readTime} min read</span>
              <button
                className="like-button"
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? <MdFavorite /> : <MdFavoriteBorder />}
                {blog.likes + (isLiked ? 1 : 0)}
              </button>
            </div>
          </div>
        </div>

        <div className="blog-article-image">
          <img src={blog.image} alt={blog.title} />
        </div>

        <div className="blog-article-content">
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="blog-article-footer">
          <span className="category-badge-large">{blog.category}</span>
        </div>
      </article>

      {/* Comments Section */}
      <div className="blog-comments-section">
        <h2>Comments ({blog.comments.length})</h2>
        
        {blog.comments.length > 0 ? (
          <div className="comments-list">
            {blog.comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <h4>{comment.author}</h4>
                    <span className="comment-date">{comment.timestamp}</span>
                  </div>
                  <p>{comment.content}</p>
                  <div className="comment-actions">
                    <button className="like-comment">❤️ {comment.likes}</button>
                    <button className="reply-comment">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-comments">Be the first to comment!</p>
        )}

        {/* Comment Form */}
        <div className="comment-form">
          <h3>Add a Comment</h3>
          <textarea
            placeholder="Share your thoughts..."
            rows={4}
            className="comment-textarea"
          />
          <button className="submit-comment">Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default OpenBlog;
