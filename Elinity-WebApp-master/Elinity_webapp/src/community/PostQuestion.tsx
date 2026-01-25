import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPost, categories } from "./forumService";
import type { ForumPost } from "./types";
import "./Community.css";
import { MdArrowBack } from "react-icons/md";

export default function PostQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("other");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      const newPost: ForumPost = {
        id: `post-${Date.now()}`,
        title,
        content,
        authorName: "You",
        category,
        createdAt: new Date(),
        views: 0,
        likes: 0,
        commentCount: 0,
        comments: [],
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      addPost(newPost);
      setIsSubmitting(false);
      navigate("/community");
    }, 500);
  };

  return (
    <div className="post-question-page">
      <button className="back-btn" onClick={() => navigate("/community")}>
        <MdArrowBack size={20} />
        Back to Forum
      </button>

      <div className="post-form-container">
        <h1>Post a New Question</h1>
        <p className="form-subtitle">
          Share your thoughts and ask the community for advice
        </p>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Question Title *</label>
            <input
              id="title"
              type="text"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              disabled={isSubmitting}
            />
            <span className="char-count">{title.length}/120</span>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">Question Details *</label>
            <textarea
              id="content"
              placeholder="Provide more details about your question. Be specific and clear."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              disabled={isSubmitting}
            />
            <span className="char-count">{content.length} characters</span>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              placeholder="e.g., advice, relationships, dating"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isSubmitting}
            />
            <span className="tag-hint">Separate tags with commas</span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/community")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
