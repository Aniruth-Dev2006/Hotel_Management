import React, { useState } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles ---
const FeedbackStyles = () => (
    <style>{`
        .feedback-wrapper {
            padding: 2.5rem;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .feedback-title {
            font-size: 2rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 1.5rem;
        }
        
        .feedback-form-container {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
        }
        
        .form-section {
            margin-bottom: 1.5rem;
        }
        
        .form-section label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        
        .form-section input,
        .form-section textarea,
        .form-section select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            box-sizing: border-box;
            font-family: inherit;
        }
        
        .form-section textarea {
            resize: vertical;
            min-height: 120px;
        }
        
        .form-section input:focus,
        .form-section textarea:focus,
        .form-section select:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .rating-container {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        
        .star-button {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            transition: transform 0.2s;
            color: #d1d5db;
        }
        
        .star-button:hover {
            transform: scale(1.2);
        }
        
        .star-button.filled {
            color: #fbbf24;
        }
        
        .rating-text {
            margin-left: 0.5rem;
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
        }
        
        .submit-btn {
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
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        
        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .success-message {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease-out;
        }
        
        .success-icon {
            width: 2.5rem;
            height: 2.5rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .success-icon svg {
            width: 1.5rem;
            height: 1.5rem;
        }
        
        .success-content h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.125rem;
            font-weight: 600;
        }
        
        .success-content p {
            margin: 0;
            font-size: 0.875rem;
            opacity: 0.95;
        }
        
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
        }
        
        .feedback-info {
            background: #f3f4f6;
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1.5rem;
            border-left: 4px solid #4f46e5;
        }
        
        .feedback-info h3 {
            margin: 0 0 0.5rem 0;
            color: #1f2937;
            font-size: 1rem;
        }
        
        .feedback-info p {
            margin: 0;
            color: #6b7280;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .feedback-wrapper {
                padding: 1rem;
            }
            
            .feedback-title {
                font-size: 1.5rem;
            }
            
            .feedback-form-container {
                padding: 1.5rem;
            }
        }
    `}</style>
);

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function Feedback({ userData }) {
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        rating: 0
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRatingClick = (rating) => {
        setFormData({
            ...formData,
            rating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.rating === 0) {
            setError('Please select a rating before submitting.');
            return;
        }
        
        setLoading(true);
        
        try {
            await apiClient.post('/feedback/add', {
                userId: userData.id,
                userName: userData.name,
                userEmail: userData.email,
                subject: formData.subject,
                message: formData.message,
                rating: formData.rating
            });
            
            setSuccess(true);
            setFormData({ subject: '', message: '', rating: 0 });
            
            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FeedbackStyles />
            <div className="feedback-wrapper">
                <h1 className="feedback-title">Share Your Feedback</h1>
                
                {success && (
                    <div className="success-message">
                        <div className="success-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="success-content">
                            <h3>Thank You!</h3>
                            <p>Your feedback has been submitted successfully. We appreciate your input!</p>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="error-message">{error}</div>
                )}
                
                <div className="feedback-info">
                    <h3>💡 We Value Your Opinion</h3>
                    <p>Your feedback helps us improve our services. Please share your experience, suggestions, or any issues you encountered during your stay.</p>
                </div>
                
                <div className="feedback-form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <label htmlFor="subject">Subject *</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="e.g., Room Service, Cleanliness, Staff Behavior"
                                required
                            />
                        </div>
                        
                        <div className="form-section">
                            <label htmlFor="message">Your Feedback *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Tell us about your experience..."
                                required
                            />
                        </div>
                        
                        <div className="form-section">
                            <label>Rating *</label>
                            <div className="rating-container">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-button ${formData.rating >= star ? 'filled' : ''}`}
                                        onClick={() => handleRatingClick(star)}
                                    >
                                        ★
                                    </button>
                                ))}
                                {formData.rating > 0 && (
                                    <span className="rating-text">
                                        {ratingLabels[formData.rating]} ({formData.rating}/5)
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

