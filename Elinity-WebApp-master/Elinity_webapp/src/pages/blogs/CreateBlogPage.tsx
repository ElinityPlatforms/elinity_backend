import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { blogsApi } from '../../api/blogs';
import './BlogsPage.css';

const CreateBlogPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsSubmitting(true);
        try {
            await blogsApi.createBlog({
                title,
                content,
                images: imageUrl ? [imageUrl] : [],
                active: true,
            });
            navigate('/blogs');
        } catch (error) {
            console.error('Failed to create blog:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="blogs-content">
            <div className="blogs-header">
                <Button
                    variant="ghost"
                    leftIcon={<MdArrowBack />}
                    onClick={() => navigate('/blogs')}
                    style={{ marginBottom: '16px' }}
                >
                    Back to Articles
                </Button>
                <h1 className="blogs-title">Create New Article</h1>
            </div>

            <Card variant="glass" className="create-blog-card">
                <form onSubmit={handleSubmit} className="create-blog-form">
                    <div className="form-group">
                        <label>Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter article title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL (Optional)</label>
                        <Input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            className="blog-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your article content here..."
                            required
                            rows={15}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            type="submit"
                            variant="primary"
                            leftIcon={<MdSave />}
                            loading={isSubmitting}
                            disabled={!title || !content}
                        >
                            Publish Article
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateBlogPage;
