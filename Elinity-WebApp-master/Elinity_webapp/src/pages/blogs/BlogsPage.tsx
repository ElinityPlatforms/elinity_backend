import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdArrowForward, MdPerson, MdAccessTime } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { blogsApi } from '../../api/blogs';
import './BlogsPage.css';

const BlogsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: blogs, isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: blogsApi.getBlogs,
    });

    const filteredBlogs = blogs?.filter((blog: any) =>
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="blogs-content">
            {/* Header */}
            <div className="blogs-header">
                <div>
                    <h1 className="blogs-title">📚 Relationship Resources</h1>
                    <p className="blogs-subtitle">
                        Expert insights and guides for meaningful connections
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate('/blogs/create')}
                >
                    Add Article
                </Button>
            </div>

            {/* Search */}
            <div className="search-section">
                <Input
                    leftIcon={<MdSearch />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                />
            </div>

            {/* Featured Blog */}
            {blogs && blogs.length > 0 && (
                <Card variant="glass" className="featured-blog" hoverable>
                    <div className="featured-badge">Featured</div>
                    <div className="featured-content">
                        <div className="featured-text">
                            <h2 className="featured-title">{blogs[0].title}</h2>
                            <p className="featured-excerpt">
                                {blogs[0].content?.substring(0, 200)}...
                            </p>
                            <div className="featured-meta">
                                <div className="meta-item">
                                    <MdPerson />
                                    <span>{blogs[0].author?.full_name || 'Elinity Team'}</span>
                                </div>
                                <div className="meta-item">
                                    <MdAccessTime />
                                    <span>{new Date(blogs[0].created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                className="read-more-btn"
                                onClick={() => navigate(`/blogs/${blogs[0].id}`)}
                            >
                                Read Article <MdArrowForward />
                            </button>
                        </div>
                        <div className="featured-image">
                            {blogs[0].images && blogs[0].images.length > 0 ? (
                                <img src={blogs[0].images[0]} alt={blogs[0].title} />
                            ) : (
                                <div className="placeholder-image">📖</div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Blogs Grid */}
            <div className="blogs-grid">
                {isLoading ? (
                    <div className="blogs-loading">Loading articles...</div>
                ) : filteredBlogs && filteredBlogs.length > 0 ? (
                    filteredBlogs.slice(1).map((blog: any) => (
                        <Card
                            key={blog.id}
                            variant="glass"
                            className="blog-card"
                            hoverable
                            onClick={() => navigate(`/blogs/${blog.id}`)}
                        >
                            <div className="blog-image">
                                {blog.images && blog.images.length > 0 ? (
                                    <img src={blog.images[0]} alt={blog.title} />
                                ) : (
                                    <div className="placeholder-image">📝</div>
                                )}
                            </div>
                            <div className="blog-content">
                                <h3 className="blog-title">{blog.title}</h3>
                                <p className="blog-excerpt">
                                    {blog.content?.substring(0, 120)}...
                                </p>
                                <div className="blog-meta">
                                    <div className="meta-item">
                                        <MdPerson />
                                        <span>{blog.author?.full_name || 'Elinity Team'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <MdAccessTime />
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card variant="glass" className="blogs-empty">
                        <div className="empty-icon">📚</div>
                        <h3>No Articles Found</h3>
                        <p>Check back soon for new relationship insights and guides</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;
