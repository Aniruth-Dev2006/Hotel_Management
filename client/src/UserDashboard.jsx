import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Feedback from './Feedback.jsx';
import UserNotifications from './UserNotifications.jsx';
import UserCredits from './UserCredits.jsx';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles ---
const UserDashboardStyles = () => (
    <style>{`
        .user-dashboard-wrapper {
            background-color: #f3f4f6;
            min-height: 100vh;
            padding-top: 80px;
        }
        
        /* Navbar Styles - Matching AdminDashboard */
        .user-navbar {
            background-color: #ffffff;
            color: #1f2937;
            padding: 1rem 1.5rem;
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
            color: #1f2937;
        }
        .navbar-logo {
            width: 2.25rem;
            height: 2.25rem;
            color: #4f46e5;
            margin-right: 0.75rem;
        }
        
        /* Desktop Navigation Links */
        .navbar-links-desktop {
            display: none;
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
            display: block;
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
        
        /* Main Content */
        .user-main-content {
            padding: 2.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        /* Page Header */
        .page-title {
            font-size: 2rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 1.5rem;
        }
        
        /* Search & Filter Section */
        .search-filter-section {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            margin-bottom: 2rem;
        }
        .search-filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        .filter-input-group {
            display: flex;
            flex-direction: column;
        }
        .filter-input-group label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 0.5rem;
        }
        .filter-input-group input, .filter-input-group select {
            padding: 0.625rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 0.875rem;
        }
        .search-btn {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 0.625rem 1.5rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-weight: 500;
            margin-top: auto;
        }
        .search-btn:hover {
            background: #4338ca;
        }
        .clear-btn {
            background: #e5e7eb;
            color: #1f2937;
            border: none;
            padding: 0.625rem 1.5rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-weight: 500;
            margin-top: auto;
        }
        .clear-btn:hover {
            background: #d1d5db;
        }
        
        /* Rooms Grid */
        .rooms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .room-card {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
        }
        .room-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .room-card-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #f3f4f6;
        }
        .room-card-content {
            padding: 1.25rem;
        }
        .room-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }
        .room-card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
        }
        .room-card-status {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
        }
        .status-available {
            background: #d1fae5;
            color: #065f46;
        }
        .status-booked {
            background: #fee2e2;
            color: #991b1b;
        }
        .room-card-details p {
            margin: 0.5rem 0;
            color: #4b5563;
            font-size: 0.875rem;
        }
        .room-card-price {
            font-size: 1.5rem;
            font-weight: bold;
            color: #4f46e5;
            margin: 1rem 0;
        }
        .book-now-btn {
            width: 100%;
            background: #4f46e5;
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.2s;
        }
        .book-now-btn:hover {
            background: #4338ca;
        }
        .book-now-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }
        
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        .modal-content {
            background: white;
            border-radius: 0.75rem;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #1f2937;
        }
        .modal-close-btn {
            background: none;
            border: none;
            font-size: 2rem;
            color: #6b7280;
            cursor: pointer;
            padding: 0;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-close-btn:hover {
            color: #1f2937;
        }
        .modal-body {
            padding: 1.5rem;
        }
        .modal-room-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .modal-details {
            margin-bottom: 1.5rem;
        }
        .modal-details h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1rem;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-label {
            color: #6b7280;
            font-weight: 500;
        }
        .detail-value {
            color: #1f2937;
            font-weight: 600;
        }
        .booking-form .input-group {
            margin-bottom: 1rem;
        }
        .booking-form .input-group label {
            display: block;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 0.5rem;
        }
        .booking-form .input-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-sizing: border-box;
        }
        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }
        
        /* Credit Offers Section */
        .credit-offers-section {
            margin: 2rem 0;
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 0.75rem;
            border: 2px solid #e2e8f0;
        }
        
        .credit-offers-section h3 {
            margin: 0 0 1.5rem 0;
            color: #1e293b;
            font-size: 1.25rem;
        }
        
        .offers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .offer-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 0.75rem;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }
        
        .offer-card:hover {
            border-color: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }
        
        .offer-card.selected {
            border-color: #4f46e5;
            background: #f0f4ff;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .offer-card.selected::before {
            content: '✓';
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            width: 1.5rem;
            height: 1.5rem;
            background: #4f46e5;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.875rem;
        }
        
        .offer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.75rem;
        }
        
        .offer-header h4 {
            margin: 0;
            color: #1e293b;
            font-size: 1.125rem;
            font-weight: 600;
        }
        
        .offer-cost {
            background: #4f46e5;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .offer-description {
            color: #64748b;
            font-size: 0.875rem;
            margin: 0 0 1rem 0;
            line-height: 1.5;
        }
        
        .offer-savings {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .savings-label {
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .savings-amount {
            color: #10b981;
            font-weight: 600;
            font-size: 1rem;
        }
        
        .offer-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 0.75rem;
            border-top: 1px solid #e2e8f0;
        }
        
        .total-label {
            color: #1e293b;
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .total-amount {
            color: #1e293b;
            font-weight: bold;
            font-size: 1.125rem;
        }
        
        .selected-offer-info {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-top: 1rem;
        }
        
        .selected-offer-info p {
            margin: 0.25rem 0;
            color: #166534;
            font-size: 0.875rem;
        }
        
        .offer-preview {
            padding: 1rem 0;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .preview-label {
            color: #6b7280;
            font-size: 0.875rem;
            font-style: italic;
        }
        
        .no-offers-message {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
        }
        
        .no-offers-message p {
            margin: 0.5rem 0;
        }
        
        /* Booking Summary */
        .booking-summary {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .booking-summary h4 {
            margin: 0 0 1rem 0;
            color: #1e293b;
            font-size: 1.125rem;
            font-weight: 600;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .summary-row:last-child {
            border-bottom: none;
        }
        
        .summary-row.discount {
            color: #10b981;
        }
        
        .summary-row.total {
            background: #f0f4ff;
            margin: 0.5rem -1.5rem -1.5rem -1.5rem;
            padding: 1rem 1.5rem;
            border-radius: 0 0 0.5rem 0.5rem;
            border-top: 2px solid #4f46e5;
        }
        
        .summary-row span:first-child {
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .summary-row span:last-child {
            color: #1e293b;
            font-weight: 500;
        }
        
        .summary-row.total span:last-child {
            color: #4f46e5;
            font-size: 1.125rem;
        }
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.2s;
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
        .btn-success {
            background: #10b981;
            color: white;
        }
        .btn-success:hover {
            background: #059669;
        }
        
        /* Bookings Table */
        .bookings-section {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            overflow-x: auto;
        }
        .bookings-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
        }
        .bookings-table th, .bookings-table td {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
            white-space: nowrap;
        }
        .bookings-table th {
            background: #f9fafb;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: #6b7280;
            font-weight: 600;
        }
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .status-Requested {
            background: #fef3c7;
            color: #92400e;
        }
        .status-Confirmed {
            background: #dbeafe;
            color: #1e40af;
        }
        .status-Active {
            background: #d1fae5;
            color: #065f46;
        }
        .status-Completed {
            background: #e5e7eb;
            color: #1f2937;
        }
        .status-Rejected {
            background: #fee2e2;
            color: #991b1b;
        }
        .action-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
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
        .action-btn-checkin {
            background: #3b82f6;
            color: white;
        }
        .action-btn-checkin:hover {
            background: #2563eb;
        }
        .action-btn-checkout {
            background: #10b981;
            color: white;
        }
        .action-btn-checkout:hover {
            background: #059669;
        }
        .action-btn-cancel {
            background: #ef4444;
            color: white;
        }
        .action-btn-cancel:hover {
            background: #dc2626;
        }
        
        /* Profile Section */
        .profile-section {
            background: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            max-width: 600px;
        }
        .profile-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: bold;
        }
        .profile-info h2 {
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
            color: #1f2937;
        }
        .profile-info p {
            margin: 0;
            color: #6b7280;
        }
        .profile-details .detail-row {
            display: flex;
            padding: 1rem 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .profile-details .detail-row:last-child {
            border-bottom: none;
        }
        .profile-details .detail-label {
            flex: 0 0 140px;
            color: #6b7280;
            font-weight: 500;
        }
        .profile-details .detail-value {
            flex: 1;
            color: #1f2937;
            font-weight: 600;
        }
        
        /* Empty State */
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
        .empty-state p {
            color: #6b7280;
        }
        
        /* Success Popup */
        .success-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            z-index: 3000;
            padding-top: 4rem;
            pointer-events: none;
        }
        .success-popup {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 500px;
            pointer-events: auto;
            animation: slideDown 0.4s ease-out;
        }
        .success-popup-icon {
            width: 3rem;
            height: 3rem;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .success-popup-icon svg {
            width: 2rem;
            height: 2rem;
        }
        .success-popup-content {
            flex: 1;
        }
        .success-popup-content h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
            font-weight: 600;
        }
        .success-popup-content p {
            margin: 0;
            font-size: 0.875rem;
            opacity: 0.95;
        }
        .success-popup-close {
            background: transparent;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.375rem;
            transition: background-color 0.2s;
            flex-shrink: 0;
        }
        .success-popup-close:hover {
            background: rgba(255,255,255,0.2);
        }
        
        /* Cancel Confirmation Modal */
        .confirm-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3500;
            animation: fadeIn 0.2s ease-out;
        }
        .confirm-modal {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 90%;
            animation: scaleIn 0.3s ease-out;
        }
        .confirm-modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .confirm-modal-icon {
            width: 3rem;
            height: 3rem;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .confirm-modal-icon svg {
            width: 1.5rem;
            height: 1.5rem;
            color: #dc2626;
        }
        .confirm-modal-title {
            flex: 1;
        }
        .confirm-modal-title h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.125rem;
            color: #1f2937;
            font-weight: 600;
        }
        .confirm-modal-title p {
            margin: 0;
            font-size: 0.875rem;
            color: #6b7280;
        }
        .confirm-modal-body {
            padding: 1.5rem;
        }
        .confirm-modal-body p {
            margin: 0 0 1rem 0;
            color: #4b5563;
            line-height: 1.5;
        }
        .booking-details-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
        }
        .booking-details-box p {
            margin: 0.5rem 0;
            font-size: 0.875rem;
            color: #1f2937;
        }
        .booking-details-box strong {
            color: #4b5563;
        }
        .confirm-modal-footer {
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
        
        /* Chatbot Styles */
        .chatbot-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .chatbot-button:hover {
            transform: scale(1.1);
            box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.6);
        }
        .chatbot-button svg {
            width: 28px;
            height: 28px;
        }
        .chatbot-button.active {
            background: #ef4444;
        }
        .chatbot-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #ef4444;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 2s infinite;
        }
        
        .chatbot-window {
            position: fixed;
            bottom: 6rem;
            right: 2rem;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            z-index: 1000;
            animation: slideUp 0.3s ease-out;
        }
        .chatbot-header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 1rem 1rem 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .chatbot-header-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .chatbot-avatar {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chatbot-avatar svg {
            width: 24px;
            height: 24px;
        }
        .chatbot-header-text h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
        }
        .chatbot-header-text p {
            margin: 0;
            font-size: 0.75rem;
            opacity: 0.9;
        }
        .chatbot-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .chatbot-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: #f9fafb;
        }
        .chat-message {
            margin-bottom: 1rem;
            display: flex;
            animation: fadeIn 0.3s ease-out;
        }
        .chat-message.bot {
            justify-content: flex-start;
        }
        .chat-message.user {
            justify-content: flex-end;
        }
        .message-bubble {
            max-width: 75%;
            padding: 0.75rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        .chat-message.bot .message-bubble {
            background: white;
            color: #1f2937;
            border-bottom-left-radius: 0.25rem;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .chat-message.user .message-bubble {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            border-bottom-right-radius: 0.25rem;
        }
        .chatbot-input-area {
            padding: 1rem;
            background: white;
            border-top: 1px solid #e5e7eb;
            border-radius: 0 0 1rem 1rem;
        }
        .chatbot-input-wrapper {
            display: flex;
            gap: 0.5rem;
        }
        .chatbot-input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 2rem;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s;
        }
        .chatbot-input:focus {
            border-color: #4f46e5;
        }
        .chatbot-send {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        .chatbot-send:hover {
            transform: scale(1.05);
        }
        .chatbot-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: scale(1);
        }
        .typing-indicator {
            display: flex;
            gap: 0.25rem;
            padding: 0.75rem 1rem;
        }
        .typing-dot {
            width: 8px;
            height: 8px;
            background: #9ca3af;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        .message-bubble.typing-message {
            background: white;
            color: #9ca3af;
            font-style: italic;
            min-width: 60px;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        /* Mobile Responsive */
        @media (min-width: 768px) {
            .user-navbar {
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
        
        @media (max-width: 768px) {
            .user-main-content {
                padding: 1rem;
            }
            .page-title {
                font-size: 1.5rem;
            }
            .search-filter-grid {
                grid-template-columns: 1fr;
            }
            .rooms-grid {
                grid-template-columns: 1fr;
            }
            .profile-header {
                flex-direction: column;
                text-align: center;
            }
            .success-popup {
                margin: 0 1rem;
                padding: 1.25rem 1.5rem;
            }
            .bookings-section {
                padding: 1rem;
            }
            .chatbot-window {
                width: calc(100% - 2rem);
                right: 1rem;
                bottom: 5rem;
                height: 450px;
            }
            .chatbot-button {
                bottom: 1.5rem;
                right: 1.5rem;
            }
        }
    `}</style>
);

export default function UserDashboard({ onLogout, userData }) {
    const [activeView, setActiveView] = useState('rooms'); // 'rooms', 'bookings', 'profile', 'feedback', 'notifications', 'credits'
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [showChatbot, setShowChatbot] = useState(false);
    const [availableOffers, setAvailableOffers] = useState([]);
    const [userCredits, setUserCredits] = useState({ points: 0 });
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [chatMessages, setChatMessages] = useState([
        { type: 'bot', text: 'Hello! 👋 I\'m your HotelMaster Bot assistant. I can help you with room bookings, availability, pricing, and any questions you have. How can I assist you today?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || ''
    });
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(userData?.profilePicture || '');
    
    // Filter states
    const [filters, setFilters] = useState({
        type: '',
        minPrice: '',
        maxPrice: '',
        hasAC: '',
        searchTerm: ''
    });
    
    // Booking form data
    const [bookingData, setBookingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guestName: userData?.name || ''
    });

    // Fetch rooms
    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/rooms');
            setRooms(response.data);
            setFilteredRooms(response.data);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch available offers
    const fetchOffers = async () => {
        try {
            const response = await apiClient.get('/offers');
            setAvailableOffers(response.data);
        } catch (error) {
            console.error('Failed to fetch offers:', error);
        }
    };

    // Fetch user credits
    const fetchUserCredits = async () => {
        try {
            const response = await apiClient.get(`/credits/user/${userData.id}`);
            setUserCredits(response.data);
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        }
    };

    // Fetch user's bookings only
    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/bookings?userId=${userData.id}`);
            setMyBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeView === 'rooms') {
            fetchRooms();
            fetchUserCredits(); // Refresh credits when viewing rooms
        } else if (activeView === 'bookings') {
            fetchMyBookings();
            fetchUserCredits(); // Refresh credits when viewing bookings
        } else if (activeView === 'credits') {
            fetchUserCredits(); // Refresh credits when viewing credits page
        }
    }, [activeView]);

    useEffect(() => {
        fetchOffers();
        fetchUserCredits();
    }, [userData.id]);

    // Auto-refresh credits every 5 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUserCredits();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [userData.id]);

    // Apply filters
    const applyFilters = () => {
        let filtered = [...rooms];
        
        if (filters.type) {
            filtered = filtered.filter(room => room.type === filters.type);
        }
        if (filters.minPrice) {
            filtered = filtered.filter(room => room.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(room => room.price <= Number(filters.maxPrice));
        }
        if (filters.hasAC !== '') {
            filtered = filtered.filter(room => room.hasAC === (filters.hasAC === 'true'));
        }
        if (filters.searchTerm) {
            filtered = filtered.filter(room => 
                room.roomNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                room.type.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }
        
        setFilteredRooms(filtered);
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            minPrice: '',
            maxPrice: '',
            hasAC: '',
            searchTerm: ''
        });
        setFilteredRooms(rooms);
    };

    // Handle booking submission
    const handleBookRoom = async (e) => {
        e.preventDefault();
        if (!selectedRoom) return;
        
        try {
            const response = await apiClient.post('/bookings/add', {
                guestName: bookingData.guestName,
                room: selectedRoom._id,
                userId: userData.id,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                status: 'Requested',
                redeemedOfferId: selectedOffer?._id || null
            });
            
            // Send WhatsApp notification to admin (9361377458)
            sendWhatsAppNotification();
            
            setShowBookingModal(false);
            setBookingData({ checkInDate: '', checkOutDate: '', guestName: userData?.name || '' });
            setSelectedRoom(null);
            const usedOffer = selectedOffer;
            setSelectedOffer(null);
            
            // Update success message based on offer redemption
            if (usedOffer) {
                setSuccessMessage(`Booking request submitted successfully! You redeemed "${usedOffer.title}" and saved credits!`);
            } else {
                setSuccessMessage('Booking request submitted successfully!');
            }
            
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 4000);
            
            // Immediately refresh all data for dynamic updates
            await Promise.all([
                fetchUserCredits(),
                fetchMyBookings(),
                fetchRooms(),
                fetchOffers()
            ]);
            
            // Force a second refresh after a short delay to ensure database has updated
            setTimeout(async () => {
                await fetchUserCredits();
            }, 1000);
            
        } catch (error) {
            console.error('Booking failed:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create booking. Please try again.';
            alert(errorMessage);
        }
    };

    // Send WhatsApp notification
    const sendWhatsAppNotification = () => {
        const adminPhone = '9361377458';
        
        const checkIn = new Date(bookingData.checkInDate).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        const checkOut = new Date(bookingData.checkOutDate).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        
        let message = `🏨 *NEW BOOKING REQUEST - HotelMaster*\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `👤 *Guest Details:*\n`;
        message += `Name: ${bookingData.guestName}\n`;
        message += `Phone: ${userData.phone}\n`;
        message += `Email: ${userData.email}\n\n`;
        message += `🏨 *Booking Details:*\n`;
        message += `Room Number: ${selectedRoom.roomNumber}\n`;
        message += `Room Type: ${selectedRoom.type}\n`;
        message += `Price: ₹${selectedRoom.price}/night\n`;
        message += `Check-in: ${checkIn}\n`;
        message += `Check-out: ${checkOut}\n\n`;
        message += `📊 *Status:* Pending Approval\n\n`;
        message += `⚡ *Action Required:*\n`;
        message += `Please review and confirm in admin dashboard.\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    };

    // Handle status updates (check-in, check-out, cancel)
    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await apiClient.put(`/bookings/${bookingId}/status`, { status: newStatus });
            fetchMyBookings();
            setSuccessMessage(`Booking ${newStatus.toLowerCase()} successfully!`);
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 4000);
        } catch (error) {
            console.error('Status update failed:', error);
            setSuccessMessage('Failed to update booking status.');
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 4000);
        }
    };

    // Show cancel confirmation
    const handleCancelBooking = (booking) => {
        setBookingToCancel(booking);
        setShowCancelConfirm(true);
    };

    // Confirm cancel
    const confirmCancelBooking = async () => {
        if (!bookingToCancel) return;
        setShowCancelConfirm(false);
        await handleStatusUpdate(bookingToCancel._id, 'Rejected');
        setBookingToCancel(null);
    };

    const handleNavigation = (view) => {
        setActiveView(view);
        setIsMenuOpen(false);
    };

    // Profile update handlers
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            setProfilePictureFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update profile data
            const response = await apiClient.put(`/users/${userData.id}`, profileForm);
            
            // Upload profile picture if selected
            if (profilePictureFile) {
                const formData = new FormData();
                formData.append('profilePicture', profilePictureFile);
                const photoResponse = await apiClient.post(`/users/${userData.id}/upload-profile`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                userData.profilePicture = photoResponse.data.profilePicture;
            }
            
            // Update local userData
            userData.name = profileForm.name;
            userData.email = profileForm.email;
            userData.phone = profileForm.phone;
            
            setIsEditingProfile(false);
            setProfilePictureFile(null);
            setSuccessMessage('Profile updated successfully!');
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        } catch (error) {
            console.error('Profile update failed:', error);
            alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
        }
    };

    // Chatbot message handler with Gemini API
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = chatInput;
        setChatInput('');

        // Add user message to chat
        setChatMessages(prev => [...prev, { type: 'user', text: userMessage }]);

        // Add typing indicator
        setChatMessages(prev => [...prev, { type: 'bot', text: '...', isTyping: true }]);

        // Scroll to bottom
        setTimeout(() => {
            const messagesContainer = document.querySelector('.chatbot-messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);

        try {
            // Call backend chatbot endpoint
            const response = await apiClient.post('/chatbot', {
                message: userMessage
            });

            // Remove typing indicator
            setChatMessages(prev => prev.filter(msg => !msg.isTyping));

            // Add bot response
            if (response.data.success && response.data.response) {
                setChatMessages(prev => [...prev, { 
                    type: 'bot', 
                    text: response.data.response 
                }]);
            } else {
                throw new Error('Invalid response from chatbot');
            }

        } catch (error) {
            console.error('Chatbot Error:', error);
            console.error('Error details:', error.response?.data || error.message);
            
            // Remove typing indicator
            setChatMessages(prev => prev.filter(msg => !msg.isTyping));
            
            // Show error message
            setChatMessages(prev => [...prev, { 
                type: 'bot', 
                text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or contact our front desk for immediate assistance.' 
            }]);
        }

        // Scroll to bottom after response
        setTimeout(() => {
            const messagesContainer = document.querySelector('.chatbot-messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);
    };

    // Render Browse Rooms View
    const renderRoomsView = () => (
        <>
            <h1 className="page-title">Browse Available Rooms</h1>
            
            {/* Search & Filter */}
            <div className="search-filter-section">
                <div className="search-filter-grid">
                    <div className="filter-input-group">
                        <label>Search</label>
                        <input 
                            type="text" 
                            placeholder="Room number or type..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                        />
                    </div>
                    <div className="filter-input-group">
                        <label>Room Type</label>
                        <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
                            <option value="">All Types</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                        </select>
                    </div>
                    <div className="filter-input-group">
                        <label>Min Price</label>
                        <input 
                            type="number" 
                            placeholder="₹0"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                        />
                    </div>
                    <div className="filter-input-group">
                        <label>Max Price</label>
                        <input 
                            type="number" 
                            placeholder="₹10000"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                        />
                    </div>
                    <div className="filter-input-group">
                        <label>Air Conditioning</label>
                        <select value={filters.hasAC} onChange={(e) => setFilters({...filters, hasAC: e.target.value})}>
                            <option value="">Any</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <button className="search-btn" onClick={applyFilters}>Apply Filters</button>
                    <button className="clear-btn" onClick={clearFilters}>Clear</button>
                </div>
            </div>
            
            {/* Rooms Grid */}
            {loading ? (
                <div className="empty-state">Loading rooms...</div>
            ) : filteredRooms.length === 0 ? (
                <div className="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3>No Rooms Found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            ) : (
                <div className="rooms-grid">
                    {filteredRooms.map(room => (
                        <div key={room._id} className="room-card" onClick={() => {
                            setSelectedRoom(room);
                            setShowBookingModal(true);
                        }}>
                            <img 
                                src={room.photoUrl || 'https://placehold.co/600x400/4f46e5/ffffff?text=Room'} 
                                alt={`Room ${room.roomNumber}`}
                                className="room-card-image"
                            />
                            <div className="room-card-content">
                                <div className="room-card-header">
                                    <h3 className="room-card-title">Room {room.roomNumber}</h3>
                                    <span className={`room-card-status ${room.isBooked ? 'status-booked' : 'status-available'}`}>
                                        {room.isBooked ? 'Booked' : 'Available'}
                                    </span>
                                </div>
                                <div className="room-card-details">
                                    <p><strong>Type:</strong> {room.type}</p>
                                    <p><strong>AC:</strong> {room.hasAC ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="room-card-price">₹{room.price}<span style={{fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280'}}>/night</span></div>
                                <button 
                                    className="book-now-btn" 
                                    disabled={room.isBooked}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRoom(room);
                                        setShowBookingModal(true);
                                    }}
                                >
                                    {room.isBooked ? 'Not Available' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );

    // Render My Bookings View
    const renderBookingsView = () => (
        <>
            <h1 className="page-title">My Bookings</h1>
            <div className="bookings-section">
                {loading ? (
                    <div className="empty-state">Loading bookings...</div>
                ) : myBookings.length === 0 ? (
                    <div className="empty-state">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3>No Bookings Yet</h3>
                        <p>Start by browsing available rooms</p>
                    </div>
                ) : (
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Guest Name</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>Room {booking.room?.roomNumber || 'N/A'}</td>
                                    <td>{booking.guestName}</td>
                                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${booking.status}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {booking.status === 'Confirmed' && (
                                                <button 
                                                    className="action-btn action-btn-checkin"
                                                    onClick={() => handleStatusUpdate(booking._id, 'Active')}
                                                >
                                                    Check In
                                                </button>
                                            )}
                                            {booking.status === 'Active' && (
                                                <button 
                                                    className="action-btn action-btn-checkout"
                                                    onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                                                >
                                                    Check Out
                                                </button>
                                            )}
                                            {(booking.status === 'Requested' || booking.status === 'Confirmed') && (
                                                <button 
                                                    className="action-btn action-btn-cancel"
                                                    onClick={() => handleCancelBooking(booking)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );

    // Render Profile View with Edit Functionality
    const renderProfileView = () => {
        const memberSince = userData.createdAt 
            ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'January 2024';

        return (
            <>
                <h1 className="page-title">My Profile</h1>
                <div className="profile-section">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {profilePicturePreview || userData.profilePicture ? (
                                <img 
                                    src={profilePicturePreview || userData.profilePicture} 
                                    alt="Profile" 
                                    style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
                                />
                            ) : (
                                userData.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="profile-info">
                            <h2>{userData.name}</h2>
                            <p>Member since {memberSince}</p>
                        </div>
                    </div>
                    
                    {!isEditingProfile ? (
                        <>
                            <div className="profile-details">
                                <div className="detail-row">
                                    <span className="detail-label">Full Name</span>
                                    <span className="detail-value">{userData.name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{userData.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{userData.phone}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Total Bookings</span>
                                    <span className="detail-value">{myBookings.length}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">User ID</span>
                                    <span className="detail-value">{userData.id}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Account Status</span>
                                    <span className="detail-value" style={{color: '#10b981'}}>Active</span>
                                </div>
                            </div>
                            <div style={{marginTop: '2rem', textAlign: 'center'}}>
                                <button 
                                    onClick={() => {
                                        setIsEditingProfile(true);
                                        setProfileForm({
                                            name: userData.name,
                                            email: userData.email,
                                            phone: userData.phone
                                        });
                                    }} 
                                    className="btn btn-primary"
                                    style={{padding: '0.75rem 2rem'}}
                                >
                                    ✏️ Edit Profile
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleProfileUpdate} style={{marginTop: '2rem'}}>
                            <div className="booking-form">
                                <div className="input-group">
                                    <label>Profile Picture</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleProfilePictureChange}
                                        style={{padding: '0.5rem'}}
                                    />
                                    <small style={{color: '#6b7280', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem'}}>
                                        Max file size: 5MB. Supported formats: JPG, PNG, GIF
                                    </small>
                                </div>
                                <div className="input-group">
                                    <label>Full Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email *</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Phone *</label>
                                    <input 
                                        type="tel" 
                                        required
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                    />
                                </div>
                                <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center'}}>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsEditingProfile(false);
                                            setProfilePictureFile(null);
                                            setProfilePicturePreview(userData.profilePicture || '');
                                        }} 
                                        className="btn btn-secondary"
                                        style={{padding: '0.75rem 2rem'}}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        style={{padding: '0.75rem 2rem'}}
                                    >
                                        💾 Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <UserDashboardStyles />
            <div className="user-dashboard-wrapper">
                {/* Navbar - Matching AdminDashboard Style */}
                <nav className="user-navbar">
                    <div className="navbar-brand">
                        <svg className="navbar-logo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-6 0a1 1 0 001 1h2a1 1 0 001-1m-5 0v-4" />
                        </svg>
                        <span>HotelMaster</span>
                    </div>
                    
                    {/* Desktop Links */}
                    <div className="navbar-links-desktop">
                        <button onClick={() => setActiveView('rooms')} className={`nav-link ${activeView === 'rooms' ? 'active' : ''}`}>
                            Browse Rooms
                        </button>
                        <button onClick={() => setActiveView('bookings')} className={`nav-link ${activeView === 'bookings' ? 'active' : ''}`}>
                            My Bookings
                        </button>
                        <button onClick={() => setActiveView('credits')} className={`nav-link ${activeView === 'credits' ? 'active' : ''}`}>
                            Credits
                        </button>
                        <button onClick={() => setActiveView('notifications')} className={`nav-link ${activeView === 'notifications' ? 'active' : ''}`}>
                            Notifications
                        </button>
                        <button onClick={() => setActiveView('feedback')} className={`nav-link ${activeView === 'feedback' ? 'active' : ''}`}>
                            Feedback
                        </button>
                        <button onClick={() => setActiveView('profile')} className={`nav-link ${activeView === 'profile' ? 'active' : ''}`}>
                            Profile
                        </button>
                        <button onClick={onLogout} className="logout-button-nav">Logout</button>
                    </div>
                    
                    {/* Mobile Hamburger Toggle */}
                    <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* Mobile Links Dropdown */}
                    <div className={`navbar-links-mobile ${isMenuOpen ? 'open' : ''}`}>
                        <button onClick={() => handleNavigation('rooms')} className={`nav-link ${activeView === 'rooms' ? 'active' : ''}`}>
                            Browse Rooms
                        </button>
                        <button onClick={() => handleNavigation('bookings')} className={`nav-link ${activeView === 'bookings' ? 'active' : ''}`}>
                            My Bookings
                        </button>
                        <button onClick={() => handleNavigation('credits')} className={`nav-link ${activeView === 'credits' ? 'active' : ''}`}>
                            Credits
                        </button>
                        <button onClick={() => handleNavigation('notifications')} className={`nav-link ${activeView === 'notifications' ? 'active' : ''}`}>
                            Notifications
                        </button>
                        <button onClick={() => handleNavigation('feedback')} className={`nav-link ${activeView === 'feedback' ? 'active' : ''}`}>
                            Feedback
                        </button>
                        <button onClick={() => handleNavigation('profile')} className={`nav-link ${activeView === 'profile' ? 'active' : ''}`}>
                            Profile
                        </button>
                        <button onClick={onLogout} className="logout-button-nav">Logout</button>
                    </div>
                </nav>
                
                {/* Main Content */}
                <div className="user-main-content">
                    {activeView === 'rooms' && renderRoomsView()}
                    {activeView === 'bookings' && renderBookingsView()}
                    {activeView === 'credits' && <UserCredits userData={userData} refreshTrigger={userCredits} />}
                    {activeView === 'notifications' && <UserNotifications userData={userData} />}
                    {activeView === 'feedback' && <Feedback userData={userData} />}
                    {activeView === 'profile' && renderProfileView()}
                </div>
                
                {/* Booking Modal */}
                {showBookingModal && selectedRoom && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Book Room {selectedRoom.roomNumber}</h2>
                                <button className="modal-close-btn" onClick={() => {
                                    setShowBookingModal(false);
                                    setSelectedRoom(null);
                                }}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <img 
                                    src={selectedRoom.photoUrl || 'https://placehold.co/600x400/4f46e5/ffffff?text=Room'}
                                    alt={`Room ${selectedRoom.roomNumber}`}
                                    className="modal-room-image"
                                />
                                <div className="modal-details">
                                    <h3>Room Details</h3>
                                    <div className="detail-item">
                                        <span className="detail-label">Room Number</span>
                                        <span className="detail-value">{selectedRoom.roomNumber}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Type</span>
                                        <span className="detail-value">{selectedRoom.type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Price per Night</span>
                                        <span className="detail-value">₹{selectedRoom.price}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Air Conditioning</span>
                                        <span className="detail-value">{selectedRoom.hasAC ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Status</span>
                                        <span className="detail-value" style={{color: selectedRoom.isBooked ? '#ef4444' : '#10b981'}}>
                                            {selectedRoom.isBooked ? 'Booked' : 'Available'}
                                        </span>
                                    </div>
                                </div>
                                
                                {!selectedRoom.isBooked && (
                                    <>
                                        {/* Credit Offers Section */}
                                        {availableOffers.length > 0 ? (
                                            <div className="credit-offers-section">
                                                <h3>💎 Available Credit Offers</h3>
                                                <div className="offers-grid">
                                                    {availableOffers
                                                        .filter(offer => (Number(userCredits.points) || 0) >= offer.pointsRequired)
                                                        .map(offer => {
                                                            // Check if dates are available for calculation
                                                            const checkIn = new Date(bookingData.checkInDate);
                                                            const checkOut = new Date(bookingData.checkOutDate);
                                                            const hasValidDates = !isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime());
                                                            
                                                            let nights = 0;
                                                            let totalAmount = 0;
                                                            let discountAmount = 0;
                                                            let finalAmount = 0;
                                                            
                                                            if (hasValidDates) {
                                                                nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                                                                totalAmount = selectedRoom.price * nights;
                                                                discountAmount = offer.discountType === 'percentage' 
                                                                    ? (totalAmount * offer.discountValue) / 100
                                                                    : offer.discountValue;
                                                                finalAmount = Math.max(0, totalAmount - discountAmount);
                                                            }
                                                            
                                                            return (
                                                                <div 
                                                                    key={offer._id} 
                                                                    className={`offer-card ${selectedOffer?._id === offer._id ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedOffer(selectedOffer?._id === offer._id ? null : offer)}
                                                                >
                                                                    <div className="offer-header">
                                                                        <h4>{offer.title}</h4>
                                                                        <span className="offer-cost">{offer.pointsRequired} pts</span>
                                                                    </div>
                                                                    <p className="offer-description">{offer.description}</p>
                                                                    {hasValidDates ? (
                                                                        <>
                                                                            <div className="offer-savings">
                                                                                <span className="savings-label">You Save:</span>
                                                                                <span className="savings-amount">₹{discountAmount}</span>
                                                                            </div>
                                                                            <div className="offer-total">
                                                                                <span className="total-label">Final Amount:</span>
                                                                                <span className="total-amount">₹{finalAmount}</span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="offer-preview">
                                                                            <span className="preview-label">Select dates to see savings</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                                {availableOffers.filter(offer => (Number(userCredits.points) || 0) >= offer.pointsRequired).length === 0 && (
                                                    <div className="no-offers-message">
                                                        <p>You need more credits to use these offers.</p>
                                                        <p>Current credits: {Number(userCredits.points) || 0}</p>
                                                    </div>
                                                )}
                                                {selectedOffer && (() => {
                                                    const checkIn = new Date(bookingData.checkInDate);
                                                    const checkOut = new Date(bookingData.checkOutDate);
                                                    const hasValidDates = !isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime());
                                                    
                                                    if (hasValidDates) {
                                                        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                                                        const totalAmount = selectedRoom.price * nights;
                                                        const savings = selectedOffer.discountType === 'percentage' 
                                                            ? Math.round((totalAmount * selectedOffer.discountValue) / 100)
                                                            : selectedOffer.discountValue;
                                                        
                                                        return (
                                                            <div className="selected-offer-info">
                                                                <p>✅ Selected: {selectedOffer.title}</p>
                                                                <p>You will save ₹{savings} on this booking!</p>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div className="selected-offer-info">
                                                                <p>✅ Selected: {selectedOffer.title}</p>
                                                                <p>Select check-in and check-out dates to see your savings!</p>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        ) : (
                                            <div className="credit-offers-section">
                                                <h3>💎 Credit Offers</h3>
                                                <div className="no-offers-message">
                                                    <p>No offers available at the moment.</p>
                                                    <p>Check back later for new offers!</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <form className="booking-form" onSubmit={handleBookRoom}>
                                            <h3>Booking Information</h3>
                                        <div className="input-group">
                                            <label>Guest Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={bookingData.guestName}
                                                onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Check-In Date</label>
                                            <input 
                                                type="date" 
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={bookingData.checkInDate}
                                                onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Check-Out Date</label>
                                            <input 
                                                type="date" 
                                                required
                                                min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                                                value={bookingData.checkOutDate}
                                                onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                                            />
                                        </div>
                                        
                                        {/* Booking Summary */}
                                        {bookingData.checkInDate && bookingData.checkOutDate && (
                                            <div className="booking-summary">
                                                <h4>💰 Booking Summary</h4>
                                                {(() => {
                                                    const checkIn = new Date(bookingData.checkInDate);
                                                    const checkOut = new Date(bookingData.checkOutDate);
                                                    
                                                    // Validate dates
                                                    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
                                                        return <p>Please select valid dates</p>;
                                                    }
                                                    
                                                    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                                                    const totalAmount = selectedRoom.price * nights;
                                                    
                                                    return (
                                                        <>
                                                            <div className="summary-row">
                                                                <span>Room Price per Night:</span>
                                                                <span>₹{selectedRoom.price}</span>
                                                            </div>
                                                            <div className="summary-row">
                                                                <span>Number of Nights:</span>
                                                                <span>{nights}</span>
                                                            </div>
                                                            <div className="summary-row">
                                                                <span>Total Amount:</span>
                                                                <span>₹{totalAmount}</span>
                                                            </div>
                                                            {selectedOffer && (
                                                                <>
                                                                    <div className="summary-row discount">
                                                                        <span>Discount ({selectedOffer.title}):</span>
                                                                        <span>-₹{selectedOffer.discountType === 'percentage' 
                                                                            ? Math.round((totalAmount * selectedOffer.discountValue) / 100)
                                                                            : selectedOffer.discountValue}</span>
                                                                    </div>
                                                                    <div className="summary-row total">
                                                                        <span><strong>Final Amount:</strong></span>
                                                                        <span><strong>₹{Math.max(0, totalAmount - (selectedOffer.discountType === 'percentage' 
                                                                            ? Math.round((totalAmount * selectedOffer.discountValue) / 100)
                                                                            : selectedOffer.discountValue))}</strong></span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => {
                                                setShowBookingModal(false);
                                                setSelectedRoom(null);
                                            }}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Confirm Booking</button>
                                        </div>
                                    </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Success Popup */}
                {showSuccessPopup && (
                    <div className="success-popup-overlay">
                        <div className="success-popup">
                            <div className="success-popup-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="success-popup-content">
                                <h3>Success!</h3>
                                <p>{successMessage}</p>
                            </div>
                            <button className="success-popup-close" onClick={() => setShowSuccessPopup(false)}>
                                &times;
                            </button>
                        </div>
                    </div>
                )}

                {/* Cancel Confirmation Modal */}
                {showCancelConfirm && bookingToCancel && (
                    <div className="confirm-modal-overlay">
                        <div className="confirm-modal">
                            <div className="confirm-modal-header">
                                <div className="confirm-modal-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="confirm-modal-title">
                                    <h3>Cancel Booking?</h3>
                                    <p>This action cannot be undone</p>
                                </div>
                            </div>
                            <div className="confirm-modal-body">
                                <p>Are you sure you want to cancel this booking?</p>
                                <div className="booking-details-box">
                                    <p><strong>Room:</strong> {bookingToCancel.room?.roomNumber || 'N/A'}</p>
                                    <p><strong>Guest:</strong> {bookingToCancel.guestName}</p>
                                    <p><strong>Check-in:</strong> {new Date(bookingToCancel.checkInDate).toLocaleDateString()}</p>
                                    <p><strong>Check-out:</strong> {new Date(bookingToCancel.checkOutDate).toLocaleDateString()}</p>
                                    <p><strong>Status:</strong> {bookingToCancel.status}</p>
                                </div>
                            </div>
                            <div className="confirm-modal-footer">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => {
                                        setShowCancelConfirm(false);
                                        setBookingToCancel(null);
                                    }}
                                >
                                    Keep Booking
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={confirmCancelBooking}
                                >
                                    Yes, Cancel Booking
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chatbot Button */}
                <button 
                    className={`chatbot-button ${showChatbot ? 'active' : ''}`}
                    onClick={() => setShowChatbot(!showChatbot)}
                >
                    {showChatbot ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.5 3C19.43 3 21 4.57 21 6.5V10.5C21 11.33 20.33 12 19.5 12H18V14.5C18 15.88 16.88 17 15.5 17H13.5V19.5C13.5 20.33 12.83 21 12 21C11.17 21 10.5 20.33 10.5 19.5V17H8.5C7.12 17 6 15.88 6 14.5V12H4.5C3.67 12 3 11.33 3 10.5V6.5C3 4.57 4.57 3 6.5 3H17.5M17.5 5H6.5C5.67 5 5 5.67 5 6.5V10H6.5C7.88 10 9 11.12 9 12.5V14.5C9 14.78 9.22 15 9.5 15H14.5C14.78 15 15 14.78 15 14.5V12.5C15 11.12 16.12 10 17.5 10H19V6.5C19 5.67 18.33 5 17.5 5M11.5 8.5C11.5 9.33 10.83 10 10 10S8.5 9.33 8.5 8.5 9.17 7 10 7 11.5 7.67 11.5 8.5M15.5 8.5C15.5 9.33 14.83 10 14 10S12.5 9.33 12.5 8.5 13.17 7 14 7 15.5 7.67 15.5 8.5Z"/>
                            </svg>
                            <span className="chatbot-notification"></span>
                        </>
                    )}
                </button>

                {/* Chatbot Window */}
                {showChatbot && (
                    <div className="chatbot-window">
                        <div className="chatbot-header">
                            <div className="chatbot-header-info">
                                <div className="chatbot-avatar">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.5 3C19.43 3 21 4.57 21 6.5V10.5C21 11.33 20.33 12 19.5 12H18V14.5C18 15.88 16.88 17 15.5 17H13.5V19.5C13.5 20.33 12.83 21 12 21C11.17 21 10.5 20.33 10.5 19.5V17H8.5C7.12 17 6 15.88 6 14.5V12H4.5C3.67 12 3 11.33 3 10.5V6.5C3 4.57 4.57 3 6.5 3H17.5M17.5 5H6.5C5.67 5 5 5.67 5 6.5V10H6.5C7.88 10 9 11.12 9 12.5V14.5C9 14.78 9.22 15 9.5 15H14.5C14.78 15 15 14.78 15 14.5V12.5C15 11.12 16.12 10 17.5 10H19V6.5C19 5.67 18.33 5 17.5 5M11.5 8.5C11.5 9.33 10.83 10 10 10S8.5 9.33 8.5 8.5 9.17 7 10 7 11.5 7.67 11.5 8.5M15.5 8.5C15.5 9.33 14.83 10 14 10S12.5 9.33 12.5 8.5 13.17 7 14 7 15.5 7.67 15.5 8.5Z"/>
                                    </svg>
                                </div>
                                <div className="chatbot-header-text">
                                    <h3>HotelMaster Bot 🤖</h3>
                                    <p>Online • Ready to help</p>
                                </div>
                            </div>
                            <button className="chatbot-close" onClick={() => setShowChatbot(false)}>
                                ×
                            </button>
                        </div>

                        <div className="chatbot-messages">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.type}`}>
                                    <div className={`message-bubble ${msg.isTyping ? 'typing-message' : ''}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="chatbot-input-area">
                            <form className="chatbot-input-wrapper" onSubmit={handleSendMessage}>
                                <input 
                                    type="text"
                                    className="chatbot-input"
                                    placeholder="Type your message..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    className="chatbot-send"
                                    disabled={!chatInput.trim()}
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
