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
            alert(`Error: Could not ${newStatus.toLowerCase()} the request.`);
        }
    };

    if (loading) return <div className="page-container"><p className="placeholder-text">Loading requests...</p></div>;

    return (
        <>
            <BookingRequestsStyles />
            <div className="page-container">
                <header className="page-header">
                    <h1>Booking Requests</h1>
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request._id}>
                                        <td>{request.guestName}</td>
                                        <td>{request.room ? `Room ${request.room.roomNumber}` : 'N/A'}</td>
                                        <td>{new Date(request.checkInDate).toLocaleDateString()}</td>
                                        <td>{new Date(request.checkOutDate).toLocaleDateString()}</td>
                                        <td className="action-cell">
                                            <button onClick={() => handleRequestUpdate(request._id, 'Confirmed')} className="action-btn btn-accept">
                                                Accept
                                            </button>
                                            <button onClick={() => handleRequestUpdate(request._id, 'Rejected')} className="action-btn btn-reject">
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="placeholder-text">No pending booking requests.</p>
                    )}
                </div>
            </div>
        </>
    );
}

