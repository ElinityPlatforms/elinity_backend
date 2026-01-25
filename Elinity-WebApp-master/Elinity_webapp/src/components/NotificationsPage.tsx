
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdNotifications } from "react-icons/md";
import { useApiClient } from "../services/apiClient";
import "./NotificationsPage.css";

interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const fetchWithAuth = useApiClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const res = await fetchWithAuth(`${API_BASE}/notifications/`);
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                }
            } catch (err) {
                console.error("Failed to load notifications", err);
            } finally {
                setLoading(false);
            }
        };
        loadNotifications();
    }, [fetchWithAuth]);

    return (
        <div className="notifications-root">
            <div className="notifications-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <MdArrowBack />
                </button>
                <h1>Notifications</h1>
            </div>

            <div className="notifications-list">
                {loading ? (
                    <p>Loading...</p>
                ) : notifications.length === 0 ? (
                    <div className="empty-state">
                        <MdNotifications size={48} opacity={0.5} />
                        <p>No new notifications</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}>
                            <div className="notif-icon"><MdNotifications /></div>
                            <div className="notif-content">
                                <h3>{notif.title}</h3>
                                <p>{notif.message}</p>
                                <span className="notif-date">{new Date(notif.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
