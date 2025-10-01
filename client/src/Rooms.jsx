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
        
        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;}
        .modal-content { background-color: white; padding: 2rem; border-radius: 0.75rem; width: 100%; max-width: 500px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header h2 { margin: 0; font-size: 1.5rem; }
        .modal-body .input-group { margin-bottom: 1rem; text-align: left; }
        .modal-body .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        .modal-body .input-group input, .modal-body .input-group select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; box-sizing: border-box; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 2rem; }
        .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; }
        .btn-primary { background-color: #4f46e5; color: white; }
        .btn-danger { background-color: #ef4444; color: white; }
        .btn-secondary { background-color: #e5e7eb; color: #1f2937; }
        .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
        
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
                font-size: 1.75rem; /* Slightly smaller title on mobile */
            }

            .rooms-grid {
                /* Adjust grid to have a smaller minimum on mobile */
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            }
            
            .modal-content {
                width: 90%;
                padding: 1.5rem;
            }
        }
    `}</style>
);


// --- Rooms Page Component ---
export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [newRoomData, setNewRoomData] = useState({
        roomNumber: '',
        type: 'Single',
        price: '',
        hasAC: false,
        photoUrl: '',
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

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/rooms/add', {
                ...newRoomData,
                price: Number(newRoomData.price)
            });
            setShowAddModal(false);
            setNewRoomData({ roomNumber: '', type: 'Single', price: '', hasAC: false, photoUrl: '' });
            fetchRooms();
        } catch (error) {
            alert('Failed to add room. The room number may already exist.');
            console.error("Add room error:", error);
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
            alert('Failed to delete room.');
            console.error("Delete room error:", error);
            setShowDeleteModal(false);
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
                            <div className="room-card-footer">
                                <button onClick={() => handleDeleteClick(room)} className="delete-room-btn">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && rooms.length === 0 && <p>No rooms found. Add one to get started!</p>}
            </div>

            {/* Add Room Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form onSubmit={handleAddRoom}>
                            <div className="modal-header"><h2>Add New Room</h2></div>
                            <div className="modal-body">
                                <div className="input-group">
                                    <label htmlFor="roomNumber">Room Number</label>
                                    <input id="roomNumber" name="roomNumber" value={newRoomData.roomNumber} onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="photoUrl">Photo URL</label>
                                    <input id="photoUrl" name="photoUrl" type="url" value={newRoomData.photoUrl} onChange={handleInputChange} placeholder="https://example.com/image.png" />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="type">Type</label>
                                    <select id="type" name="type" value={newRoomData.type} onChange={handleInputChange}>
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="price">Price per Night</label>
                                    <input id="price" name="price" type="number" value={newRoomData.price} onChange={handleInputChange} required min="1" />
                                </div>
                                <div className="input-group checkbox-group">
                                    <input name="hasAC" type="checkbox" checked={newRoomData.hasAC} onChange={handleInputChange} id="hasAC"/>
                                    <label htmlFor="hasAC">Includes Air Conditioning</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header"><h2>Confirm Deletion</h2></div>
                        <div className="modal-body">
                            <p>Are you sure you want to permanently delete Room <strong>{roomToDelete?.roomNumber}</strong>?</p>
                            <p>This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">Cancel</button>
                            <button type="button" onClick={confirmDelete} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

