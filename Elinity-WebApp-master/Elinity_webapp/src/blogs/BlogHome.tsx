import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdArrowForwardIos } from 'react-icons/md';
import { getBlogs, searchBlogs, getBlogsByCategory } from './blogService';
import type { Blog } from './types';
import './Blogs.css';

const BlogHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    getBlogs().then(all => {
      setCategories(Array.from(new Set(all.map(b => b.category))));
    }).catch(console.error);
  }, []);

  // Fetch blogs when filters change
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        let result: Blog[] = [];
        if (searchQuery) {
          result = await searchBlogs(searchQuery);
          // If category is also selected, filter the search results client-side 
          // (or backend should handle combined filter, but current service logic is separate)
          if (selectedCategory) {
            result = result.filter(b => b.category === selectedCategory);
          }
        } else if (selectedCategory) {
          result = await getBlogsByCategory(selectedCategory);
        } else {
          result = await getBlogs();
        }
        setBlogs(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchContent, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  const filteredBlogs = blogs; // Already filtered by service/logic above

  return (
    <div className="blog-home">
      <div className="blog-header">
        <h1>Blogs & Resources</h1>
        <p>Explore articles and insights on relationships, communication, and personal growth</p>
      </div>

      {/* Search Bar */}
      <div className="blog-search-container">
        <div className="blog-search-bar">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="blog-categories">
        <button
          className={`category-tag ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blogs Grid */}
      <div className="blogs-grid">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="blog-card"
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              <div className="blog-card-image">
                <img src={blog.image} alt={blog.title} />
                <div className="blog-card-overlay">
                  <span className="category-badge">{blog.category}</span>
                </div>
              </div>
              <div className="blog-card-content">
                <div className="blog-meta">
                  <div className="blog-author">
                    <img src={blog.avatar} alt={blog.author} className="author-avatar" />
                    <div>
                      <p className="author-name">{blog.author}</p>
                      <p className="publish-date">{blog.publishedDate}</p>
                    </div>
                  </div>
                  <span className="read-time">{blog.readTime} min read</span>
                </div>
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-footer">
                  <div className="blog-stats">
                    <span>❤️ {blog.likes}</span>
                    <span>💬 {blog.commentCount}</span>
                  </div>
                  <button className="read-more">
                    Read More <MdArrowForwardIos />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-blogs">
            <p>No blogs found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHome;
