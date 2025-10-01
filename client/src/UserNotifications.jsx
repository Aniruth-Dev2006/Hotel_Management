import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles ---
const UserNotificationsStyles = () => (
    <style>{`
        .user-notifications-wrapper {
            padding: 2.5rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .user-notifications-title {
            font-size: 2rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 0.5rem;
        }
        
        .notifications-subtitle {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 2rem;
        }
        
        .notifications-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .stat-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .stat-icon svg {
            width: 1.5rem;
            height: 1.5rem;
            color: white;
        }
        
        .stat-content h3 {
            margin: 0 0 0.25rem 0;
            color: #6b7280;
            font-size: 0.875rem;
            text-transform: uppercase;
            font-weight: 500;
        }
        
        .stat-content .value {
            font-size: 1.75rem;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
        }
        
        .notifications-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .notification-card {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            border-left: 4px solid #4f46e5;
        }
        
        .notification-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        
        .notification-card.for-all {
            border-left-color: #10b981;
        }
        
        .notification-card.for-you {
            border-left-color: #f59e0b;
        }
        
        .notification-header {
            padding: 1.5rem;
            padding-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .notification-header-left {
            flex: 1;
        }
        
        .notification-subject {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .recipient-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge-all {
            background: #d1fae5;
            color: #065f46;
        }
        
        .badge-personal {
            background: #fef3c7;
            color: #92400e;
        }
        
        .notification-date {
            font-size: 0.875rem;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .notification-date svg {
            width: 1rem;
            height: 1rem;
        }
        
        .notification-body {
            padding: 0 1.5rem 1.5rem 1.5rem;
        }
        
        .notification-message {
            color: #4b5563;
            line-height: 1.6;
            margin: 0;
            white-space: pre-wrap;
            font-size: 0.9375rem;
        }
        
        .notification-footer {
            padding: 1rem 1.5rem;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .notification-footer svg {
            width: 1.125rem;
            height: 1.125rem;
        }
        
        .empty-notifications {
            text-align: center;
            padding: 4rem 2rem;
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
        }
        
        .empty-notifications svg {
            width: 5rem;
            height: 5rem;
            margin: 0 auto 1.5rem;
            color: #d1d5db;
        }
        
        .empty-notifications h3 {
            font-size: 1.5rem;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .empty-notifications p {
            color: #6b7280;
            font-size: 1rem;
        }
        
        .loading-state {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
            font-size: 1rem;
        }
        
        .notification-type-icon {
            width: 1.25rem;
            height: 1.25rem;
            flex-shrink: 0;
        }
        
        .icon-all {
            color: #10b981;
        }
        
        .icon-personal {
            color: #f59e0b;
        }
        
        @media (max-width: 768px) {
            .user-notifications-wrapper {
                padding: 1rem;
            }
            
            .user-notifications-title {
                font-size: 1.5rem;
            }
            
            .notifications-stats {
                grid-template-columns: 1fr;
            }
            
            .notification-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .notification-subject {
                font-size: 1.125rem;
            }
        }
    `}</style>
);

export default function UserNotifications({ userData }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        forAll: 0,
        forYou: 0
    });

    useEffect(() => {
        fetchNotifications();
    }, [userData.id]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/notifications/user/${userData.id}`);
            const notifs = response.data;
            setNotifications(notifs);
            
            // Calculate stats
            const total = notifs.length;
            const forAll = notifs.filter(n => n.recipientType === 'all').length;
            const forYou = notifs.filter(n => n.recipientType === 'specific').length;
            
            setStats({ total, forAll, forYou });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            const minutes = Math.floor(diffInHours * 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    return (
        <>
            <UserNotificationsStyles />
            <div className="user-notifications-wrapper">
                <h1 className="user-notifications-title">📬 My Notifications</h1>
                <p className="notifications-subtitle">
                    Stay updated with announcements and personalized messages from HotelMaster
                </p>
                
                {/* Stats */}
                <div className="notifications-stats">
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Total</h3>
                            <p className="value">{stats.total}</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: '#10b981'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>General</h3>
                            <p className="value">{stats.forAll}</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: '#f59e0b'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Personal</h3>
                            <p className="value">{stats.forYou}</p>
                        </div>
                    </div>
                </div>
                
                {/* Notifications List */}
                {loading ? (
                    <div className="loading-state">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="empty-notifications">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3>No Notifications Yet</h3>
                        <p>You'll receive notifications from the admin here</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map(notification => (
                            <div 
                                key={notification._id} 
                                className={`notification-card ${notification.recipientType === 'all' ? 'for-all' : 'for-you'}`}
                            >
                                <div className="notification-header">
                                    <div className="notification-header-left">
                                        <h3 className="notification-subject">
                                            {notification.recipientType === 'all' ? (
                                                <svg className="notification-type-icon icon-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            ) : (
                                                <svg className="notification-type-icon icon-personal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                            {notification.subject}
                                            <span className={`recipient-badge ${notification.recipientType === 'all' ? 'badge-all' : 'badge-personal'}`}>
                                                {notification.recipientType === 'all' ? 'General' : 'Personal'}
                                            </span>
                                        </h3>
                                        <div className="notification-date">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formatDate(notification.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="notification-body">
                                    <p className="notification-message">{notification.message}</p>
                                </div>
                                
                                <div className="notification-footer">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    From: {notification.sentBy || 'HotelMaster Admin'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

