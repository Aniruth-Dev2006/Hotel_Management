import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:3000/api';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// --- Embedded Styles for Rooms Page (with responsive updates) ---
const RoomsStyles = () => (
    <style>{`
        .rooms-container {
            padding: 2.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        .rooms-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .rooms-header h1 {
            font-size: 2.25rem;
            font-weight: bold;
            color: #111827;
        }
        .add-room-btn {
            background-color: #4f46e5;
            color: white;
            padding: 0.6rem 1.2rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .add-room-btn:hover {
            background-color: #4338ca;
        }
        .rooms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        .room-card {
            background-color: #ffffff;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .room-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .room-card-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background-color: #f3f4f6;
        }
        .room-card-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .room-card-header h3 {
            margin: 0;
            font-size: 1.25rem;
            color: #1f2937;
        }
        .room-card-details {
            padding: 1.5rem;
        }
        .room-card-details p {
            margin: 0 0 0.75rem 0;
            color: #4b5563;
        }
        .room-card-footer {
            background-color: #f9fafb;
            padding: 1rem 1.5rem;
            text-align: right;
        }
        .delete-room-btn {
            background-color: #fee2e2;
            color: #dc2626;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background-color 0.2s;
        }
        .delete-room-btn:hover {
            background-color: #fca5a5;
        }
        .status-booked { color: #ef4444; font-weight: 500; }
        .status-available { color: #10b981; font-weight: 500; }
        
        /* Modal Styles - Modern & Scrollable */
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
            padding: 1rem;
            overflow-y: auto;
        }
        .modal-content { 
            background: linear-gradient(to bottom, #ffffff, #f9fafb);
            border-radius: 1rem;
            width: 100%; 
            max-width: 550px; 
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(79, 70, 229, 0.1);
            animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .modal-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 1.5rem 2rem;
            border-bottom: 2px solid #e5e7eb;
            background: white;
            position: sticky;
            top: 0;
            z-index: 10;
            border-radius: 1rem 1rem 0 0;
        }
        .modal-header h2 { 
            margin: 0; 
            font-size: 1.5rem;
            color: #111827;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .modal-header h2::before {
            content: '🏨';
            font-size: 1.75rem;
        }
        .modal-close-btn {
            background: #f3f4f6;
            border: none;
            color: #6b7280;
            font-size: 1.5rem;
            cursor: pointer;
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .modal-close-btn:hover {
            background: #ef4444;
            color: white;
            transform: rotate(90deg);
        }
        
        .modal-body { 
            padding: 2rem;
            overflow-y: auto;
            max-height: calc(90vh - 180px);
        }
        .modal-body .input-group { 
            margin-bottom: 1.5rem; 
            text-align: left; 
        }
        .modal-body .input-group label { 
            display: block; 
            margin-bottom: 0.5rem; 
            font-weight: 600;
            color: #374151;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }
        .modal-body .input-group input, 
        .modal-body .input-group select { 
            width: 100%; 
            padding: 0.875rem; 
            border: 2px solid #e5e7eb; 
            border-radius: 0.5rem; 
            box-sizing: border-box;
            font-size: 1rem;
            transition: all 0.2s;
            background: white;
        }
        .modal-body .input-group input:focus, 
        .modal-body .input-group select:focus { 
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        .modal-body .input-group input[type="file"] {
            padding: 0.5rem;
            cursor: pointer;
        }
        .modal-body .input-group small {
            display: block;
            margin-top: 0.5rem;
            color: #6b7280;
            font-size: 0.75rem;
        }
        
        .photo-preview-container {
            margin-top: 1rem;
            border-radius: 0.75rem;
            overflow: hidden;
            border: 2px dashed #d1d5db;
            padding: 0.5rem;
            background: #f9fafb;
        }
        .photo-preview-container img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 0.5rem;
        }
        
        .modal-footer { 
            display: flex; 
            justify-content: flex-end; 
            gap: 0.75rem; 
            padding: 1.5rem 2rem;
            border-top: 2px solid #e5e7eb;
            background: white;
            position: sticky;
            bottom: 0;
            z-index: 10;
            border-radius: 0 0 1rem 1rem;
        }
        .btn { 
            padding: 0.75rem 1.5rem; 
            border: none; 
            border-radius: 0.5rem; 
            cursor: pointer; 
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .btn-primary { 
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
        }
        .btn-primary:hover {
            background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px -1px rgba(79, 70, 229, 0.4);
        }
        .btn-danger { 
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
        }
        .btn-danger:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px -1px rgba(239, 68, 68, 0.4);
        }
        .btn-secondary { 
            background: #f3f4f6;
            color: #374151;
            border: 2px solid #e5e7eb;
        }
        .btn-secondary:hover {
            background: #e5e7eb;
            border-color: #d1d5db;
        }
        .input-group.checkbox-group { 
            display: flex !important; 
            align-items: center !important; 
            gap: 0.75rem !important;
            padding: 1rem !important;
            background: #f0f4ff !important;
            border-radius: 0.5rem !important;
            border: 2px solid #e0e7ff !important;
            margin-bottom: 1.5rem !important;
            flex-direction: row !important;
        }
        .input-group.checkbox-group input[type="checkbox"] {
            width: 1.25rem !important;
            height: 1.25rem !important;
            cursor: pointer !important;
            accent-color: #4f46e5 !important;
            margin: 0 !important;
        }
            .input-group.checkbox-group label {
            margin: 0 !important;
            font-weight: 500 !important;
            text-transform: none !important;
            color: #1f2937 !important;
            font-size: 1rem !important;
            cursor: pointer !important;
            letter-spacing: normal !important;
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
        @media (max-width: 640px) {
            .rooms-container {
                padding: 1.5rem;
            }

            .rooms-header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
                text-align: center;
            }

            .rooms-header h1 {
                font-size: 1.75rem;
            }

            .rooms-grid {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            }
            
            .modal-overlay {
                padding: 0.5rem;
                align-items: flex-start;
                padding-top: 2rem;
            }
            
            .modal-content {
                width: 100%;
                max-width: 100%;
                margin: 0 auto;
            }
            
            .modal-header {
                padding: 1rem 1.5rem;
            }
            
            .modal-header h2 {
                font-size: 1.25rem;
            }
            
            .modal-body {
                padding: 1.5rem;
                max-height: calc(80vh - 180px);
            }
            
            .modal-footer {
                padding: 1rem 1.5rem;
                flex-direction: column;
            }
            
            .modal-footer .btn {
                width: 100%;
            }
            
            .photo-preview-container img {
                height: 150px;
            }
        }
    `}</style>
);


// --- Rooms Page Component ---
export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [roomToEdit, setRoomToEdit] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [newRoomData, setNewRoomData] = useState({
        roomNumber: '',
        type: 'Single',
        price: '',
        hasAC: false,
    });
    const [editRoomData, setEditRoomData] = useState({
        roomNumber: '',
        type: 'Single',
        price: '',
        hasAC: false,
    });

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error("Failed to fetch rooms", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRoomData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('File size should be less than 5MB. Please choose a smaller file.');
                setShowErrorModal(true);
                e.target.value = null;
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('roomNumber', newRoomData.roomNumber);
            formData.append('type', newRoomData.type);
            formData.append('price', newRoomData.price);
            formData.append('hasAC', newRoomData.hasAC);
            
            if (selectedFile) {
                formData.append('roomPhoto', selectedFile);
            }
            
            await apiClient.post('/rooms/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setShowAddModal(false);
            setNewRoomData({ roomNumber: '', type: 'Single', price: '', hasAC: false });
            setSelectedFile(null);
            setPhotoPreview(null);
            fetchRooms();
        } catch (error) {
            setErrorMessage('Failed to add room. The room number may already exist. Please try a different room number.');
            setShowErrorModal(true);
            console.error("Add room error:", error);
        }
    };
    
    const handleEditClick = (room) => {
        setRoomToEdit(room);
        setEditRoomData({
            roomNumber: room.roomNumber,
            type: room.type,
            price: room.price,
            hasAC: room.hasAC
        });
        setPhotoPreview(room.photoUrl || null);
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditRoomData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleEditRoom = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('roomNumber', editRoomData.roomNumber);
            formData.append('type', editRoomData.type);
            formData.append('price', editRoomData.price);
            formData.append('hasAC', editRoomData.hasAC);
            
            // Update room data
            await apiClient.put(`/rooms/${roomToEdit._id}`, {
                roomNumber: editRoomData.roomNumber,
                type: editRoomData.type,
                price: Number(editRoomData.price),
                hasAC: editRoomData.hasAC
            });

            // Upload new photo if selected
            if (selectedFile) {
                const photoFormData = new FormData();
                photoFormData.append('roomPhoto', selectedFile);
                await apiClient.post(`/rooms/${roomToEdit._id}/upload-photo`, photoFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            setShowEditModal(false);
            setRoomToEdit(null);
            setSelectedFile(null);
            setPhotoPreview(null);
            fetchRooms();
        } catch (error) {
            setErrorMessage('Failed to update room. The room number may already exist or there was a network error.');
            setShowErrorModal(true);
            console.error("Edit room error:", error);
        }
    };

    const handleDeleteClick = (room) => {
        setRoomToDelete(room);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!roomToDelete) return;
        try {
            await apiClient.delete(`/rooms/${roomToDelete._id}`);
            setShowDeleteModal(false);
            setRoomToDelete(null);
            fetchRooms();
        } catch (error) {
            setShowDeleteModal(false);
            setErrorMessage('Failed to delete room. The room may have active bookings or there was a network error.');
            setShowErrorModal(true);
            console.error("Delete room error:", error);
        }
    };

    if (loading) return <p style={{textAlign: 'center', paddingTop: '2rem'}}>Loading rooms...</p>;

    return (
        <>
            <RoomsStyles />
            <div className="rooms-container">
                <div className="rooms-header">
                    <h1>Manage Rooms</h1>
                    <button onClick={() => setShowAddModal(true)} className="add-room-btn">+ Add New Room</button>
                </div>
                <div className="rooms-grid">
                    {rooms.map(room => (
                        <div key={room._id} className="room-card">
                            <img
                                src={room.photoUrl || 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=No+Image'}
                                alt={`Room ${room.roomNumber}`}
                                className="room-card-image"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/e2e8f0?text=No+Image'; }}
                            />
                            <div className="room-card-header">
                                <h3>Room {room.roomNumber}</h3>
                                <span className={room.isBooked ? 'status-booked' : 'status-available'}>
                                    {room.isBooked ? 'Booked' : 'Available'}
                                </span>
                            </div>
                            <div className="room-card-details">
                                <p><strong>Type:</strong> {room.type}</p>
                                <p><strong>Price:</strong> ₹{room.price} / night</p>
                                <p><strong>Air Conditioning:</strong> {room.hasAC ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="room-card-footer" style={{display: 'flex', gap: '0.5rem', justifyContent: 'space-between'}}>
                                <button 
                                    onClick={() => handleEditClick(room)} 
                                    className="edit-room-btn"
                                    style={{
                                        backgroundColor: '#dbeafe',
                                        color: '#1e40af',
                                        padding: '0.5rem 1rem',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        transition: 'background-color 0.2s',
                                        fontWeight: '500'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#93c5fd'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#dbeafe'}
                                >
                                    ✏️ Edit
                                </button>
                                <button onClick={() => handleDeleteClick(room)} className="delete-room-btn">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && rooms.length === 0 && <p>No rooms found. Add one to get started!</p>}
            </div>

            {/* Add Room Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target.className === 'modal-overlay') {
                        setShowAddModal(false);
                        setSelectedFile(null);
                        setPhotoPreview(null);
                    }
                }}>
                    <div className="modal-content">
                        <form onSubmit={handleAddRoom}>
                            <div className="modal-header">
                                <h2>Add New Room</h2>
                                <button 
                                    type="button" 
                                    className="modal-close-btn"
                                    onClick={() => { 
                                        setShowAddModal(false); 
                                        setSelectedFile(null); 
                                        setPhotoPreview(null); 
                                    }}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group">
                                    <label htmlFor="roomNumber">🔢 Room Number</label>
                                    <input 
                                        id="roomNumber" 
                                        name="roomNumber" 
                                        value={newRoomData.roomNumber} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g., 101, 202, etc."
                                        required 
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="roomPhoto">📸 Room Photo</label>
                                    <input 
                                        id="roomPhoto" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                    />
                                    <small>Max file size: 5MB. Formats: JPG, PNG, GIF</small>
                                    {photoPreview && (
                                        <div className="photo-preview-container">
                                            <img 
                                                src={photoPreview} 
                                                alt="Preview" 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="type">🛏️ Room Type</label>
                                    <select id="type" name="type" value={newRoomData.type} onChange={handleInputChange}>
                                        <option value="Single">Single Room</option>
                                        <option value="Double">Double Room</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="price">💰 Price Per Night</label>
                                    <input 
                                        id="price" 
                                        name="price" 
                                        type="number" 
                                        value={newRoomData.price} 
                                        onChange={handleInputChange} 
                                        placeholder="Enter price in ₹"
                                        required 
                                        min="1" 
                                    />
                                </div>
                                <div className="input-group checkbox-group">
                                    <input 
                                        name="hasAC" 
                                        type="checkbox" 
                                        checked={newRoomData.hasAC} 
                                        onChange={handleInputChange} 
                                        id="hasAC"
                                    />
                                    <label htmlFor="hasAC">❄️ Air Conditioning Available</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    onClick={() => { 
                                        setShowAddModal(false); 
                                        setSelectedFile(null); 
                                        setPhotoPreview(null); 
                                    }} 
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    ✓ Add Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Room Modal */}
            {showEditModal && roomToEdit && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target.className === 'modal-overlay') {
                        setShowEditModal(false);
                        setRoomToEdit(null);
                        setSelectedFile(null);
                        setPhotoPreview(roomToEdit.photoUrl || null);
                    }
                }}>
                    <div className="modal-content">
                        <form onSubmit={handleEditRoom}>
                            <div className="modal-header">
                                <h2>Edit Room {roomToEdit.roomNumber}</h2>
                                <button 
                                    type="button" 
                                    className="modal-close-btn"
                                    onClick={() => { 
                                        setShowEditModal(false); 
                                        setRoomToEdit(null);
                                        setSelectedFile(null); 
                                        setPhotoPreview(null); 
                                    }}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group">
                                    <label htmlFor="editRoomNumber">🔢 Room Number</label>
                                    <input 
                                        id="editRoomNumber" 
                                        name="roomNumber" 
                                        value={editRoomData.roomNumber} 
                                        onChange={handleEditInputChange} 
                                        placeholder="e.g., 101, 202, etc."
                                        required 
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="editRoomPhoto">📸 Room Photo</label>
                                    <input 
                                        id="editRoomPhoto" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                    />
                                    <small>Change photo (optional). Max file size: 5MB. Formats: JPG, PNG, GIF</small>
                                    {photoPreview && (
                                        <div className="photo-preview-container">
                                            <img 
                                                src={photoPreview} 
                                                alt="Preview" 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="editType">🛏️ Room Type</label>
                                    <select id="editType" name="type" value={editRoomData.type} onChange={handleEditInputChange}>
                                        <option value="Single">Single Room</option>
                                        <option value="Double">Double Room</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="editPrice">💰 Price Per Night</label>
                                    <input 
                                        id="editPrice" 
                                        name="price" 
                                        type="number" 
                                        value={editRoomData.price} 
                                        onChange={handleEditInputChange} 
                                        placeholder="Enter price in ₹"
                                        required 
                                        min="1" 
                                    />
                                </div>
                                <div className="input-group checkbox-group">
                                    <input 
                                        name="hasAC" 
                                        type="checkbox" 
                                        checked={editRoomData.hasAC} 
                                        onChange={handleEditInputChange} 
                                        id="editHasAC"
                                    />
                                    <label htmlFor="editHasAC">❄️ Air Conditioning Available</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    onClick={() => { 
                                        setShowEditModal(false); 
                                        setRoomToEdit(null);
                                        setSelectedFile(null); 
                                        setPhotoPreview(null); 
                                    }} 
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    💾 Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target.className === 'modal-overlay') {
                        setShowDeleteModal(false);
                    }
                }}>
                    <div className="modal-content" style={{maxWidth: '450px'}}>
                        <div className="modal-header">
                            <h2 style={{color: '#ef4444'}}>⚠️ Confirm Deletion</h2>
                            <button 
                                type="button" 
                                className="modal-close-btn"
                                onClick={() => setShowDeleteModal(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body" style={{textAlign: 'center'}}>
                            <div style={{
                                background: '#fee2e2',
                                padding: '1.5rem',
                                borderRadius: '0.75rem',
                                marginBottom: '1rem'
                            }}>
                                <p style={{margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: '#991b1b', fontWeight: '600'}}>
                                    Are you sure you want to delete
                                </p>
                                <p style={{margin: '0', fontSize: '1.25rem', color: '#dc2626', fontWeight: '700'}}>
                                    Room {roomToDelete?.roomNumber}?
                                </p>
                            </div>
                            <p style={{color: '#6b7280', fontSize: '0.875rem', margin: '1rem 0 0 0'}}>
                                ⚠️ This action cannot be undone and will permanently delete all room data.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                onClick={() => setShowDeleteModal(false)} 
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                onClick={confirmDelete} 
                                className="btn btn-danger"
                            >
                                🗑️ Delete Room
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
        </>
    );
}

