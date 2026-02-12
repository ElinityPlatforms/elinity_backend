import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPerson, MdAccessTime, MdShare } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { blogsApi } from '../../api/blogs';
import './BlogDetailPage.css';

const BlogDetailPage: React.FC = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const navigate = useNavigate();

    const { data: blog, isLoading } = useQuery({
        queryKey: ['blog', blogId],
        queryFn: () => blogsApi.getBlogs(),
        select: (data) => data.find((b: any) => b.id === blogId),
    });

    if (isLoading) {
        return (
            <div className="blog-detail-loading">Loading article...</div>
        );
    }

    if (!blog) {
        return (
            <div className="blog-detail-error">
                <h2>Article not found</h2>
                <Button onClick={() => navigate('/blogs')}>Back to Articles</Button>
            </div>
        );
    }

    return (
        <div className="blog-detail-content">
            {/* Header */}
            <div className="blog-detail-header">
                <Button
                    variant="ghost"
                    leftIcon={<MdArrowBack />}
                    onClick={() => navigate('/blogs')}
                >
                    Back to Articles
                </Button>
                <Button variant="outline" leftIcon={<MdShare />}>
                    Share
                </Button>
            </div>

            {/* Article */}
            <Card variant="glass" className="article-card">
                {/* Cover Image */}
                {blog.images && blog.images.length > 0 && (
                    <div className="article-cover">
                        <img src={blog.images[0]} alt={blog.title} />
                    </div>
                )}

                {/* Article Content */}
                <div className="article-content">
                    <h1 className="article-title">{blog.title}</h1>

                    <div className="article-meta">
                        <div className="meta-item">
                            <MdPerson />
                            <span>{blog.author?.full_name || 'Elinity Team'}</span>
                        </div>
                        <div className="meta-item">
                            <MdAccessTime />
                            <span>
                                {new Date(blog.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="article-body">
                        {blog.content?.split('\n').map((paragraph: string, index: number) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="article-tags">
                            {blog.tags.map((tag: string, index: number) => (
                                <span key={index} className="tag">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Related Articles */}
            <div className="related-section">
                <h2 className="section-title">Related Articles</h2>
                <div className="related-grid">
                    <Card variant="glass" className="related-card" hoverable>
                        <h4>Understanding Attachment Styles</h4>
                        <p>Learn how your attachment style affects your relationships...</p>
                    </Card>
                    <Card variant="glass" className="related-card" hoverable>
                        <h4>Communication in Modern Relationships</h4>
                        <p>Effective strategies for better communication with your partner...</p>
                    </Card>
                    <Card variant="glass" className="related-card" hoverable>
                        <h4>Building Trust and Intimacy</h4>
                        <p>Essential steps to create deeper connections...</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
