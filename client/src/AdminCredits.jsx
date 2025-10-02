import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles ---
const AdminCreditsStyles = () => (
    <style>{`
        .admin-credits-wrapper {
            padding: 2.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .admin-credits-title {
            font-size: 2rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 1.5rem;
        }
        
        .credits-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .tab-button {
            background: none;
            border: none;
            padding: 0.75rem 1.5rem;
            cursor: pointer;
            font-weight: 500;
            color: #6b7280;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .tab-button.active {
            color: #4f46e5;
            border-bottom-color: #4f46e5;
        }
        
        .tab-button:hover {
            color: #4f46e5;
        }
        
        .credits-stats {
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
        
        .content-section {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .section-header h2 {
            font-size: 1.5rem;
            color: #1f2937;
            margin: 0;
        }
        
        .add-btn {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.2s;
        }
        
        .add-btn:hover {
            transform: translateY(-2px);
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-family: inherit;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background: #4f46e5;
            color: white;
        }
        
        .btn-primary:hover {
            background: #4338ca;
        }
        
        .btn-secondary {
            background: #e5e7eb;
            color: #1f2937;
        }
        
        .btn-secondary:hover {
            background: #d1d5db;
        }
        
        .btn-danger {
            background: #ef4444;
            color: white;
        }
        
        .btn-danger:hover {
            background: #dc2626;
        }
        
        .table-container {
            overflow-x: auto;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 600px;
        }
        
        .data-table th,
        .data-table td {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .data-table th {
            background: #f9fafb;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: #6b7280;
            font-weight: 600;
        }
        
        .data-table tr:hover {
            background: #f9fafb;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .status-active {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-inactive {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }
        
        .action-btn {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .edit-btn {
            background: #3b82f6;
            color: white;
        }
        
        .edit-btn:hover {
            background: #2563eb;
        }
        
        .delete-btn {
            background: #ef4444;
            color: white;
        }
        
        .delete-btn:hover {
            background: #dc2626;
        }
        
        .bonus-form {
            background: #f9fafb;
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .bonus-form h3 {
            margin: 0 0 1rem 0;
            color: #1f2937;
        }
        
        .bonus-form .form-grid {
            grid-template-columns: 1fr 1fr 1fr;
        }
        
        .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #6b7280;
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
        
        .success-message {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }
        
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }
        
        /* Delete Confirmation Modal */
        .modal-overlay {
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
            z-index: 3000;
            animation: fadeIn 0.2s ease-out;
        }
        
        .modal-content {
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
        
        .modal-header {
            padding: 1.5rem 2rem;
            border-bottom: 2px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .modal-icon {
            width: 3rem;
            height: 3rem;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .modal-icon svg {
            width: 1.5rem;
            height: 1.5rem;
            color: #dc2626;
        }
        
        .modal-title {
            flex: 1;
        }
        
        .modal-title h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.25rem;
            color: #111827;
            font-weight: 700;
        }
        
        .modal-title p {
            margin: 0;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .modal-body {
            padding: 1.5rem 2rem;
        }
        
        .modal-body p {
            margin: 0 0 1rem 0;
            color: #4b5563;
            line-height: 1.6;
        }
        
        .offer-details-box {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.25rem;
        }
        
        .offer-details-box p {
            margin: 0.5rem 0;
            font-size: 0.875rem;
            color: #1f2937;
        }
        
        .offer-details-box strong {
            color: #374151;
            font-weight: 600;
        }
        
        .modal-footer {
            padding: 1.5rem 2rem;
            border-top: 2px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }
        
        .modal-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        
        .modal-btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        
        .modal-btn-secondary:hover {
            background: #e5e7eb;
        }
        
        .modal-btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }
        
        .modal-btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        @media (max-width: 768px) {
            .admin-credits-wrapper {
                padding: 1rem;
            }
            
            .admin-credits-title {
                font-size: 1.5rem;
            }
            
            .credits-stats {
                grid-template-columns: 1fr;
            }
            
            .form-grid {
                grid-template-columns: 1fr;
            }
            
            .bonus-form .form-grid {
                grid-template-columns: 1fr;
            }
            
            .content-section {
                padding: 1.5rem;
            }
        }
    `}</style>
);

export default function AdminCredits() {
    const [activeTab, setActiveTab] = useState('offers');
    const [offers, setOffers] = useState([]);
    const [credits, setCredits] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    // Form states
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [offerToDelete, setOfferToDelete] = useState(null);
    const [offerForm, setOfferForm] = useState({
        title: '',
        description: '',
        pointsRequired: '',
        discountType: 'percentage',
        discountValue: '',
        validUntil: ''
    });
    
    const [bonusForm, setBonusForm] = useState({
        userId: '',
        points: '',
        description: ''
    });

    useEffect(() => {
        if (activeTab === 'offers') {
            fetchOffers();
        } else if (activeTab === 'credits') {
            fetchCredits();
            fetchUsers();
        }
    }, [activeTab]);

    // Auto-refresh data every 10 seconds for real-time updates in admin panel
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeTab === 'offers') {
                fetchOffers();
            } else if (activeTab === 'credits') {
                fetchCredits();
            }
        }, 10000);
        
        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/offers');
            setOffers(response.data);
        } catch (err) {
            console.error('Failed to fetch offers:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCredits = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/credits');
            setCredits(response.data);
        } catch (err) {
            console.error('Failed to fetch credits:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            if (editingOffer) {
                await apiClient.put(`/offers/${editingOffer._id}`, offerForm);
                setSuccess('Offer updated successfully!');
            } else {
                await apiClient.post('/offers', offerForm);
                setSuccess('Offer created successfully!');
            }
            
            setOfferForm({
                title: '',
                description: '',
                pointsRequired: '',
                discountType: 'percentage',
                discountValue: '',
                validUntil: ''
            });
            setShowOfferForm(false);
            setEditingOffer(null);
            fetchOffers();
            
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save offer.');
        }
    };

    const handleBonusSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            await apiClient.post('/credits/bonus', bonusForm);
            setSuccess('Bonus credits added successfully!');
            setBonusForm({ userId: '', points: '', description: '' });
            fetchCredits();
            
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add bonus credits.');
        }
    };

    const handleEditOffer = (offer) => {
        setEditingOffer(offer);
        setOfferForm({
            title: offer.title,
            description: offer.description,
            pointsRequired: offer.pointsRequired.toString(),
            discountType: offer.discountType,
            discountValue: offer.discountValue.toString(),
            validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : ''
        });
        setShowOfferForm(true);
    };

    const handleDeleteClick = (offer) => {
        setOfferToDelete(offer);
        setShowDeleteModal(true);
    };

    const confirmDeleteOffer = async () => {
        if (!offerToDelete) return;
        
        try {
            await apiClient.delete(`/offers/${offerToDelete._id}`);
            setSuccess('Offer deleted successfully!');
            setShowDeleteModal(false);
            setOfferToDelete(null);
            fetchOffers();
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete offer.');
            setShowDeleteModal(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <AdminCreditsStyles />
            <div className="admin-credits-wrapper">
                <h1 className="admin-credits-title">💎 Credit System Management</h1>
                
                {success && (
                    <div className="success-message">{success}</div>
                )}
                
                {error && (
                    <div className="error-message">{error}</div>
                )}
                
                {/* Tabs */}
                <div className="credits-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'offers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('offers')}
                    >
                        Manage Offers
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'credits' ? 'active' : ''}`}
                        onClick={() => setActiveTab('credits')}
                    >
                        User Credits
                    </button>
                </div>
                
                {/* Offers Tab */}
                {activeTab === 'offers' && (
                    <div className="content-section">
                        <div className="section-header">
                            <h2>Offers Management</h2>
                            <button 
                                className="add-btn"
                                onClick={() => {
                                    setShowOfferForm(!showOfferForm);
                                    setEditingOffer(null);
                                    setOfferForm({
                                        title: '',
                                        description: '',
                                        pointsRequired: '',
                                        discountType: 'percentage',
                                        discountValue: '',
                                        validUntil: ''
                                    });
                                }}
                            >
                                {showOfferForm ? 'Cancel' : 'Add New Offer'}
                            </button>
                        </div>
                        
                        {showOfferForm && (
                            <form onSubmit={handleOfferSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Offer Title *</label>
                                        <input
                                            type="text"
                                            value={offerForm.title}
                                            onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Points Required *</label>
                                        <input
                                            type="number"
                                            value={offerForm.pointsRequired}
                                            onChange={(e) => setOfferForm({...offerForm, pointsRequired: e.target.value})}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Discount Type *</label>
                                        <select
                                            value={offerForm.discountType}
                                            onChange={(e) => setOfferForm({...offerForm, discountType: e.target.value})}
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Discount Value *</label>
                                        <input
                                            type="number"
                                            value={offerForm.discountValue}
                                            onChange={(e) => setOfferForm({...offerForm, discountValue: e.target.value})}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Valid Until</label>
                                        <input
                                            type="date"
                                            value={offerForm.validUntil}
                                            onChange={(e) => setOfferForm({...offerForm, validUntil: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        value={offerForm.description}
                                        onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowOfferForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingOffer ? 'Update Offer' : 'Create Offer'}
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        {loading ? (
                            <div className="empty-state">Loading offers...</div>
                        ) : offers.length === 0 ? (
                            <div className="empty-state">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <h3>No Offers Created</h3>
                                <p>Create your first offer to get started</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Points Required</th>
                                            <th>Discount</th>
                                            <th>Status</th>
                                            <th>Valid Until</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {offers.map(offer => (
                                            <tr key={offer._id}>
                                                <td>
                                                    <div>
                                                        <strong>{offer.title}</strong>
                                                        <p style={{margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280'}}>
                                                            {offer.description}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>{offer.pointsRequired}</td>
                                                <td>
                                                    {offer.discountType === 'percentage' 
                                                        ? `${offer.discountValue}% off`
                                                        : `₹${offer.discountValue} off`
                                                    }
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${offer.isActive ? 'status-active' : 'status-inactive'}`}>
                                                        {offer.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>{offer.validUntil ? formatDate(offer.validUntil) : 'No expiry'}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="action-btn edit-btn"
                                                            onClick={() => handleEditOffer(offer)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="action-btn delete-btn"
                                                            onClick={() => handleDeleteClick(offer)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Credits Tab */}
                {activeTab === 'credits' && (
                    <div className="content-section">
                        <div className="section-header">
                            <h2>User Credits Overview</h2>
                        </div>
                        
                        {/* Bonus Credits Form */}
                        <div className="bonus-form">
                            <h3>Add Bonus Credits</h3>
                            <form onSubmit={handleBonusSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Select User *</label>
                                        <select
                                            value={bonusForm.userId}
                                            onChange={(e) => setBonusForm({...bonusForm, userId: e.target.value})}
                                            required
                                        >
                                            <option value="">Choose a user...</option>
                                            {users.map(user => (
                                                <option key={user._id} value={user._id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Points to Add *</label>
                                        <input
                                            type="number"
                                            value={bonusForm.points}
                                            onChange={(e) => setBonusForm({...bonusForm, points: e.target.value})}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            value={bonusForm.description}
                                            onChange={(e) => setBonusForm({...bonusForm, description: e.target.value})}
                                            placeholder="e.g., Loyalty bonus, Special promotion"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Add Bonus Credits
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {loading ? (
                            <div className="empty-state">Loading credits...</div>
                        ) : credits.length === 0 ? (
                            <div className="empty-state">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3>No User Credits</h3>
                                <p>User credits will appear here as they make bookings</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Current Points</th>
                                            <th>Total Earned</th>
                                            <th>Total Redeemed</th>
                                            <th>Last Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {credits.map(credit => (
                                            <tr key={credit._id}>
                                                <td>
                                                    <div>
                                                        <strong>{credit.user.name}</strong>
                                                        <p style={{margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280'}}>
                                                            {credit.user.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{fontWeight: 'bold', color: '#4f46e5'}}>
                                                        {credit.points}
                                                    </span>
                                                </td>
                                                <td>{credit.totalEarned}</td>
                                                <td>{credit.totalRedeemed}</td>
                                                <td>{formatDate(credit.lastUpdated)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Delete Confirmation Modal */}
                {showDeleteModal && offerToDelete && (
                    <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div className="modal-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="modal-title">
                                    <h3>Delete Offer?</h3>
                                    <p>This action cannot be undone</p>
                                </div>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to permanently delete this offer?</p>
                                <div className="offer-details-box">
                                    <p><strong>Title:</strong> {offerToDelete.title}</p>
                                    <p><strong>Points Required:</strong> {offerToDelete.pointsRequired}</p>
                                    <p><strong>Discount:</strong> {offerToDelete.discountType === 'percentage' ? `${offerToDelete.discountValue}%` : `₹${offerToDelete.discountValue}`} off</p>
                                    <p><strong>Status:</strong> {offerToDelete.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="modal-btn modal-btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="modal-btn modal-btn-danger"
                                    onClick={confirmDeleteOffer}
                                >
                                    Yes, Delete Offer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

