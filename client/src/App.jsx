import React, { useState } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard.jsx';
import UserDashboard from './UserDashboard.jsx';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded CSS Styles for App & Login ---
const AppStyles = () => (
  <style>{`
    body {
        margin: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f3f4f6;
    }
    .container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 1rem;
    }
    .login-card, .user-card {
        background-color: white;
        padding: 2.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 28rem;
    }
    .login-header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2rem;
    }
    .header-title-group h1 {
        font-size: 1.875rem;
        font-weight: bold;
        color: #111827;
    }
    .logo-icon {
        width: 2.5rem;
        height: 2.5rem;
        color: #4f46e5;
        margin-right: 0.75rem;
    }
    form .input-group {
        margin-bottom: 1.5rem;
        text-align: left;
    }
    form .input-group label {
        display: block;
        color: #4b5563;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
    }
    form .input-group input {
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        width: 100%;
        padding: 0.75rem 1rem;
        box-sizing: border-box;
    }
    .error-message { color: #ef4444; font-size: 0.875rem; margin-bottom: 1rem; }
    .success-message { color: #10b981; font-size: 0.875rem; margin-bottom: 1rem; }
    .login-button {
        background-color: #4f46e5;
        color: white;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.2s;
    }
    .login-button:hover { background-color: #4338ca; }
    .logout-button {
        background-color: #ef4444;
        color: white;
        padding: 0.6rem 1.2rem;
        border: none;
        border-radius: 0.5rem;
    }
    .switch-mode {
        margin-top: 1.5rem;
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
    }
    .switch-mode button {
        background: none;
        border: none;
        color: #4f46e5;
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;
    }
    .switch-mode button:hover {
        color: #4338ca;
    }
  `}</style>
);

// --- Login View Component ---
function LoginView({ onLoginSuccess, onSwitchToSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            onLoginSuccess(response.data.role, response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login-card">
                 <div className="login-header">
                    <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-6 0a1 1 0 001 1h2a1 1 0 001-1m-5 0v-4" /></svg>
                    <div className="header-title-group"><h1>HotelMaster Login</h1></div>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className="switch-mode">
                    Don't have an account? <button onClick={onSwitchToSignup}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}

// --- Signup View Component ---
function SignupView({ onSignupSuccess, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: 'user'
            });
            onSignupSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Email may already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login-card">
                <div className="login-header">
                    <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-6 0a1 1 0 001 1h2a1 1 0 001-1m-5 0v-4" /></svg>
                    <div className="header-title-group"><h1>Create Account</h1></div>
                </div>
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="switch-mode">
                    Already have an account? <button onClick={onSwitchToLogin}>Sign In</button>
                </div>
            </div>
        </div>
    );
}

// --- Main App Component ---
export default function App() {
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'

    const handleLoginSuccess = (role, user) => {
        setUserRole(role);
        setUserData(user);
    };
    
    const handleLogout = () => {
        setUserRole(null);
        setUserData(null);
        setCurrentView('login');
    };
    
    const handleSignupSuccess = () => {
        setCurrentView('login');
    };

    const renderContent = () => {
        // If user is logged in, show the appropriate dashboard
        if (userRole === 'admin') {
            return <AdminDashboard onLogout={handleLogout} />;
        }
        if (userRole === 'user' && userData) {
            return <UserDashboard onLogout={handleLogout} userData={userData} />;
        }

        // Otherwise show login or signup
        if (currentView === 'signup') {
            return <SignupView onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() => setCurrentView('login')} />;
        }
        return <LoginView onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setCurrentView('signup')} />;
    };

    return (
        <>
            <AppStyles />
            {renderContent()}
        </>
    );
}

