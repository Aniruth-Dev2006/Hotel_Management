import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import Rooms from './Rooms.jsx';
import Bookings from './Bookings.jsx';
import BookingRequests from './BookingRequests.jsx';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Dashboard Styles ---
const DashboardStyles = () => (
    <style>{`
        .dashboard-wrapper {
            background-color: #f3f4f6;
            min-height: 100vh;
            padding-top: 80px; /* Space for the fixed navbar */
        }
        .summary-container {
            padding: 2.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        .dashboard-header {
            margin-bottom: 1.5rem;
        }
        .dashboard-header h1 {
            font-size: 2.25rem;
            font-weight: bold;
            color: #111827;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }
        .summary-card {
            background-color: #ffffff;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            display: flex;
            align-items: center;
        }
        .summary-card-icon {
            width: 3rem;
            height: 3rem;
            margin-right: 1.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .summary-card-icon svg {
            width: 1.5rem;
            height: 1.5rem;
            color: #ffffff;
        }
        .summary-card h3 {
            margin: 0 0 0.25rem 0;
            color: #6b7280;
            font-size: 0.875rem;
            text-transform: uppercase;
        }
        .summary-card .value {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
        }
        .data-section {
            background-color: #ffffff;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            overflow-x: auto;
        }
        .data-section-header h2 {
            font-size: 1.25rem;
            color: #1f2937;
            margin: 0;
            margin-bottom: 1rem;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 600px;
        }
        .data-table th, .data-table td {
            text-align: left;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e5e7eb;
            white-space: nowrap;
        }
        .placeholder-text {
            padding: 100px;
            text-align: center;
            font-size: 1.25rem;
            color: #6b7280;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
            .summary-container {
                padding: 1rem;
            }

            .dashboard-header h1 {
                font-size: 1.75rem;
            }

            .summary-cards {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .data-section {
                padding: 1rem;
                border-radius: 0.5rem;
            }

            .data-table {
                min-width: 500px;
            }

            .data-table th, .data-table td {
                padding: 0.5rem 0.75rem;
                font-size: 0.875rem;
            }

            .placeholder-text {
                padding: 50px 20px;
                font-size: 1rem;
            }
        }
    `}</style>
);

// --- Dashboard Summary View (Internal Component) ---
const DashboardSummary = () => {
    // UPDATED: Added totalBookings to the stats state
    const [stats, setStats] = useState({ totalRooms: 0, availableRooms: 0, pendingRequests: 0, totalBookings: 0 });
    const [ongoingBookings, setOngoingBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // UPDATED: Added a call to get ALL bookings for the total count
                const [roomsRes, activeBookingsRes, requestedBookingsRes, allBookingsRes] = await Promise.all([
                    apiClient.get('/rooms'),
                    apiClient.get('/bookings?status=Active'),
                    apiClient.get('/bookings?status=Requested'),
                    apiClient.get('/bookings') // Fetches all bookings regardless of status
                ]);
                
                const totalRooms = roomsRes.data.length;
                const availableRooms = roomsRes.data.filter(r => !r.isBooked).length;
                
                // UPDATED: Set the totalBookings count in the state
                setStats({ 
                    totalRooms, 
                    availableRooms, 
                    pendingRequests: requestedBookingsRes.data.length,
                    totalBookings: allBookingsRes.data.length 
                });
                setOngoingBookings(activeBookingsRes.data);

            } catch (error) {
                console.error("Failed to fetch summary data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const occupancyRate = stats.totalRooms > 0 ? ((stats.totalRooms - stats.availableRooms) / stats.totalRooms * 100).toFixed(0) : 0;

    if (loading) return <div className="placeholder-text">Loading dashboard...</div>;

    return (
        <div className="summary-container">
            <header className="dashboard-header"><h1>Dashboard</h1></header>
            <div className="summary-cards">
                 <div className="summary-card">
                    <div className="summary-card-icon" style={{backgroundColor: '#6366f1'}}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.39-2.456M12 11a4 4 0 110-8 4 4 0 010 8z" /></svg></div>
                    <div><h3>Total Rooms</h3><p className="value">{stats.totalRooms}</p></div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-icon" style={{backgroundColor: '#34d399'}}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    <div><h3>Available Now</h3><p className="value">{stats.availableRooms}</p></div>
                </div>
                <div className="summary-card">
                    <div className="summary-card-icon" style={{backgroundColor: '#fbbf24'}}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                    <div><h3>Occupancy</h3><p className="value">{occupancyRate}%</p></div>
                </div>
                 <div className="summary-card">
                    <div className="summary-card-icon" style={{backgroundColor: '#f87171'}}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg></div>
                    <div><h3>Pending Requests</h3><p className="value">{stats.pendingRequests}</p></div>
                </div>
                {/* ADDED: New card for Total Bookings */}
                <div className="summary-card">
                    <div className="summary-card-icon" style={{backgroundColor: '#a78bfa'}}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                    <div><h3>Total Bookings</h3><p className="value">{stats.totalBookings}</p></div>
                </div>
            </div>
            <div className="data-section">
                <div className="data-section-header"><h2>Ongoing Bookings</h2></div>
                <table className="data-table">
                    <thead><tr><th>Guest</th><th>Room</th><th>Check-In</th><th>Check-Out</th></tr></thead>
                    <tbody>
                        {ongoingBookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{booking.guestName}</td>
                                <td>{booking.room?.roomNumber || 'N/A'}</td>
                                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {ongoingBookings.length === 0 && <p style={{textAlign: 'center', padding: '1rem'}}>No ongoing bookings.</p>}
            </div>
        </div>
    );
};


// --- Main AdminDashboard Component (acts as a router) ---
export default function AdminDashboard({ onLogout }) {
    const [activeView, setActiveView] = useState('dashboard');

    const renderView = () => {
        switch (activeView) {
            case 'rooms':
                return <Rooms />;
            case 'requests':
                return <BookingRequests />;
            case 'bookings':
                 return <Bookings />;
            case 'dashboard':
            default:
                return <DashboardSummary />;
        }
    };

    return (
        <>
            <DashboardStyles />
            <Navbar onLogout={onLogout} onNavigate={setActiveView} activeView={activeView} />
            <div className="dashboard-wrapper">
                {renderView()}
            </div>
        </>
    );
}

