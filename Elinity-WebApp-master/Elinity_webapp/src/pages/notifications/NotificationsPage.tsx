import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdNotifications, MdCheck, MdDelete, MdPerson, MdFavorite, MdMessage, MdEvent } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { notificationsApi } from '../../api/notifications';
import { connectionsApi } from '../../api/connections';
import './NotificationsPage.css';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all');

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationsApi.getNotifications,
    });

    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => notificationsApi.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const handleConnectionAction = async (connectionId: string, action: 'accept' | 'decline', notificationId: string) => {
        try {
            await connectionsApi.handleAction(connectionId, action);
            await markAsReadMutation.mutateAsync(notificationId);
            if (action === 'accept') {
                alert('Connection accepted!');
            }
        } catch (error) {
            console.error('Error handling connection action:', error);
            alert('Failed to process action.');
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'match':
            case 'social':
                return <MdFavorite />;
            case 'message':
                return <MdMessage />;
            case 'event':
                return <MdEvent />;
            case 'profile':
                return <MdPerson />;
            default:
                return <MdNotifications />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'match':
            case 'social':
                return '#e91e63';
            case 'message':
                return '#2196f3';
            case 'event':
                return '#ff9800';
            case 'profile':
                return '#9c27b0';
            default:
                return '#673ab7';
        }
    };


    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'unread', label: 'Unread' },
        { value: 'match', label: 'Matches' },
        { value: 'message', label: 'Messages' },
        { value: 'event', label: 'Events' },
    ];

    const filteredNotifications = notifications?.filter((notif: any) => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.read;
        return notif.type === filter;
    });

    return (
        <div className="notifications-page-content" style={{ padding: '24px' }}>
            {/* Header */}
            <div className="notifications-header">
                <div>
                    <h1 className="notifications-title">🔔 Notifications</h1>
                    <p className="notifications-subtitle">
                        Stay updated with your latest activity
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    Mark All as Read
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`filter-tab ${filter === option.value ? 'active' : ''}`}
                        onClick={() => setFilter(option.value)}
                    >
                        {option.label}
                        {option.value === 'unread' && notifications && (
                            <span className="unread-badge">
                                {notifications.filter((n: any) => !n.read).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {isLoading ? (
                    <div className="notifications-loading">Loading notifications...</div>
                ) : filteredNotifications && filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification: any) => (
                        <Card
                            key={notification.id}
                            variant="glass"
                            className={`notification-card ${!notification.read ? 'unread' : ''}`}
                            hoverable
                        >
                            <div
                                className="notification-icon"
                                style={{ background: getNotificationColor(notification.type) }}
                            >
                                {getNotificationIcon(notification.type)}
                            </div>

                            <div className="notification-content">
                                <div className="notification-title">
                                    {notification.title || 'New Notification'}
                                </div>
                                <div className="notification-message">
                                    {notification.message || notification.content}
                                </div>

                                {notification.type === 'social' && notification.notif_metadata && (() => {
                                    try {
                                        const meta = typeof notification.notif_metadata === 'string'
                                            ? JSON.parse(notification.notif_metadata)
                                            : notification.notif_metadata;

                                        if (meta.action === 'connection_request') {
                                            return (
                                                <div className="notification-custom-actions">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => handleConnectionAction(meta.connection_id, 'accept', notification.id)}
                                                    >
                                                        Accept Request
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleConnectionAction(meta.connection_id, 'decline', notification.id)}
                                                    >
                                                        Decline
                                                    </Button>
                                                </div>
                                            );
                                        }
                                        if (meta.action === 'connection_accepted') {
                                            return (
                                                <div className="notification-custom-actions">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => navigate(`/chat`)}
                                                    >
                                                        Start Chatting
                                                    </Button>
                                                </div>
                                            );
                                        }
                                    } catch (e) {
                                        console.error("Error parsing metadata", e);
                                    }
                                    return null;
                                })()}

                                <div className="notification-time">
                                    {new Date(notification.created_at).toLocaleString()}
                                </div>
                            </div>

                            <div className="notification-actions">
                                {!notification.read && (
                                    <button
                                        className="action-btn"
                                        title="Mark as read"
                                        onClick={() => markAsReadMutation.mutate(notification.id)}
                                    >
                                        <MdCheck />
                                    </button>
                                )}
                                <button className="action-btn delete" title="Delete">
                                    <MdDelete />
                                </button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card variant="glass" className="notifications-empty">
                        <div className="empty-icon">🔔</div>
                        <h3>No Notifications</h3>
                        <p>
                            {filter === 'all'
                                ? "You're all caught up! No new notifications."
                                : `No ${filter} notifications at the moment.`}
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
