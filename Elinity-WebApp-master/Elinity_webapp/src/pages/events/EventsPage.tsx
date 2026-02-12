import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdEvent, MdLocationOn, MdPeople, MdCalendarToday } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { eventsApi } from '../../api/events';
import './EventsPage.css';

const EventsPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: eventsApi.getEvents,
    });

    return (
        <div className="events-page-root">
            <Sidebar />

            <main className="events-page-main">
                <Topbar />

                <div className="events-page-content">
                    <div className="events-header">
                        <div>
                            <h1 className="events-title">📅 Events</h1>
                            <p className="events-subtitle">
                                Discover and join community events
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            leftIcon={<MdAdd />}
                            onClick={() => navigate('/events/create')}
                        >
                            Create Event
                        </Button>
                    </div>

                    <div className="events-grid">
                        {isLoading ? (
                            <div className="events-loading">Loading events...</div>
                        ) : events && events.length > 0 ? (
                            events.map((event: any) => (
                                <Card key={event.id} variant="glass" hoverable className="event-card">
                                    <div className="event-header">
                                        <div className="event-icon">
                                            <MdEvent />
                                        </div>
                                        <div className="event-date">
                                            {new Date(event.start_time).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </div>

                                    <h3 className="event-title">{event.title}</h3>
                                    {event.description && (
                                        <p className="event-description">{event.description}</p>
                                    )}

                                    <div className="event-details">
                                        <div className="event-detail">
                                            <MdCalendarToday />
                                            <span>
                                                {new Date(event.start_time).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        {event.location && (
                                            <div className="event-detail">
                                                <MdLocationOn />
                                                <span>{event.location}</span>
                                            </div>
                                        )}
                                        <div className="event-detail">
                                            <MdPeople />
                                            <span>{event.attendees?.length || 0} attending</span>
                                        </div>
                                    </div>

                                    <Button variant="primary" fullWidth>
                                        Join Event
                                    </Button>
                                </Card>
                            ))
                        ) : (
                            <Card variant="glass" className="events-empty">
                                <div className="empty-icon">🎉</div>
                                <h3>No Events Yet</h3>
                                <p>Create an event to bring the community together!</p>
                                <Button
                                    variant="primary"
                                    leftIcon={<MdAdd />}
                                    onClick={() => navigate('/events/create')}
                                >
                                    Create Event
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventsPage;
