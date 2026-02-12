import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEvent, MdLocationOn, MdCalendarToday, MdAccessTime } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { eventsApi } from '../../api/events';
import './CreateEventPage.css';

const CreateEventPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        max_attendees: '',
    });

    const createEventMutation = useMutation({
        mutationFn: eventsApi.createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            navigate('/events');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const eventData = {
            ...formData,
            max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
            datetime: formData.date && formData.time
                ? `${formData.date}T${formData.time}`
                : undefined,
        };

        createEventMutation.mutate(eventData as any);
    };

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const isFormValid = formData.title && formData.description && formData.date && formData.time && formData.location;

    return (
        <div className="create-event-root">
            <Sidebar />

            <main className="create-event-main">
                <Topbar />

                <div className="create-event-content">
                    <div className="create-event-header">
                        <Button
                            variant="ghost"
                            leftIcon={<MdArrowBack />}
                            onClick={() => navigate('/events')}
                        >
                            Back to Events
                        </Button>
                    </div>

                    <Card variant="glass" className="create-event-card">
                        <div className="form-header">
                            <div className="form-icon">
                                <MdEvent />
                            </div>
                            <div>
                                <h1 className="form-title">🎉 Create New Event</h1>
                                <p className="form-subtitle">
                                    Bring the community together with a new event
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="event-form">
                            <div className="form-section">
                                <h3>Event Details</h3>

                                <Input
                                    label="Event Title"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="e.g., Community Meetup, Workshop, Social Gathering"
                                    required
                                />

                                <div className="form-group">
                                    <label>Event Description</label>
                                    <textarea
                                        className="event-textarea"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Describe your event, what to expect, and any special instructions..."
                                        rows={5}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Date & Time</h3>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>
                                            <MdCalendarToday /> Date
                                        </label>
                                        <input
                                            type="date"
                                            className="date-input"
                                            value={formData.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <MdAccessTime /> Time
                                        </label>
                                        <input
                                            type="time"
                                            className="time-input"
                                            value={formData.time}
                                            onChange={(e) => handleChange('time', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Location & Capacity</h3>

                                <Input
                                    label="Location"
                                    leftIcon={<MdLocationOn />}
                                    value={formData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="e.g., Online (Zoom), Coffee Shop, Park"
                                    required
                                />

                                <Input
                                    label="Maximum Attendees (Optional)"
                                    type="number"
                                    value={formData.max_attendees}
                                    onChange={(e) => handleChange('max_attendees', e.target.value)}
                                    placeholder="Leave empty for unlimited"
                                    min="1"
                                />
                            </div>

                            <div className="form-actions">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/events')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!isFormValid}
                                    loading={createEventMutation.isPending}
                                >
                                    Create Event
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default CreateEventPage;
