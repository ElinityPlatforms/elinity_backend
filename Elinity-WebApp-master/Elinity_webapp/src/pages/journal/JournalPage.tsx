import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdEdit, MdDelete, MdMood, MdCalendarToday, MdSearch } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { journalApi } from '../../api/journal';
import './JournalPage.css';

const JournalPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: '', tags: [] });

    const { data: journals, isLoading } = useQuery({
        queryKey: ['journals'],
        queryFn: journalApi.getJournals,
    });

    const createMutation = useMutation({
        mutationFn: journalApi.createJournal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journals'] });
            setShowCreateModal(false);
            setNewEntry({ title: '', content: '', mood: '', tags: [] });
        },
    });

    const handleCreateEntry = () => {
        if (!newEntry.content.trim()) return;
        createMutation.mutate(newEntry);
    };

    const moodEmojis: Record<string, string> = {
        happy: '😊',
        sad: '😢',
        excited: '🎉',
        anxious: '😰',
        calm: '😌',
        grateful: '🙏',
    };

    return (
        <div className="journal-page-content">
            {/* Header */}
            <div className="journal-header">
                <div>
                    <h1 className="journal-title">📖 AI Journal</h1>
                    <p className="journal-subtitle">
                        Track your thoughts, emotions, and personal growth
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<MdAdd />}
                    onClick={() => setShowCreateModal(true)}
                >
                    New Entry
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="journal-stats">
                <Card variant="glass" className="stat-card">
                    <div className="stat-icon" style={{ color: '#a259e6' }}>
                        📝
                    </div>
                    <div>
                        <div className="stat-value">{journals?.length || 0}</div>
                        <div className="stat-label">Total Entries</div>
                    </div>
                </Card>
                <Card variant="glass" className="stat-card">
                    <div className="stat-icon" style={{ color: '#3a6cf6' }}>
                        🔥
                    </div>
                    <div>
                        <div className="stat-value">7</div>
                        <div className="stat-label">Day Streak</div>
                    </div>
                </Card>
                <Card variant="glass" className="stat-card">
                    <div className="stat-icon" style={{ color: '#66bb6a' }}>
                        😊
                    </div>
                    <div>
                        <div className="stat-value">Happy</div>
                        <div className="stat-label">Recent Mood</div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <div className="journal-search">
                <Input
                    placeholder="Search your journal entries..."
                    leftIcon={<MdSearch />}
                    fullWidth
                />
            </div>

            {/* Entries Grid */}
            <div className="journal-entries">
                {isLoading ? (
                    <div className="journal-loading">Loading your journal...</div>
                ) : journals && journals.length > 0 ? (
                    journals.map((journal: any) => (
                        <Card
                            key={journal.id}
                            variant="glass"
                            hoverable
                            clickable
                            className="journal-entry-card"
                            onClick={() => navigate(`/journal/${journal.id}`)}
                        >
                            <div className="entry-header">
                                <div className="entry-date">
                                    <MdCalendarToday />
                                    <span>{new Date(journal.created_at).toLocaleDateString()}</span>
                                </div>
                                {journal.mood && (
                                    <div className="entry-mood">
                                        {moodEmojis[journal.mood] || '😊'}
                                    </div>
                                )}
                            </div>

                            {journal.title && (
                                <h3 className="entry-title">{journal.title}</h3>
                            )}

                            <p className="entry-preview">
                                {journal.content.substring(0, 150)}
                                {journal.content.length > 150 && '...'}
                            </p>

                            {journal.tags && journal.tags.length > 0 && (
                                <div className="entry-tags">
                                    {journal.tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="entry-tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="entry-actions">
                                <button className="entry-action-btn">
                                    <MdEdit /> Edit
                                </button>
                                <button className="entry-action-btn">
                                    <MdDelete /> Delete
                                </button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card variant="glass" className="journal-empty">
                        <div className="empty-icon">📔</div>
                        <h3>Start Your Journal Journey</h3>
                        <p>
                            Begin documenting your thoughts, feelings, and experiences.
                            Your first entry is just a click away!
                        </p>
                        <Button
                            variant="primary"
                            leftIcon={<MdAdd />}
                            onClick={() => setShowCreateModal(true)}
                        >
                            Create First Entry
                        </Button>
                    </Card>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <Card
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>New Journal Entry</h2>

                        <div className="modal-form">
                            <Input
                                label="Title (Optional)"
                                placeholder="Give your entry a title..."
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                fullWidth
                            />

                            <div className="form-group">
                                <label>How are you feeling?</label>
                                <div className="mood-selector">
                                    {Object.entries(moodEmojis).map(([mood, emoji]) => (
                                        <button
                                            key={mood}
                                            className={`mood-btn ${newEntry.mood === mood ? 'active' : ''}`}
                                            onClick={() => setNewEntry({ ...newEntry, mood })}
                                        >
                                            {emoji}
                                            <span>{mood}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Your Thoughts</label>
                                <textarea
                                    className="journal-textarea"
                                    placeholder="What's on your mind today?"
                                    rows={8}
                                    value={newEntry.content}
                                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleCreateEntry}
                                    loading={createMutation.isPending}
                                    disabled={!newEntry.content.trim()}
                                >
                                    Save Entry
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default JournalPage;
