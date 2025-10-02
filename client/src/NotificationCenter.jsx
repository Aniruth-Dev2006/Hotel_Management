import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles ---
const NotificationCenterStyles = () => (
    <style>{`
        .notification-center-wrapper {
            padding: 2.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .notification-center-title {
            font-size: 2rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 1.5rem;
        }
        
        .notification-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .notification-form-section {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
        }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .section-icon {
            width: 2.5rem;
            height: 2.5rem;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .section-icon svg {
            width: 1.25rem;
            height: 1.25rem;
            color: white;
        }
        
        .section-header h2 {
            font-size: 1.5rem;
            color: #1f2937;
            margin: 0;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            box-sizing: border-box;
            font-family: inherit;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 120px;
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .recipient-selector {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .user-checkbox {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: background 0.2s;
            cursor: pointer;
        }
        
        .user-checkbox:hover {
            background: #e5e7eb;
        }
        
        .user-checkbox input {
            width: auto;
            margin-right: 0.75rem;
            cursor: pointer;
        }
        
        .user-info-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
        }
        
        .user-avatar-small {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 0.75rem;
            flex-shrink: 0;
        }
        
        .user-details-label {
            font-size: 0.875rem;
        }
        
        .user-details-label .name {
            font-weight: 600;
            color: #1f2937;
        }
        
        .user-details-label .email {
            font-size: 0.75rem;
            color: #6b7280;
        }
        
        .select-all-btn {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            transition: all 0.2s;
        }
        
        .select-all-btn:hover {
            background: #e5e7eb;
        }
        
        .send-btn {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            border: none;
            padding: 0.875rem 2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            width: 100%;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .success-message {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .success-message svg {
            width: 1.25rem;
            height: 1.25rem;
            flex-shrink: 0;
        }
        
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }
        
        .notification-history {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
        }
        
        .history-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 600px;
            overflow-y: auto;
        }
        
        .history-item {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            transition: box-shadow 0.2s;
        }
        
        .history-item:hover {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        
        .history-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.75rem;
        }
        
        .history-subject {
            font-weight: 600;
            color: #1f2937;
            font-size: 1rem;
            margin: 0;
        }
        
        .history-date {
            font-size: 0.75rem;
            color: #6b7280;
            white-space: nowrap;
        }
        
        .history-message {
            color: #4b5563;
            font-size: 0.875rem;
            margin: 0.5rem 0;
            line-height: 1.5;
        }
        
        .history-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid #e5e7eb;
        }
        
        .recipients-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            background: #dbeafe;
            color: #1e40af;
            font-weight: 600;
        }
        
        .delete-history-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.375rem 0.75rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.75rem;
            transition: background 0.2s;
        }
        
        .delete-history-btn:hover {
            background: #dc2626;
        }
        
        .empty-history {
            text-align: center;
            padding: 3rem 1rem;
            color: #6b7280;
        }
        
        .empty-history svg {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1rem;
            color: #d1d5db;
        }
        
        .empty-history h3 {
            font-size: 1.125rem;
            color: #4b5563;
            margin-bottom: 0.5rem;
        }
        
        /* Delete Confirmation Modal */
        .delete-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 4000;
            animation: fadeIn 0.2s ease-out;
        }
        
        .delete-modal-content {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 500px;
            width: 90%;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-20px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        .delete-modal-header {
            padding: 1.5rem 2rem;
            border-bottom: 2px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .delete-modal-icon {
            width: 3rem;
            height: 3rem;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .delete-modal-icon svg {
            width: 1.5rem;
            height: 1.5rem;
            color: #dc2626;
        }
        
        .delete-modal-title {
            flex: 1;
        }
        
        .delete-modal-title h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.25rem;
            color: #111827;
            font-weight: 700;
        }
        
        .delete-modal-title p {
            margin: 0;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .delete-modal-body {
            padding: 1.5rem 2rem;
        }
        
        .delete-modal-body p {
            margin: 0 0 1rem 0;
            color: #4b5563;
            line-height: 1.6;
        }
        
        .notification-details-box {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.25rem;
        }
        
        .notification-details-box p {
            margin: 0.5rem 0;
            font-size: 0.875rem;
            color: #1f2937;
        }
        
        .notification-details-box strong {
            color: #374151;
            font-weight: 600;
        }
        
        .delete-modal-footer {
            padding: 1.5rem 2rem;
            border-top: 2px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }
        
        .delete-modal-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        
        .delete-modal-btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        
        .delete-modal-btn-secondary:hover {
            background: #e5e7eb;
        }
        
        .delete-modal-btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }
        
        .delete-modal-btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        @media (max-width: 1024px) {
            .notification-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .notification-center-wrapper {
                padding: 1rem;
            }
            
            .notification-center-title {
                font-size: 1.5rem;
            }
            
            .notification-form-section,
            .notification-history {
                padding: 1.5rem;
            }
        }
    `}</style>
);

export default function NotificationCenter() {
    const [users, setUsers] = useState([]);
    const [sentNotifications, setSentNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);
    
    const [formData, setFormData] = useState({
        recipientType: 'all',
        selectedUsers: [],
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchNotificationHistory();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const fetchNotificationHistory = async () => {
        try {
            const response = await apiClient.get('/notifications/custom');
            setSentNotifications(response.data);
        } catch (err) {
            console.error('Failed to fetch notification history:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRecipientTypeChange = (e) => {
        setFormData({
            ...formData,
            recipientType: e.target.value,
            selectedUsers: []
        });
    };

    const handleUserToggle = (userId) => {
        setFormData(prev => ({
            ...prev,
            selectedUsers: prev.selectedUsers.includes(userId)
                ? prev.selectedUsers.filter(id => id !== userId)
                : [...prev.selectedUsers, userId]
        }));
    };

    const handleSelectAll = () => {
        if (formData.selectedUsers.length === users.length) {
            setFormData(prev => ({ ...prev, selectedUsers: [] }));
        } else {
            setFormData(prev => ({ ...prev, selectedUsers: users.map(u => u._id) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (formData.recipientType === 'specific' && formData.selectedUsers.length === 0) {
            setError('Please select at least one recipient.');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await apiClient.post('/notifications/send', {
                recipientType: formData.recipientType,
                recipients: formData.selectedUsers,
                subject: formData.subject,
                message: formData.message
            });
            
            setSuccess(response.data.message);
            setFormData({
                recipientType: 'all',
                selectedUsers: [],
                subject: '',
                message: ''
            });
            
            fetchNotificationHistory();
            
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send notification.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (notification) => {
        setNotificationToDelete(notification);
        setShowDeleteModal(true);
    };

    const confirmDeleteNotification = async () => {
        if (!notificationToDelete) return;
        
        try {
            await apiClient.delete(`/notifications/custom/${notificationToDelete._id}`);
            setShowDeleteModal(false);
            setNotificationToDelete(null);
            fetchNotificationHistory();
        } catch (err) {
            console.error('Failed to delete notification:', err);
            setShowDeleteModal(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <NotificationCenterStyles />
            <div className="notification-center-wrapper">
                <h1 className="notification-center-title">Notification Center</h1>
                
                <div className="notification-grid">
                    {/* Send Notification Form */}
                    <div className="notification-form-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h2>Send Notification</h2>
                        </div>
                        
                        {success && (
                            <div className="success-message">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {success}
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-message">{error}</div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Send To</label>
                                <select
                                    name="recipientType"
                                    value={formData.recipientType}
                                    onChange={handleRecipientTypeChange}
                                >
                                    <option value="all">All Users</option>
                                    <option value="specific">Specific Users</option>
                                </select>
                            </div>
                            
                            {formData.recipientType === 'specific' && (
                                <div className="form-group">
                                    <label>Select Recipients</label>
                                    <button
                                        type="button"
                                        className="select-all-btn"
                                        onClick={handleSelectAll}
                                    >
                                        {formData.selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                    <div className="recipient-selector">
                                        {users.map(user => (
                                            <label key={user._id} className="user-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.selectedUsers.includes(user._id)}
                                                    onChange={() => handleUserToggle(user._id)}
                                                />
                                                <div className="user-info-label">
                                                    <div className="user-avatar-small">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="user-details-label">
                                                        <div className="name">{user.name}</div>
                                                        <div className="email">{user.email}</div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="form-group">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Important Update, New Offer, etc."
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Type your notification message here..."
                                    required
                                />
                            </div>
                            
                            <button type="submit" className="send-btn" disabled={loading}>
                                {loading ? (
                                    <>Sending...</>
                                ) : (
                                    <>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Notification
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    
                    {/* Notification History */}
                    <div className="notification-history">
                        <div className="section-header">
                            <div className="section-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2>Notification History</h2>
                        </div>
                        
                        <div className="history-list">
                            {sentNotifications.length === 0 ? (
                                <div className="empty-history">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3>No Notifications Sent</h3>
                                    <p>Your sent notifications will appear here</p>
                                </div>
                            ) : (
                                sentNotifications.map(notification => (
                                    <div key={notification._id} className="history-item">
                                        <div className="history-header">
                                            <h3 className="history-subject">{notification.subject}</h3>
                                            <span className="history-date">{formatDate(notification.createdAt)}</span>
                                        </div>
                                        <p className="history-message">{notification.message}</p>
                                        <div className="history-footer">
                                            <span className="recipients-badge">
                                                {notification.recipientType === 'all' 
                                                    ? 'All Users' 
                                                    : `${notification.recipients.length} User(s)`}
                                            </span>
                                            <button
                                                className="delete-history-btn"
                                                onClick={() => handleDeleteClick(notification)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Delete Confirmation Modal */}
                {showDeleteModal && notificationToDelete && (
                    <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                        <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="delete-modal-header">
                                <div className="delete-modal-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="delete-modal-title">
                                    <h3>Delete Notification Record?</h3>
                                    <p>This action cannot be undone</p>
                                </div>
                            </div>
                            <div className="delete-modal-body">
                                <p>Are you sure you want to permanently delete this notification record?</p>
                                <div className="notification-details-box">
                                    <p><strong>Subject:</strong> {notificationToDelete.subject}</p>
                                    <p><strong>Message:</strong> {notificationToDelete.message}</p>
                                    <p><strong>Recipients:</strong> {notificationToDelete.recipientType === 'all' ? 'All Users' : `${notificationToDelete.recipients.length} User(s)`}</p>
                                </div>
                            </div>
                            <div className="delete-modal-footer">
                                <button 
                                    className="delete-modal-btn delete-modal-btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="delete-modal-btn delete-modal-btn-danger"
                                    onClick={confirmDeleteNotification}
                                >
                                    Yes, Delete Record
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

