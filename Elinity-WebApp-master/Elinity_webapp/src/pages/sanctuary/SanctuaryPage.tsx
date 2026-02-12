import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdSpa, MdAdd, MdCheck, MdTrendingUp, MdFavorite } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toolsApi } from '../../api/tools';
import './SanctuaryPage.css';

const SanctuaryPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [showNewRitual, setShowNewRitual] = useState(false);
    const [newRitualTitle, setNewRitualTitle] = useState('');
    const [newRitualDescription, setNewRitualDescription] = useState('');

    const { data: rituals, isLoading } = useQuery({
        queryKey: ['rituals'],
        queryFn: toolsApi.getRituals,
    });

    const { data: moodboards } = useQuery({
        queryKey: ['moodboards'],
        queryFn: toolsApi.getMoodboards,
    });

    const createRitualMutation = useMutation({
        mutationFn: toolsApi.createRitual,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rituals'] });
            setShowNewRitual(false);
            setNewRitualTitle('');
            setNewRitualDescription('');
        },
    });

    const completeRitualMutation = useMutation({
        mutationFn: (ritualId: number) => toolsApi.completeRitual(ritualId.toString()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rituals'] });
        },
    });

    const handleCreateRitual = () => {
        if (newRitualTitle.trim()) {
            createRitualMutation.mutate({
                title: newRitualTitle,
                description: newRitualDescription,
                frequency: 'daily',
            });
        }
    };

    return (
        <div className="sanctuary-page-content">
            <div className="sanctuary-header">
                <div>
                    <h1 className="sanctuary-title">🌸 Sanctuary</h1>
                    <p className="sanctuary-subtitle">
                        Your personal space for growth, reflection, and well-being
                    </p>
                </div>
            </div>

            {/* Rituals Section */}
            <section className="sanctuary-section">
                <div className="section-header">
                    <h2>Daily Rituals</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<MdAdd />}
                        onClick={() => setShowNewRitual(true)}
                    >
                        New Ritual
                    </Button>
                </div>

                {showNewRitual && (
                    <Card variant="glass" className="new-ritual-card">
                        <Input
                            label="Ritual Title"
                            value={newRitualTitle}
                            onChange={(e) => setNewRitualTitle(e.target.value)}
                            placeholder="e.g., Morning Meditation"
                        />
                        <Input
                            label="Description (optional)"
                            value={newRitualDescription}
                            onChange={(e) => setNewRitualDescription(e.target.value)}
                            placeholder="Describe your ritual..."
                        />
                        <div className="new-ritual-actions">
                            <Button variant="outline" onClick={() => setShowNewRitual(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateRitual}
                                loading={createRitualMutation.isPending}
                            >
                                Create Ritual
                            </Button>
                        </div>
                    </Card>
                )}

                <div className="rituals-grid">
                    {isLoading ? (
                        <div className="section-loading">Loading rituals...</div>
                    ) : rituals && rituals.length > 0 ? (
                        rituals.map((ritual: any) => (
                            <Card key={ritual.id} variant="glass" className="ritual-card">
                                <div className="ritual-header">
                                    <div className="ritual-icon">
                                        <MdSpa />
                                    </div>
                                    <div className="ritual-streak">
                                        <MdTrendingUp />
                                        <span>{ritual.streak || 0} day streak</span>
                                    </div>
                                </div>

                                <h3 className="ritual-title">{ritual.title}</h3>
                                {ritual.description && (
                                    <p className="ritual-description">{ritual.description}</p>
                                )}

                                <Button
                                    variant={ritual.completed_today ? 'outline' : 'primary'}
                                    fullWidth
                                    leftIcon={ritual.completed_today ? <MdCheck /> : undefined}
                                    onClick={() => !ritual.completed_today && completeRitualMutation.mutate(ritual.id)}
                                    disabled={ritual.completed_today}
                                >
                                    {ritual.completed_today ? 'Completed Today' : 'Mark Complete'}
                                </Button>
                            </Card>
                        ))
                    ) : (
                        <Card variant="glass" className="rituals-empty">
                            <div className="empty-icon">🌱</div>
                            <h3>No Rituals Yet</h3>
                            <p>Create your first daily ritual to start building healthy habits!</p>
                        </Card>
                    )}
                </div>
            </section>

            {/* Moodboards Section */}
            <section className="sanctuary-section">
                <div className="section-header">
                    <h2>Moodboards</h2>
                    <Button variant="outline" size="sm" leftIcon={<MdAdd />}>
                        New Moodboard
                    </Button>
                </div>

                <div className="moodboards-grid">
                    {moodboards && moodboards.length > 0 ? (
                        moodboards.map((moodboard: any) => (
                            <Card key={moodboard.id} variant="glass" hoverable className="moodboard-card">
                                <div className="moodboard-preview">
                                    {/* Moodboard preview would go here */}
                                    <div className="moodboard-placeholder">
                                        <MdFavorite />
                                    </div>
                                </div>
                                <h3 className="moodboard-title">{moodboard.title}</h3>
                            </Card>
                        ))
                    ) : (
                        <Card variant="glass" className="moodboards-empty">
                            <div className="empty-icon">🎨</div>
                            <h3>No Moodboards Yet</h3>
                            <p>Create a moodboard to visualize your goals and aspirations!</p>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SanctuaryPage;
