import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles ---
const UserCreditsStyles = () => (
    <style>{`
        .user-credits-wrapper {
            padding: 2.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .user-credits-title {
            font-size: 2rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 0.5rem;
        }
        
        .credits-subtitle {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 2rem;
        }
        
        .credits-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .credit-card {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .credit-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }
        
        .credit-card.current {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
        }
        
        .credit-card.current::before {
            display: none;
        }
        
        .credit-icon {
            width: 3rem;
            height: 3rem;
            margin: 0 auto 1rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .credit-card.current .credit-icon {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .credit-card:not(.current) .credit-icon {
            background: #f3f4f6;
            color: #4f46e5;
        }
        
        .credit-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 0.5rem 0;
        }
        
        .credit-label {
            font-size: 0.875rem;
            opacity: 0.8;
            margin: 0;
        }
        
        .credits-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .offers-section, .transactions-section {
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
        
        .offers-grid {
            display: grid;
            gap: 1rem;
        }
        
        .offer-card {
            border: 2px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            transition: all 0.2s;
            position: relative;
        }
        
        .offer-card:hover {
            border-color: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        
        .offer-card.affordable {
            border-color: #10b981;
            background: #f0fdf4;
        }
        
        .offer-card.expensive {
            border-color: #ef4444;
            background: #fef2f2;
        }
        
        .offer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .offer-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
        }
        
        .offer-cost {
            background: #4f46e5;
            color: white;
            padding: 0.375rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .offer-description {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1rem;
            line-height: 1.5;
        }
        
        .offer-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .discount-info {
            font-size: 0.875rem;
            color: #1f2937;
        }
        
        .discount-value {
            font-weight: 600;
            color: #10b981;
        }
        
        .redeem-btn {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.875rem;
            transition: transform 0.2s;
            width: 100%;
        }
        
        .redeem-btn:hover {
            transform: translateY(-1px);
        }
        
        .redeem-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
        }
        
        .transactions-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .transaction-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 0.5rem;
            border-left: 4px solid #e5e7eb;
        }
        
        .transaction-item.earned {
            border-left-color: #10b981;
        }
        
        .transaction-item.redeemed {
            border-left-color: #ef4444;
        }
        
        .transaction-item.bonus {
            border-left-color: #f59e0b;
        }
        
        .transaction-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .transaction-item.earned .transaction-icon {
            background: #d1fae5;
            color: #065f46;
        }
        
        .transaction-item.redeemed .transaction-icon {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .transaction-item.bonus .transaction-icon {
            background: #fef3c7;
            color: #92400e;
        }
        
        .transaction-details {
            flex: 1;
        }
        
        .transaction-description {
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 0.25rem 0;
        }
        
        .transaction-date {
            font-size: 0.875rem;
            color: #6b7280;
            margin: 0;
        }
        
        .transaction-points {
            font-weight: bold;
            font-size: 1.125rem;
        }
        
        .transaction-item.earned .transaction-points {
            color: #10b981;
        }
        
        .transaction-item.redeemed .transaction-points {
            color: #ef4444;
        }
        
        .transaction-item.bonus .transaction-points {
            color: #f59e0b;
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
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }
        
        @media (max-width: 1024px) {
            .credits-content {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .user-credits-wrapper {
                padding: 1rem;
            }
            
            .user-credits-title {
                font-size: 1.5rem;
            }
            
            .credits-overview {
                grid-template-columns: 1fr;
            }
            
            .offers-section,
            .transactions-section {
                padding: 1.5rem;
            }
        }
    `}</style>
);

export default function UserCredits({ userData, refreshTrigger }) {
    const [credits, setCredits] = useState({ points: 0, totalEarned: 0, totalRedeemed: 0 });
    const [offers, setOffers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCredits();
        fetchOffers();
        fetchTransactions();
    }, [userData.id]);

    // Refresh when refreshTrigger prop changes (from parent component)
    useEffect(() => {
        if (refreshTrigger) {
            fetchCredits();
            fetchTransactions();
        }
    }, [refreshTrigger]);

    // Auto-refresh credits and transactions every 5 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            fetchCredits();
            fetchTransactions();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [userData.id]);

    const fetchCredits = async () => {
        try {
            const response = await apiClient.get(`/credits/user/${userData.id}`);
            setCredits(response.data);
        } catch (err) {
            console.error('Failed to fetch credits:', err);
        }
    };

    const fetchOffers = async () => {
        try {
            const response = await apiClient.get('/offers');
            setOffers(response.data);
        } catch (err) {
            console.error('Failed to fetch offers:', err);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await apiClient.get(`/credits/user/${userData.id}/transactions`);
            setTransactions(response.data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        }
    };

    const handleRedeem = async (offerId) => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await apiClient.post('/credits/redeem', {
                userId: userData.id,
                offerId: offerId
            });
            
            setSuccess(response.data.message);
            fetchCredits();
            fetchTransactions();
            
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to redeem offer.');
        } finally {
            setLoading(false);
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

    const getOfferAffordability = (pointsRequired) => {
        const userPoints = Number(credits.points) || 0;
        if (pointsRequired <= userPoints) return 'affordable';
        if (pointsRequired <= userPoints * 1.5) return 'moderate';
        return 'expensive';
    };

    return (
        <>
            <UserCreditsStyles />
            <div className="user-credits-wrapper">
                <h1 className="user-credits-title">💎 My Credits</h1>
                <p className="credits-subtitle">
                    Earn credits with every booking and redeem them for amazing offers!
                </p>
                
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
                
                {/* Credits Overview */}
                <div className="credits-overview">
                    <div className="credit-card current">
                        <div className="credit-icon">💎</div>
                        <div className="credit-value">{Number(credits.points) || 0}</div>
                        <p className="credit-label">Available Credits</p>
                    </div>
                    
                    <div className="credit-card">
                        <div className="credit-icon">📈</div>
                        <div className="credit-value">{Number(credits.totalEarned) || 0}</div>
                        <p className="credit-label">Total Earned</p>
                    </div>
                    
                    <div className="credit-card">
                        <div className="credit-icon">🎁</div>
                        <div className="credit-value">{Number(credits.totalRedeemed) || 0}</div>
                        <p className="credit-label">Total Redeemed</p>
                    </div>
                </div>
                
                {/* Offers and Transactions */}
                <div className="credits-content">
                    {/* Available Offers */}
                    <div className="offers-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h2>Available Offers</h2>
                        </div>
                        
                        {offers.length === 0 ? (
                            <div className="empty-state">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <h3>No Offers Available</h3>
                                <p>Check back later for new offers!</p>
                            </div>
                        ) : (
                            <div className="offers-grid">
                                {offers.map(offer => {
                                    const affordability = getOfferAffordability(offer.pointsRequired);
                                    const canAfford = (Number(credits.points) || 0) >= offer.pointsRequired;
                                    
                                    return (
                                        <div key={offer._id} className={`offer-card ${affordability}`}>
                                            <div className="offer-header">
                                                <h3 className="offer-title">{offer.title}</h3>
                                                <span className="offer-cost">{offer.pointsRequired} pts</span>
                                            </div>
                                            
                                            <p className="offer-description">{offer.description}</p>
                                            
                                            <div className="offer-details">
                                                <div className="discount-info">
                                                    <span className="discount-value">
                                                        {offer.discountType === 'percentage' 
                                                            ? `${offer.discountValue}% off`
                                                            : `₹${offer.discountValue} off`
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <button
                                                className="redeem-btn"
                                                onClick={() => handleRedeem(offer._id)}
                                                disabled={!canAfford || loading}
                                            >
                                                {loading ? 'Processing...' : canAfford ? 'Redeem Now' : 'Not Enough Credits'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    {/* Transaction History */}
                    <div className="transactions-section">
                        <div className="section-header">
                            <div className="section-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h2>Transaction History</h2>
                        </div>
                        
                        {transactions.length === 0 ? (
                            <div className="empty-state">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <h3>No Transactions Yet</h3>
                                <p>Your credit transactions will appear here</p>
                            </div>
                        ) : (
                            <div className="transactions-list">
                                {transactions.map(transaction => (
                                    <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
                                        <div className="transaction-icon">
                                            {transaction.type === 'earned' && (
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            )}
                                            {transaction.type === 'redeemed' && (
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                            )}
                                            {transaction.type === 'bonus' && (
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            )}
                                        </div>
                                        
                                        <div className="transaction-details">
                                            <p className="transaction-description">{transaction.description}</p>
                                            <p className="transaction-date">{formatDate(transaction.createdAt)}</p>
                                        </div>
                                        
                                        <div className={`transaction-points ${transaction.points > 0 ? '+' : ''}${transaction.points}`}>
                                            {transaction.points > 0 ? '+' : ''}{transaction.points}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

