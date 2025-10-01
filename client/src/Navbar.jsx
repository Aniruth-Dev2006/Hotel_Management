import React, { useState } from 'react';

// --- Embedded Navbar Styles ---
const NavbarStyles = () => (
    <style>{`
        .navbar {
            background-color: #ffffff;
            color: #1f2937;
            padding: 1rem 1.5rem; /* Adjusted padding for mobile */
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            width: 100%;
            box-sizing: border-box;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
        }
        .navbar-brand {
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            font-weight: bold;
        }
        .navbar-logo {
            width: 2.25rem;
            height: 2.25rem;
            color: #4f46e5;
            margin-right: 0.75rem;
        }
        
        /* Desktop Navigation Links */
        .navbar-links-desktop {
            display: none; /* Hidden on mobile by default */
            align-items: center;
            gap: 1.5rem;
        }

        .nav-link {
            color: #4b5563;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            background: none;
            border-top: none;
            border-left: none;
            border-right: none;
            font-family: inherit;
            font-size: 1rem;
        }
        .nav-link:hover, .nav-link.active {
            color: #4f46e5;
            border-bottom-color: #4f46e5;
        }
        .logout-button-nav {
            background-color: #ef4444;
            color: white;
            font-weight: bold;
            padding: 0.6rem 1.2rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .logout-button-nav:hover {
            background-color: #dc2626;
        }

        /* Hamburger Menu Toggle */
        .navbar-toggle {
            display: block; /* Visible on mobile */
            background: none;
            border: none;
            cursor: pointer;
        }
        .navbar-toggle svg {
            width: 2rem;
            height: 2rem;
            color: #4b5563;
        }

        /* Mobile Navigation Dropdown */
        .navbar-links-mobile {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            border-top: 1px solid #e5e7eb;
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            opacity: 0;
            pointer-events: none;
        }
        .navbar-links-mobile.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        .navbar-links-mobile .nav-link, 
        .navbar-links-mobile .logout-button-nav {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.75rem 1rem;
            border-bottom: none;
        }
        .navbar-links-mobile .nav-link:hover, 
        .navbar-links-mobile .nav-link.active {
            color: #4f46e5;
            background-color: #f3f4f6;
            border-radius: 0.375rem;
        }
         .navbar-links-mobile .logout-button-nav {
            margin-top: 0.5rem;
            text-align: center;
         }

        /* Medium screens and up (Desktops) */
        @media (min-width: 768px) {
            .navbar {
                padding: 1rem 2.5rem;
            }
            .navbar-links-desktop {
                display: flex;
            }
            .navbar-toggle {
                display: none;
            }
            .navbar-links-mobile {
                display: none;
            }
        }
    `}</style>
);

// --- Navbar Component ---
export default function Navbar({ onLogout, onNavigate, activeView }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (view) => {
        onNavigate(view);
        setIsMenuOpen(false); // Close menu on navigation
    };

    return (
        <>
            <NavbarStyles />
            <nav className="navbar">
                <div className="navbar-brand">
                    <svg className="navbar-logo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-6 0a1 1 0 001 1h2a1 1 0 001-1m-5 0v-4" /></svg>
                    <span>HotelMaster</span>
                </div>
                
                {/* Desktop Links */}
                <div className="navbar-links-desktop">
                    <button onClick={() => onNavigate('dashboard')} className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}>Dashboard</button>
                    <button onClick={() => onNavigate('rooms')} className={`nav-link ${activeView === 'rooms' ? 'active' : ''}`}>Rooms</button>
                    <button onClick={() => onNavigate('requests')} className={`nav-link ${activeView === 'requests' ? 'active' : ''}`}>Booking Requests</button>
                    <button onClick={() => onNavigate('bookings')} className={`nav-link ${activeView === 'bookings' ? 'active' : ''}`}>Manage Bookings</button>
                    <button onClick={() => onNavigate('credits')} className={`nav-link ${activeView === 'credits' ? 'active' : ''}`}>Credits</button>
                    <button onClick={() => onNavigate('feedback')} className={`nav-link ${activeView === 'feedback' ? 'active' : ''}`}>Feedback</button>
                    <button onClick={() => onNavigate('notifications')} className={`nav-link ${activeView === 'notifications' ? 'active' : ''}`}>Notifications</button>
                    <button onClick={onLogout} className="logout-button-nav">Logout</button>
                </div>
                
                {/* Mobile Hamburger Toggle */}
                <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>

                {/* Mobile Links Dropdown */}
                <div className={`navbar-links-mobile ${isMenuOpen ? 'open' : ''}`}>
                    <button onClick={() => handleNavigation('dashboard')} className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}>Dashboard</button>
                    <button onClick={() => handleNavigation('rooms')} className={`nav-link ${activeView === 'rooms' ? 'active' : ''}`}>Rooms</button>
                    <button onClick={() => handleNavigation('requests')} className={`nav-link ${activeView === 'requests' ? 'active' : ''}`}>Booking Requests</button>
                    <button onClick={() => handleNavigation('bookings')} className={`nav-link ${activeView === 'bookings' ? 'active' : ''}`}>Manage Bookings</button>
                    <button onClick={() => handleNavigation('credits')} className={`nav-link ${activeView === 'credits' ? 'active' : ''}`}>Credits</button>
                    <button onClick={() => handleNavigation('feedback')} className={`nav-link ${activeView === 'feedback' ? 'active' : ''}`}>Feedback</button>
                    <button onClick={() => handleNavigation('notifications')} className={`nav-link ${activeView === 'notifications' ? 'active' : ''}`}>Notifications</button>
                    <button onClick={onLogout} className="logout-button-nav">Logout</button>
                </div>
            </nav>
        </>
    );
}

