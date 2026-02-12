import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { lifebookApi } from '../../api/lifebook';
import './LifebookEntryPage.css';

const LifebookEntryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isCreating, setIsCreating] = useState(false);
    const [newEntry, setNewEntry] = useState({ title: '', content: '' });

    const { data: entries, isLoading } = useQuery({
        queryKey: ['lifebook-entries', categoryId],
        queryFn: () => lifebookApi.getEntries(categoryId!),
        enabled: !!categoryId,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => lifebookApi.createEntry({ ...data, category_id: categoryId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lifebook-entries', categoryId] });
            setIsCreating(false);
            setNewEntry({ title: '', content: '' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: lifebookApi.deleteEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lifebook-entries', categoryId] });
        },
    });

    const handleCreate = () => {
        if (newEntry.title && newEntry.content) {
            createMutation.mutate(newEntry);
        }
    };

    return (
        <div className="entry-page-root">
            <Sidebar />

            <main className="entry-page-main">
                <Topbar />

                <div className="entry-page-content">
                    {/* Header */}
                    <div className="entry-page-header">
                        <Button
                            variant="ghost"
                            leftIcon={<MdArrowBack />}
                            onClick={() => navigate('/lifebook')}
                        >
                            Back to Lifebook
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<MdAdd />}
                            onClick={() => setIsCreating(!isCreating)}
                        >
                            {isCreating ? 'Cancel' : 'New Entry'}
                        </Button>
                    </div>

                    {/* Create Entry Form */}
                    {isCreating && (
                        <Card variant="glass" className="create-entry-card">
                            <h3>Create New Entry</h3>
                            <div className="entry-form">
                                <Input
                                    label="Title"
                                    value={newEntry.title}
                                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                    placeholder="Give your entry a title..."
                                />
                                <div className="form-group">
                                    <label>Content</label>
                                    <textarea
                                        className="entry-textarea"
                                        value={newEntry.content}
                                        onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                                        placeholder="Write your thoughts, memories, or reflections..."
                                        rows={8}
                                    />
                                </div>
                                <div className="form-actions">
                                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleCreate}
                                        disabled={!newEntry.title || !newEntry.content}
                                        loading={createMutation.isPending}
                                    >
                                        Save Entry
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Entries List */}
                    <div className="entries-list">
                        {isLoading ? (
                            <div className="entries-loading">Loading entries...</div>
                        ) : entries && entries.length > 0 ? (
                            entries.map((entry: any) => (
                                <Card key={entry.id} variant="glass" className="entry-item-card">
                                    <div className="entry-item-header">
                                        <div>
                                            <h3 className="entry-item-title">{entry.title}</h3>
                                            <div className="entry-item-date">
                                                {new Date(entry.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                        <div className="entry-item-actions">
                                            <button className="icon-btn">
                                                <MdEdit />
                                            </button>
                                            <button
                                                className="icon-btn delete"
                                                onClick={() => deleteMutation.mutate(entry.id)}
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="entry-item-content">{entry.content}</p>
                                    {entry.tags && entry.tags.length > 0 && (
                                        <div className="entry-tags">
                                            {entry.tags.map((tag: string, index: number) => (
                                                <span key={index} className="tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <Card variant="glass" className="entries-empty">
                                <div className="empty-icon">📝</div>
                                <h3>No Entries Yet</h3>
                                <p>Start documenting your journey by creating your first entry</p>
                                <Button
                                    variant="primary"
                                    leftIcon={<MdAdd />}
                                    onClick={() => setIsCreating(true)}
                                >
                                    Create Entry
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LifebookEntryPage;
