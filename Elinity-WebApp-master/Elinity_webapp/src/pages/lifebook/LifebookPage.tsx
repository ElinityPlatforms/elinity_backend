import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdBook, MdAdd, MdArrowForward } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { lifebookApi } from '../../api/lifebook';
import './LifebookPage.css';

const LifebookPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['lifebook-categories'],
        queryFn: lifebookApi.getCategories,
    });

    const categoryIcons: Record<string, string> = {
        'Personal Growth': '🌱',
        'Relationships': '❤️',
        'Career': '💼',
        'Health': '🏃',
        'Memories': '📸',
        'Dreams': '✨',
        'Achievements': '🏆',
        'Reflections': '🤔',
    };

    return (
        <div className="lifebook-root">
            <Sidebar />

            <main className="lifebook-main">
                <Topbar />

                <div className="lifebook-content">
                    {/* Header */}
                    <div className="lifebook-header">
                        <div>
                            <h1 className="lifebook-title">📖 My Lifebook</h1>
                            <p className="lifebook-subtitle">
                                Document your journey, memories, and personal growth
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            leftIcon={<MdAdd />}
                            onClick={() => navigate('/lifebook/new')}
                        >
                            New Entry
                        </Button>
                    </div>

                    {/* Categories Grid */}
                    {isLoading ? (
                        <div className="lifebook-loading">Loading categories...</div>
                    ) : categories && categories.length > 0 ? (
                        <div className="categories-grid">
                            {categories.map((category: any) => (
                                <Card
                                    key={category.id}
                                    variant="glass"
                                    className="category-card"
                                    hoverable
                                    onClick={() => navigate(`/lifebook/category/${category.id}`)}
                                >
                                    <div className="category-icon">
                                        {categoryIcons[category.title] || '📝'}
                                    </div>
                                    <h3 className="category-name">{category.title}</h3>
                                    <p className="category-description">
                                        {category.description || 'Your personal reflections'}
                                    </p>
                                    <div className="category-stats">
                                        <div className="stat">
                                            <span className="stat-value">{category.entry_count || 0}</span>
                                            <span className="stat-label">Entries</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            rightIcon={<MdArrowForward />}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card variant="glass" className="lifebook-empty">
                            <div className="empty-icon">
                                <MdBook />
                            </div>
                            <h3>Start Your Lifebook</h3>
                            <p>
                                Begin documenting your journey by creating your first entry
                            </p>
                            <Button
                                variant="primary"
                                leftIcon={<MdAdd />}
                                onClick={() => navigate('/lifebook/new')}
                            >
                                Create First Entry
                            </Button>
                        </Card>
                    )}

                    {/* Recent Entries */}
                    <div className="recent-section">
                        <h2 className="section-title">Recent Entries</h2>
                        <div className="recent-entries">
                            {categories?.slice(0, 3).map((category: any) => (
                                <Card key={category.id} variant="glass" className="recent-entry-card" hoverable>
                                    <div className="entry-header">
                                        <span className="entry-icon">{categoryIcons[category.title] || '📝'}</span>
                                        <div className="entry-info">
                                            <div className="entry-category">{category.title}</div>
                                            <div className="entry-date">
                                                {new Date().toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="entry-preview">
                                        Click to view and manage your {category.title.toLowerCase()} entries
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LifebookPage;
