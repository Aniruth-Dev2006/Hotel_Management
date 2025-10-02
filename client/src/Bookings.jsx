import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles for Bookings Page (with responsive updates) ---
const BookingsStyles = () => (
    <style>{`
        .page-container { padding: 2.5rem; max-width: 1400px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .page-header h1 { font-size: 2.25rem; font-weight: bold; color: #111827; }
        
        /* UPDATED: This container will now handle horizontal scrolling on all screen sizes */
        .data-section { background-color: #ffffff; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07); overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { text-align: left; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; vertical-align: middle; white-space: nowrap; }
        .data-table th { background-color: #f9fafb; font-size: 0.75rem; text-transform: uppercase; color: #6b7280; }
        
        /* Status Badge Styles */
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 500; font-size: 0.75rem; display: inline-block; }
        .status-Confirmed { background-color: #dbeafe; color: #1e40af; }
        .status-Active { background-color: #d1fae5; color: #065f46; }
        .status-Completed { background-color: #e5e7eb; color: #4b5563; }

        /* Action Button Styles */
        .action-btn { padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500; transition: background-color 0.2s; }
        .btn-check-in { background-color: #3b82f6; color: white; }
        .btn-check-in:hover { background-color: #2563eb; }
        .btn-check-out { background-color: #10b981; color: white; }
        .btn-check-out:hover { background-color: #059669; }

        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;}
        .modal-content { background-color: white; padding: 2rem; border-radius: 0.75rem; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h2 { margin: 0; font-size: 1.5rem; }
        .modal-body .input-group { margin-bottom: 1rem; text-align: left; }
        .modal-body .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        .modal-body .input-group input, .modal-body .input-group select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; box-sizing: border-box; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 2rem; }
        .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; }
        .btn-primary { background-color: #4f46e5; color: white; }
        .btn-secondary { background-color: #e5e7eb; color: #1f2937; }

        /* Room Details Preview in Modal */
        .room-details-preview {
            background-color: #f9fafb; border-radius: 0.5rem; padding: 1rem;
            margin-top: 1rem; border: 1px solid #e5e7eb;
        }
        .room-details-preview h4 { margin: 0 0 0.75rem 0; color: #111827; font-size: 1rem; font-weight: 600; }
        .room-details-preview img { width: 100%; height: 150px; object-fit: cover; border-radius: 0.375rem; margin-bottom: 0.75rem; }
        .room-details-preview p { margin: 0.25rem 0; font-size: 0.875rem; color: #4b5563; }

        /* Success Popup Styles */
        .success-popup-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: flex-start; justify-content: center; z-index: 3000; padding-top: 4rem; pointer-events: none; }
        .success-popup { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 1.5rem 2rem; border-radius: 0.75rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); display: flex; align-items: center; gap: 1rem; max-width: 500px; pointer-events: auto; animation: slideDown 0.4s ease-out; }
        .success-popup-icon { width: 3rem; height: 3rem; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .success-popup-icon svg { width: 2rem; height: 2rem; }
        .success-popup-content { flex: 1; }
        .success-popup-content h3 { margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600; }
        .success-popup-content p { margin: 0; font-size: 0.875rem; opacity: 0.95; }
        .success-popup-close { background: transparent; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 0.375rem; transition: background-color 0.2s; flex-shrink: 0; }
        .success-popup-close:hover { background-color: rgba(255,255,255,0.2); }
        
        @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        /* Error Modal */
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
            z-index: 3000;
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
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-20px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
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
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
                text-align: center;
            }

            .page-header h1 {
                font-size: 1.75rem;
            }
            
             .modal-content {
                width: 90%;
                padding: 1.5rem;
            }

            .data-section {
                padding: 0;
            }

            .data-table td, .data-table th {
                padding: 1rem; /* Adjust padding for smaller screens */
            }

            .success-popup {
                margin: 0 1rem;
                padding: 1.25rem 1.5rem;
            }

            .success-popup-overlay {
                padding-top: 2rem;
            }
        }
    `}</style>
);


export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newBooking, setNewBooking] = useState({
        guestName: '',
        room: '',
        checkInDate: '',
        checkOutDate: '',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, roomsRes] = await Promise.all([
                apiClient.get('/bookings?status=Confirmed,Active,Completed'),
                apiClient.get('/rooms')
            ]);
            setBookings(bookingsRes.data);
            setAvailableRooms(roomsRes.data.filter(room => !room.isBooked));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddBooking = async (e) => {
        e.preventDefault();
        if (!newBooking.room || !newBooking.guestName || !newBooking.checkInDate || !newBooking.checkOutDate) {
            setErrorMessage("Please fill out all fields before submitting.");
            setShowErrorModal(true);
            return;
        }
        try {
            await apiClient.post('/bookings/add', { ...newBooking, status: 'Requested' });
            setShowModal(false);
            setNewBooking({ guestName: '', room: '', checkInDate: '', checkOutDate: '' });
            setSelectedRoomDetails(null);
            setShowSuccessPopup(true);
            // Auto-hide after 4 seconds
            setTimeout(() => setShowSuccessPopup(false), 4000);
        } catch (error) {
            console.error("Failed to add booking request:", error);
            setErrorMessage(error.response?.data || 'Could not send booking request. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            await apiClient.put(`/bookings/${bookingId}/status`, { status });
            fetchData();
        } catch (error) {
            console.error(`Failed to update status to ${status}:`, error);
            setErrorMessage(error.response?.data || `Could not update status. Please try again.`);
            setShowErrorModal(true);
        }
    };

    const handleRoomSelect = (e) => {
        const roomId = e.target.value;
        setNewBooking({ ...newBooking, room: roomId });
        if (roomId) {
            const details = availableRooms.find(r => r._id === roomId);
            setSelectedRoomDetails(details);
        } else {
            setSelectedRoomDetails(null);
        }
    };

    if (loading) return <div className="page-container">Loading bookings...</div>;

    return (
        <>
            <BookingsStyles />
            <div className="page-container">
                <header className="page-header">
                    <h1>Manage Confirmed Bookings</h1>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        + Request New Booking
                    </button>
                </header>
                <div className="data-section">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Guest Name</th>
                                <th>Room</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>{booking.guestName}</td>
                                    <td>{booking.room ? `Room ${booking.room.roomNumber}` : 'N/A'}</td>
                                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                                    </td>
                                    <td>
                                        {booking.status === 'Confirmed' && (
                                            <button onClick={() => handleStatusUpdate(booking._id, 'Active')} className="action-btn btn-check-in">
                                                Check In
                                            </button>
                                        )}
                                        {booking.status === 'Active' && (
                                            <button onClick={() => handleStatusUpdate(booking._id, 'Completed')} className="action-btn btn-check-out">
                                                Check Out
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && <p style={{textAlign: 'center', padding: '1rem'}}>No confirmed bookings found.</p>}
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <form onSubmit={handleAddBooking}>
                                <div className="modal-header">
                                    <h2>Request New Booking</h2>
                                    <button type="button" onClick={() => { setShowModal(false); setSelectedRoomDetails(null); }}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <div className="input-group">
                                        <label htmlFor="guestName">Guest Name</label>
                                        <input id="guestName" type="text" value={newBooking.guestName} onChange={e => setNewBooking({ ...newBooking, guestName: e.target.value })} required />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="room">Room</label>
                                        <select id="room" value={newBooking.room} onChange={handleRoomSelect} required>
                                            <option value="">Select an available room</option>
                                            {availableRooms.map(room => (
                                                <option key={room._id} value={room._id}>
                                                    Room {room.roomNumber} ({room.type})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedRoomDetails && (
                                        <div className="room-details-preview">
                                            <h4>Selected Room Details</h4>
                                            <img src={selectedRoomDetails.photoUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} alt={`Room ${selectedRoomDetails.roomNumber}`} />
                                            <p><strong>Price:</strong> ₹{selectedRoomDetails.price} / night</p>
                                            <p><strong>AC:</strong> {selectedRoomDetails.hasAC ? 'Yes' : 'No'}</p>
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <label htmlFor="checkInDate">Check-In Date</label>
                                        <input id="checkInDate" type="date" value={newBooking.checkInDate} onChange={e => setNewBooking({ ...newBooking, checkInDate: e.target.value })} required />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="checkOutDate">Check-Out Date</label>
                                        <input id="checkOutDate" type="date" value={newBooking.checkOutDate} onChange={e => setNewBooking({ ...newBooking, checkOutDate: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={() => { setShowModal(false); setSelectedRoomDetails(null); }} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Send Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showSuccessPopup && (
                    <div className="success-popup-overlay">
                        <div className="success-popup">
                            <div className="success-popup-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="success-popup-content">
                                <h3>Request Created!</h3>
                                <p>Your booking request has been sent successfully and is awaiting approval.</p>
                            </div>
                            <button className="success-popup-close" onClick={() => setShowSuccessPopup(false)}>
                                &times;
                            </button>
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

