import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles ---
const AdminFeedbackStyles = () => (
    <style>{`
        .admin-feedback-wrapper {
            padding: 2.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .admin-feedback-title {
            font-size: 2rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 1.5rem;
        }
        
        .feedback-stats {
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
        
        .filter-section {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            margin-bottom: 1.5rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .filter-btn {
            padding: 0.625rem 1.25rem;
            border: 2px solid #e5e7eb;
            background: white;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            font-size: 0.875rem;
        }
        
        .filter-btn:hover {
            border-color: #4f46e5;
            color: #4f46e5;
        }
        
        .filter-btn.active {
            background: #4f46e5;
            color: white;
            border-color: #4f46e5;
        }
        
        .feedback-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .feedback-card {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .feedback-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        
        .feedback-card.resolved {
            opacity: 0.7;
            background: #f9fafb;
        }
        
        .feedback-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .feedback-header-left {
            flex: 1;
        }
        
        .feedback-subject {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 0.5rem 0;
        }
        
        .feedback-card.resolved .feedback-subject {
            text-decoration: line-through;
            color: #6b7280;
        }
        
        .feedback-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .feedback-meta-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .rating-display {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .stars {
            color: #fbbf24;
            font-size: 1rem;
        }
        
        .rating-number {
            font-weight: 600;
            color: #1f2937;
        }
        
        .feedback-body {
            padding: 1.5rem;
        }
        
        .feedback-message {
            color: #374151;
            line-height: 1.6;
            margin: 0;
            white-space: pre-wrap;
        }
        
        .feedback-card.resolved .feedback-message {
            color: #9ca3af;
        }
        
        .feedback-footer {
            padding: 1.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .user-avatar {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .user-details h4 {
            margin: 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: #1f2937;
        }
        
        .user-details p {
            margin: 0;
            font-size: 0.75rem;
            color: #6b7280;
        }
        
        .feedback-actions {
            display: flex;
            gap: 0.75rem;
        }
        
        .action-btn {
            padding: 0.625rem 1.25rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.875rem;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .resolve-btn {
            background: #10b981;
            color: white;
        }
        
        .resolve-btn:hover {
            background: #059669;
        }
        
        .unresolve-btn {
            background: #f59e0b;
            color: white;
        }
        
        .unresolve-btn:hover {
            background: #d97706;
        }
        
        .delete-btn {
            background: #ef4444;
            color: white;
        }
        
        .delete-btn:hover {
            background: #dc2626;
        }
        
        .status-badge {
            padding: 0.375rem 0.875rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-resolved {
            background: #d1fae5;
            color: #065f46;
        }
        
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
        }
        
        .empty-state svg {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1rem;
            color: #d1d5db;
        }
        
        .empty-state h3 {
            font-size: 1.25rem;
            color: #4b5563;
            margin-bottom: 0.5rem;
        }
        
        .empty-state p {
            color: #6b7280;
        }
        
        /* Delete Confirmation Modal */
        .delete-confirm-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3500;
            animation: fadeIn 0.2s ease-out;
        }
        
        .delete-confirm-modal {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            max-width: 450px;
            width: 90%;
            animation: scaleIn 0.3s ease-out;
        }
        
        .delete-confirm-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .delete-confirm-icon {
            width: 3rem;
            height: 3rem;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .delete-confirm-icon svg {
            width: 1.5rem;
            height: 1.5rem;
            color: #dc2626;
        }
        
        .delete-confirm-title {
            flex: 1;
        }
        
        .delete-confirm-title h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.125rem;
            color: #1f2937;
            font-weight: 600;
        }
        
        .delete-confirm-title p {
            margin: 0;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .delete-confirm-body {
            padding: 1.5rem;
        }
        
        .delete-confirm-body p {
            margin: 0 0 1rem 0;
            color: #4b5563;
            line-height: 1.5;
        }
        
        .feedback-details-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
        }
        
        .feedback-details-box p {
            margin: 0.5rem 0;
            font-size: 0.875rem;
            color: #1f2937;
        }
        
        .feedback-details-box strong {
            color: #4b5563;
        }
        
        .delete-confirm-footer {
            padding: 1.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .admin-feedback-wrapper {
                padding: 1rem;
            }
            
            .admin-feedback-title {
                font-size: 1.5rem;
            }
            
            .feedback-stats {
                grid-template-columns: 1fr;
            }
            
            .feedback-header {
                flex-direction: column;
            }
            
            .feedback-footer {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .feedback-actions {
                width: 100%;
            }
            
            .action-btn {
                flex: 1;
            }
        }
    `}</style>
);

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'resolved'
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        avgRating: 0
    });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [filter, feedbacks]);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/feedback');
            setFeedbacks(response.data);
            
            // Calculate stats
            const total = response.data.length;
            const pending = response.data.filter(f => !f.isResolved).length;
            const resolved = response.data.filter(f => f.isResolved).length;
            const avgRating = total > 0 
                ? (response.data.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
                : 0;
            
            setStats({ total, pending, resolved, avgRating });
        } catch (error) {
            console.error('Failed to fetch feedbacks:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        let filtered = feedbacks;
        
        if (filter === 'pending') {
            filtered = feedbacks.filter(f => !f.isResolved);
        } else if (filter === 'resolved') {
            filtered = feedbacks.filter(f => f.isResolved);
        }
        
        setFilteredFeedbacks(filtered);
    };

    const handleResolveToggle = async (feedbackId) => {
        try {
            await apiClient.put(`/feedback/${feedbackId}/resolve`);
            fetchFeedbacks();
        } catch (error) {
            console.error('Failed to toggle resolve status:', error);
        }
    };

    const handleDeleteClick = (feedback) => {
        setFeedbackToDelete(feedback);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!feedbackToDelete) return;
        
        try {
            await apiClient.delete(`/feedback/${feedbackToDelete._id}`);
            setShowDeleteConfirm(false);
            setFeedbackToDelete(null);
            fetchFeedbacks();
        } catch (error) {
            console.error('Failed to delete feedback:', error);
            setShowDeleteConfirm(false);
            // Show error as a styled element within the modal if we implement one, or just log for now
            // Since the delete modal already handles errors gracefully, we can enhance it later
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setFeedbackToDelete(null);
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

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <>
            <AdminFeedbackStyles />
            <div className="admin-feedback-wrapper">
                <h1 className="admin-feedback-title">Customer Feedback</h1>
                
                {/* Stats */}
                <div className="feedback-stats">
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: '#6366f1'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Total Feedback</h3>
                            <p className="value">{stats.total}</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: '#f59e0b'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Pending</h3>
                            <p className="value">{stats.pending}</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: '#10b981'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Resolved</h3>
                            <p className="value">{stats.resolved}</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon" style={{background: '#fbbf24'}}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Avg Rating</h3>
                            <p className="value">{stats.avgRating}</p>
                        </div>
                    </div>
                </div>
                
                {/* Filter */}
                <div className="filter-section">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Feedback
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({stats.pending})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved ({stats.resolved})
                    </button>
                </div>
                
                {/* Feedback List */}
                {loading ? (
                    <div className="empty-state">Loading feedback...</div>
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="empty-state">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3>No Feedback Found</h3>
                        <p>There are no {filter === 'all' ? '' : filter} feedback entries yet.</p>
                    </div>
                ) : (
                    <div className="feedback-list">
                        {filteredFeedbacks.map(feedback => (
                            <div key={feedback._id} className={`feedback-card ${feedback.isResolved ? 'resolved' : ''}`}>
                                <div className="feedback-header">
                                    <div className="feedback-header-left">
                                        <h3 className="feedback-subject">{feedback.subject}</h3>
                                        <div className="feedback-meta">
                                            <div className="feedback-meta-item">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatDate(feedback.createdAt)}
                                            </div>
                                            <div className="rating-display">
                                                <span className="stars">{renderStars(feedback.rating)}</span>
                                                <span className="rating-number">{feedback.rating}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`status-badge ${feedback.isResolved ? 'status-resolved' : 'status-pending'}`}>
                                        {feedback.isResolved ? 'Resolved' : 'Pending'}
                                    </span>
                                </div>
                                
                                <div className="feedback-body">
                                    <p className="feedback-message">{feedback.message}</p>
                                </div>
                                
                                <div className="feedback-footer">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {feedback.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <h4>{feedback.userName}</h4>
                                            <p>{feedback.userEmail}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="feedback-actions">
                                        {feedback.isResolved ? (
                                            <button 
                                                className="action-btn unresolve-btn"
                                                onClick={() => handleResolveToggle(feedback._id)}
                                            >
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Mark as Pending
                                            </button>
                                        ) : (
                                            <button 
                                                className="action-btn resolve-btn"
                                                onClick={() => handleResolveToggle(feedback._id)}
                                            >
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Mark as Resolved
                                            </button>
                                        )}
                                        <button 
                                            className="action-btn delete-btn"
                                            onClick={() => handleDeleteClick(feedback)}
                                        >
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && feedbackToDelete && (
                    <div className="delete-confirm-overlay">
                        <div className="delete-confirm-modal">
                            <div className="delete-confirm-header">
                                <div className="delete-confirm-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="delete-confirm-title">
                                    <h3>Delete Feedback?</h3>
                                    <p>This action cannot be undone</p>
                                </div>
                            </div>
                            <div className="delete-confirm-body">
                                <p>Are you sure you want to permanently delete this feedback?</p>
                                <div className="feedback-details-box">
                                    <p><strong>From:</strong> {feedbackToDelete.userName}</p>
                                    <p><strong>Subject:</strong> {feedbackToDelete.subject}</p>
                                    <p><strong>Rating:</strong> {'⭐'.repeat(feedbackToDelete.rating)} ({feedbackToDelete.rating}/5)</p>
                                    <p><strong>Status:</strong> {feedbackToDelete.isResolved ? 'Resolved' : 'Pending'}</p>
                                </div>
                            </div>
                            <div className="delete-confirm-footer">
                                <button 
                                    className="action-btn"
                                    style={{background: '#e5e7eb', color: '#1f2937'}}
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="action-btn delete-btn"
                                    onClick={confirmDelete}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

