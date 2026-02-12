import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts, getPopularPosts, getUnansweredPosts, categories } from "./forumService";
import type { PostFilter, ForumPost } from "./types";
import "./Community.css";
import { MdAdd, MdSearch } from "react-icons/md";

export default function ForumHome() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PostFilter>("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  let posts: ForumPost[] = [];

  if (filter === "recent") {
    posts = getAllPosts();
  } else if (filter === "popular") {
    posts = getPopularPosts();
  } else if (filter === "unanswered") {
    posts = getUnansweredPosts();
  } else {
    posts = getAllPosts();
  }

  if (selectedCategory !== "all") {
    posts = posts.filter((p) => p.category === selectedCategory);
  }

  if (searchTerm) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="forum-home">
      <div className="forum-header">
        <div className="forum-title-section">
          <h1>Community & Social</h1>
          <p>Share experiences, ask questions, and connect with others</p>
        </div>
        <button
          className="btn-post-question"
          onClick={() => navigate("/community/post")}
        >
          <MdAdd size={20} />
          Post a Question
        </button>
      </div>

      <div className="forum-controls">
        <div className="search-box">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "recent" ? "active" : ""}`}
            onClick={() => setFilter("recent")}
          >
            Recent
          </button>
          <button
            className={`filter-btn ${filter === "popular" ? "active" : ""}`}
            onClick={() => setFilter("popular")}
          >
            Popular
          </button>
          <button
            className={`filter-btn ${filter === "unanswered" ? "active" : ""}`}
            onClick={() => setFilter("unanswered")}
          >
            Unanswered
          </button>
        </div>
      </div>

      <div className="forum-content">
        <aside className="forum-sidebar">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`category-btn ${selectedCategory === cat.value ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="forum-posts">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts found. Be the first to start a discussion!</p>
              <button
                className="btn-post-question"
                onClick={() => navigate("/community/post")}
              >
                <MdAdd size={20} />
                Post a Question
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="forum-post-card"
                onClick={() => navigate(`/community/discussion/${post.id}`)}
              >
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className="post-category">{post.category}</span>
                </div>

                <p className="post-excerpt">{post.content.substring(0, 150)}...</p>

                <div className="post-meta">
                  <span className="author-info">
                    <span className="author-avatar">
                      {post.authorName.split(" ")[0].charAt(0)}
                    </span>
                    <div className="author-details">
                      <span className="author-name">{post.authorName}</span>
                      <span className="post-date">
                        {post.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </span>

                  <div className="post-stats">
                    <span className="stat">
                      <span className="stat-icon">👁️</span>
                      {post.views}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">💬</span>
                      {post.commentCount}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">❤️</span>
                      {post.likes}
                    </span>
                  </div>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
