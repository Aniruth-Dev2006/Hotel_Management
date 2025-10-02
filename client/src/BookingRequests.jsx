import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles for this Component (with responsive updates) ---
const BookingRequestsStyles = () => (
    <style>{`
        .page-container { padding: 2.5rem; max-width: 1400px; margin: 0 auto; }
        .page-header { margin-bottom: 2rem; }
        .page-header h1 { font-size: 2.25rem; font-weight: bold; color: #111827; }
        
        .data-section { background-color: #ffffff; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { text-align: left; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; vertical-align: middle; white-space: nowrap; }
        .data-table th { background-color: #f9fafb; font-size: 0.75rem; text-transform: uppercase; color: #6b7280; }

        .action-cell { display: flex; gap: 0.75rem; justify-content: flex-end; }
        .action-btn { padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500; transition: background-color 0.2s; }
        .btn-accept { background-color: #10b981; color: white; }
        .btn-accept:hover { background-color: #059669; }
        .btn-reject { background-color: #ef4444; color: white; }
        .btn-reject:hover { background-color: #dc2626; }
        .placeholder-text { text-align: center; padding: 2rem; color: #6b7280; font-size: 1rem; }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
        .modal-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        }
        .modal-icon {
            font-size: 2.5rem;
        }
        .modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
            margin: 0;
        }
        .modal-body {
            margin-bottom: 2rem;
            color: #4b5563;
            line-height: 1.6;
        }
        .modal-footer {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        .modal-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .modal-btn-primary {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
        }
        .modal-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }
        .modal-btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        .modal-btn-secondary:hover {
            background: #e5e7eb;
        }
        .success-box {
            background: #dcfce7;
            border: 2px solid #86efac;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }
        .success-box h3 {
            color: #15803d;
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
        }
        .success-box p {
            color: #166534;
            margin: 0;
        }
        
        .error-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.2s ease-out;
        }
        
        .error-modal-content {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            animation: slideIn 0.3s ease-out;
        }
        
        .error-modal-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .error-modal-icon {
            width: 3rem;
            height: 3rem;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .error-modal-icon svg {
            width: 1.5rem;
            height: 1.5rem;
            color: #dc2626;
        }
        
        .error-modal-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #111827;
            margin: 0;
        }
        
        .error-modal-body {
            margin-bottom: 2rem;
        }
        
        .error-modal-body p {
            color: #4b5563;
            line-height: 1.6;
            margin: 0;
        }
        
        .error-modal-footer {
            display: flex;
            justify-content: flex-end;
        }
        
        .error-modal-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            transition: all 0.2s;
        }
        
        .error-modal-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }

        /* --- Mobile Responsive Styles --- */
        @media (max-width: 768px) {
            .page-container {
                padding: 1rem;
            }
            .page-header {
                text-align: center;
            }
            .page-header h1 {
                font-size: 1.75rem;
            }
            .data-section {
                overflow-x: auto; /* Allow horizontal scrolling for the table on mobile */
                padding: 0;
            }
            .data-table {
                /* Let the table be as wide as its content */
                min-width: 600px; 
            }
        }
    `}</style>
);

export default function BookingRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cleaningUp, setCleaningUp] = useState(false);
    const [showCleanupModal, setShowCleanupModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [cleanupResult, setCleanupResult] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/bookings?status=Requested');
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch booking requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleRequestUpdate = async (bookingId, newStatus) => {
        try {
            await apiClient.put(`/bookings/${bookingId}/status`, { status: newStatus });
            fetchRequests(); // Refresh the list of requests
        } catch (error) {
            console.error(`Failed to update request to ${newStatus}:`, error);
            setErrorMessage(`Could not ${newStatus.toLowerCase()} the request. Please try again.`);
            setShowErrorModal(true);
        }
    };

    const handleCleanupOldRequests = async () => {
        setCleaningUp(true);
        try {
            const response = await apiClient.post('/bookings/cleanup-old-requests', { daysOld: 7 });
            setCleanupResult(response.data);
            setShowCleanupModal(false);
            setShowSuccessModal(true);
            fetchRequests(); // Refresh the list
        } catch (error) {
            console.error("Failed to cleanup old requests:", error);
            setShowCleanupModal(false);
            setErrorMessage('Error cleaning up old requests. Please try again.');
            setShowErrorModal(true);
        } finally {
            setCleaningUp(false);
        }
    };

    const calculateDaysPending = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) return <div className="page-container"><p className="placeholder-text">Loading requests...</p></div>;

    return (
        <>
            <BookingRequestsStyles />
            <div className="page-container">
                <header className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                    <div>
                        <h1>Booking Requests</h1>
                        {requests.length > 0 && (
                            <p style={{margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem'}}>
                                {requests.length} pending request{requests.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    {requests.length > 0 && (
                        <button 
                            onClick={() => setShowCleanupModal(true)}
                            disabled={cleaningUp}
                            style={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                padding: '0.6rem 1.2rem',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: cleaningUp ? 'not-allowed' : 'pointer',
                                fontWeight: '500',
                                opacity: cleaningUp ? 0.6 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {cleaningUp ? '🔄 Cleaning...' : '🧹 Clean Up Old Requests (7+ days)'}
                        </button>
                    )}
                </header>
                <div className="data-section">
                    {/* CORRECTED: Conditionally render table OR placeholder text */}
                    {requests.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Guest Name</th>
                                    <th>Room</th>
                                    <th>Check-In</th>
                                    <th>Check-Out</th>
                                    <th>Pending Days</th>
                                    <th>Guest Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => {
                                    const daysPending = calculateDaysPending(request.createdAt);
                                    const isOld = daysPending > 3;
                                    
                                    return (
                                        <tr key={request._id} style={isOld ? {backgroundColor: '#fef3c7'} : {}}>
                                            <td>{request.guestName}</td>
                                            <td>{request.room ? `Room ${request.room.roomNumber}` : 'N/A'}</td>
                                            <td>{new Date(request.checkInDate).toLocaleDateString()}</td>
                                            <td>{new Date(request.checkOutDate).toLocaleDateString()}</td>
                                            <td>
                                                <span style={{
                                                    color: isOld ? '#dc2626' : '#059669',
                                                    fontWeight: isOld ? '600' : '500'
                                                }}>
                                                    {daysPending} day{daysPending !== 1 ? 's' : ''}
                                                    {isOld && ' ⚠️'}
                                                </span>
                                            </td>
                                            <td style={{fontSize: '0.875rem', color: '#6b7280'}}>
                                                {request.user?.email || 'N/A'}
                                            </td>
                                            <td className="action-cell">
                                                <button onClick={() => handleRequestUpdate(request._id, 'Confirmed')} className="action-btn btn-accept">
                                                    ✓ Accept
                                                </button>
                                                <button onClick={() => handleRequestUpdate(request._id, 'Rejected')} className="action-btn btn-reject">
                                                    ✗ Reject
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="placeholder-text">✅ No pending booking requests. All caught up!</p>
                    )}
                </div>

                {/* Cleanup Confirmation Modal */}
                {showCleanupModal && (
                    <div className="modal-overlay" onClick={() => setShowCleanupModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span className="modal-icon">🧹</span>
                                <h2 className="modal-title">Clean Up Old Requests</h2>
                            </div>
                            <div className="modal-body">
                                <p style={{marginBottom: '1rem'}}>
                                    This will automatically <strong>reject all booking requests</strong> that are older than 7 days.
                                </p>
                                <p style={{
                                    background: '#fef3c7',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    borderLeft: '4px solid #f59e0b',
                                    margin: 0
                                }}>
                                    <strong>⚠️ Warning:</strong> This action cannot be undone. Affected users will be notified via the system.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="modal-btn modal-btn-secondary"
                                    onClick={() => setShowCleanupModal(false)}
                                    disabled={cleaningUp}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="modal-btn modal-btn-primary"
                                    onClick={handleCleanupOldRequests}
                                    disabled={cleaningUp}
                                >
                                    {cleaningUp ? '🔄 Processing...' : '✓ Yes, Clean Up'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && cleanupResult && (
                    <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span className="modal-icon">✅</span>
                                <h2 className="modal-title">Cleanup Completed</h2>
                            </div>
                            <div className="modal-body">
                                <div className="success-box">
                                    <h3>✨ Successfully Cleaned Up</h3>
                                    <p>
                                        {cleanupResult.cleaned > 0 
                                            ? `${cleanupResult.cleaned} old booking request${cleanupResult.cleaned !== 1 ? 's have' : ' has'} been rejected.`
                                            : 'No old requests found. System is already clean!'
                                        }
                                    </p>
                                </div>
                                {cleanupResult.cleaned > 0 && (
                                    <p style={{fontSize: '0.875rem', color: '#6b7280'}}>
                                        Affected users have been notified. The booking list has been refreshed.
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="modal-btn modal-btn-primary"
                                    onClick={() => setShowSuccessModal(false)}
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Modal */}
                {showErrorModal && (
                    <div className="error-modal-overlay" onClick={() => setShowErrorModal(false)}>
                        <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="error-modal-header">
                                <div className="error-modal-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="error-modal-title">Error</h2>
                            </div>
                            <div className="error-modal-body">
                                <p>{errorMessage}</p>
                            </div>
                            <div className="error-modal-footer">
                                <button 
                                    className="error-modal-btn"
                                    onClick={() => setShowErrorModal(false)}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

