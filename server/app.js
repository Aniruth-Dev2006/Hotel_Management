const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Notification Configuration ---
const ADMIN_PHONE = '919361377458'; // Your phone number (with country code)
const NOTIFICATIONS_DIR = path.join(__dirname, 'notifications');
const NOTIFICATIONS_FILE = path.join(NOTIFICATIONS_DIR, 'booking_notifications.txt');

// Create notifications directory if it doesn't exist
if (!fs.existsSync(NOTIFICATIONS_DIR)) {
    fs.mkdirSync(NOTIFICATIONS_DIR, { recursive: true });
}


const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || 'YOUR_API_KEY_HERE';

let whatsappEnabled = false;
if (CALLMEBOT_API_KEY !== 'YOUR_API_KEY_HERE') {
    whatsappEnabled = true;
    console.log('✅ CallMeBot WhatsApp API configured');
    console.log(`📱 WhatsApp notifications will be sent to: ${ADMIN_PHONE}`);
} else {
    console.log('⚠️ WhatsApp API key not configured');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 TO ENABLE WHATSAPP NOTIFICATIONS (Takes 30 seconds):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('1. Save this number: +34 644 51 44 80');
    console.log('2. Send WhatsApp message: I allow callmebot to send me messages');
    console.log('3. You will receive your API key immediately');
    console.log('4. Open server/app.js');
    console.log('5. Replace YOUR_API_KEY_HERE with your actual key (line 30)');
    console.log('6. Restart server');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📝 For now: Notifications saved to file and console');
}

// --- Multi-Channel Notification System ---
function saveNotificationToFile(toNumber, message, notificationType) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const separator = '='.repeat(80);
    const notification = `
${separator}
📱 NOTIFICATION FOR: ${toNumber}
⏰ TIME: ${timestamp}
📋 TYPE: ${notificationType}
${separator}

${message}

${separator}

`;
    
    try {
        fs.appendFileSync(NOTIFICATIONS_FILE, notification);
        console.log(`💾 Notification saved to file for ${toNumber}`);
    } catch (error) {
        console.error('❌ Failed to save notification to file:', error.message);
    }
}

function displayConsoleNotification(toNumber, message, notificationType) {
    const boxWidth = 70;
    const line = '─'.repeat(boxWidth);
    const doubleLine = '═'.repeat(boxWidth);
    
    console.log('\n');
    console.log('┌' + doubleLine + '┐');
    console.log('│' + ' '.repeat(boxWidth) + '│');
    console.log('│' + `  🔔 ${notificationType}`.padEnd(boxWidth) + '│');
    console.log('│' + ' '.repeat(boxWidth) + '│');
    console.log('├' + line + '┤');
    console.log('│ 📱 TO: ' + toNumber.padEnd(boxWidth - 8) + '│');
    console.log('│ ⏰ TIME: ' + new Date().toLocaleTimeString('en-IN').padEnd(boxWidth - 10) + '│');
    console.log('├' + line + '┤');
    
    const messageLines = message.split('\n');
    messageLines.forEach(line => {
        if (line.trim()) {
            const chunks = line.match(/.{1,66}/g) || [line];
            chunks.forEach(chunk => {
                console.log('│ ' + chunk.padEnd(boxWidth - 2) + ' │');
            });
        }
    });
    
    console.log('└' + doubleLine + '┘');
    console.log('\n');
}

async function sendWhatsAppViaCallMeBot(phoneNumber, message) {
    try {
        // CallMeBot API endpoint
        const url = `https://api.callmebot.com/whatsapp.php`;
        
        // URL encode the message
        const encodedMessage = encodeURIComponent(message);
        
        // Make the API call
        const response = await axios.get(url, {
            params: {
                phone: phoneNumber,
                text: encodedMessage,
                apikey: CALLMEBOT_API_KEY
            },
            timeout: 10000 // 10 second timeout
        });
        
        if (response.status === 200) {
            console.log(`✅ WhatsApp message sent successfully to ${phoneNumber}!`);
            return { success: true };
        } else {
            console.log(`⚠️ WhatsApp API returned status: ${response.status}`);
            return { success: false, error: 'Unexpected response status' };
        }
    } catch (error) {
        console.error(`❌ Failed to send WhatsApp: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function sendNotification(toNumber, message, notificationType = 'NOTIFICATION') {
    // Always display in console with nice formatting
    displayConsoleNotification(toNumber, message, notificationType);
    
    // Always save to file
    saveNotificationToFile(toNumber, message, notificationType);
    
    // Try to send via WhatsApp if configured
    if (whatsappEnabled) {
        try {
            await sendWhatsAppViaCallMeBot(ADMIN_PHONE, `🔔 ${notificationType}\n\n${message}`);
            console.log(`📱 WhatsApp notification sent!\n`);
            return { success: true, channels: ['console', 'file', 'whatsapp'] };
        } catch (error) {
            console.error(`⚠️ WhatsApp failed (but console & file notification sent): ${error.message}\n`);
            return { success: true, channels: ['console', 'file'], whatsappError: error.message };
        }
    } else {
        console.log(`📝 WhatsApp not enabled - notification saved to console & file only\n`);
    }
    
    return { success: true, channels: ['console', 'file'] };
}

// --- MongoDB Connection ---
mongoose.connect("mongodb://localhost:27017/HotelDB");

// --- Mongoose Schemas and Models ---

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Admin = mongoose.model("Admin", adminSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['Single', 'Double', 'Suite'] },
    price: { type: Number, required: true },
    hasAC: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
    isBooked: { type: Boolean, default: false }
});
const Room = mongoose.model('Room', roomSchema);

// UPDATED: Booking schema has a more detailed status enum and user association
const bookingSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: { type: String, enum: ['Requested', 'Confirmed', 'Active', 'Completed', 'Rejected'], default: 'Requested' },
    createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);


// --- API Endpoints ---

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }

        // Check if admin with this email exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }

        // Create new user with all details
        const newUser = new User({ name, email, password, phone });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful! Please login.', user: { name, email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin) {
            if (admin.password === password) {
                return res.json({ 
                    message: 'Admin login successful!', 
                    role: 'admin',
                    user: { id: admin._id, email: admin.email }
                });
            }
            return res.status(400).json('Invalid credentials.');
        }
        const user = await User.findOne({ email });
        if (user) {
            if (user.password === password) {
                return res.json({ 
                    message: 'User login successful!', 
                    role: 'user',
                    user: { 
                        id: user._id, 
                        name: user.name, 
                        email: user.email, 
                        phone: user.phone,
                        createdAt: user.createdAt 
                    }
                });
            }
            return res.status(400).json('Invalid credentials.');
        }
        return res.status(404).json('User not found.');
    } catch (err) {
        res.status(500).json('Server error: ' + err.message);
    }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// --- Room Routes ---
app.get('/api/rooms', (req, res) => {
    Room.find()
        .then(rooms => res.json(rooms))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/api/rooms/add', async (req, res) => {
    const { roomNumber, type, price, hasAC, photoUrl } = req.body;
    const newRoom = new Room({ roomNumber, type, price, hasAC, photoUrl });
    try {
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (err) {
        res.status(400).json('Error adding room: ' + err.message);
    }
});

app.delete('/api/rooms/:id', async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json('Room not found.');
        res.json('Room deleted successfully.');
    } catch (err) {
        res.status(400).json('Error deleting room: ' + err.message);
    }
});


// --- Booking Routes (UPDATED) ---

app.get('/api/bookings', async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            // Support filtering by multiple statuses, e.g., ?status=Confirmed,Active
            const statuses = req.query.status.split(',');
            filter.status = { $in: statuses };
        }
        // Filter by user ID if provided
        if (req.query.userId) {
            filter.user = req.query.userId;
        }
        const bookings = await Booking.find(filter).populate('room').populate('user', 'name email phone');
        res.json(bookings);
    } catch (err) {
        res.status(500).json('Error fetching bookings: ' + err.message);
    }
});

// UPDATED: New bookings are now 'Requested' by default and include user association
app.post('/api/bookings/add', async (req, res) => {
    const { guestName, room, checkInDate, checkOutDate, userId } = req.body;
    try {
        if (!userId) {
            return res.status(400).json('User ID is required for booking.');
        }
        
        const newBooking = new Booking({ 
            guestName, 
            room,
            user: userId,
            checkInDate, 
            checkOutDate, 
            status: 'Requested' // All new bookings are now requests
        });
        await newBooking.save();
        
        const populatedBooking = await Booking.findById(newBooking._id)
            .populate('room')
            .populate('user', 'name email phone');
        
        // Send notifications
        const userPhone = populatedBooking.user.phone;
        const userEmail = populatedBooking.user.email;
        const roomNumber = populatedBooking.room.roomNumber;
        const roomType = populatedBooking.room.type;
        const roomPrice = populatedBooking.room.price;
        const checkIn = new Date(checkInDate).toLocaleDateString('en-IN');
        const checkOut = new Date(checkOutDate).toLocaleDateString('en-IN');
        
        // Notification to user
        const userMessage = `🏨 HotelMaster Booking Request

Hello ${guestName}! ✨

Your booking request has been received:
📍 Room: ${roomNumber} (${roomType})
💰 Price: ₹${roomPrice}/night
📅 Check-in: ${checkIn}
📅 Check-out: ${checkOut}
⏳ Status: Pending Admin Approval

We'll notify you once the admin confirms your booking!

Thank you for choosing HotelMaster! 🌟`;
        
        await sendNotification(userPhone, userMessage, 'USER BOOKING CONFIRMATION');
        
        // IMPORTANT: Notification to admin (9361377458) with ALL details
        const adminMessage = `🔔 NEW BOOKING REQUEST RECEIVED!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 GUEST DETAILS:
   Name: ${guestName}
   Phone: ${userPhone}
   Email: ${userEmail}

🏨 BOOKING DETAILS:
   Room Number: ${roomNumber}
   Room Type: ${roomType}
   Price: ₹${roomPrice}/night
   Check-in: ${checkIn}
   Check-out: ${checkOut}

📊 BOOKING STATUS:
   Status: PENDING APPROVAL
   Booking ID: ${populatedBooking._id}
   
⚡ ACTION REQUIRED:
   Please review and confirm in the admin dashboard
   Go to: Booking Requests → Accept/Reject
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        await sendNotification(ADMIN_PHONE, adminMessage, 'ADMIN ALERT - NEW BOOKING');
        
        res.status(201).json(populatedBooking);
    } catch (err) {
        res.status(400).json('Error adding booking request: ' + err.message);
    }
});

// UPDATED: This endpoint now handles the logic for accepting/rejecting requests.
app.put('/api/bookings/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('room')
            .populate('user', 'name email phone');
            
        if (!booking) return res.status(404).json('Booking not found.');

        // Logic for updating room availability based on the new status
        if (status === 'Confirmed' || status === 'Active') {
            await Room.findByIdAndUpdate(booking.room._id, { isBooked: true });
        } else if (status === 'Completed' || status === 'Rejected') {
            await Room.findByIdAndUpdate(booking.room._id, { isBooked: false });
        }

        // Send notifications based on status change
        const userPhone = booking.user.phone;
        const guestName = booking.guestName;
        const roomNumber = booking.room.roomNumber;
        const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-IN');
        const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-IN');
        
        let notificationMessage = '';
        let notificationType = '';
        
        if (status === 'Confirmed') {
            notificationType = 'BOOKING APPROVED BY ADMIN';
            notificationMessage = `✅ BOOKING CONFIRMED!

Hello ${guestName}! 🎉

Great news! Your booking has been APPROVED by the admin:

📍 Room: ${roomNumber}
📅 Check-in: ${checkIn}
📅 Check-out: ${checkOut}
✨ Status: Confirmed

You can now check-in on your arrival date from your dashboard!

See you soon at HotelMaster! 🏨`;
                
        } else if (status === 'Active') {
            notificationType = 'CHECK-IN SUCCESSFUL';
            notificationMessage = `🔑 CHECKED IN SUCCESSFULLY!

Welcome ${guestName}! 🌟

You have successfully checked into:
📍 Room: ${roomNumber}
📅 Check-out: ${checkOut}

Enjoy your stay! When you're ready to leave, you can check-out from your dashboard.

HotelMaster Team 🏨`;
                
        } else if (status === 'Completed') {
            notificationType = 'CHECK-OUT SUCCESSFUL';
            notificationMessage = `👋 CHECKED OUT SUCCESSFULLY!

Thank you for staying with us, ${guestName}! 💙

Room ${roomNumber} checkout completed.
We hope you had a wonderful experience!

We look forward to hosting you again! 🌟

HotelMaster Team 🏨`;
                
        } else if (status === 'Rejected') {
            notificationType = 'BOOKING CANCELLED';
            notificationMessage = `❌ BOOKING CANCELLED

Hello ${guestName},

Your booking request for Room ${roomNumber} has been cancelled.

📅 Dates: ${checkIn} - ${checkOut}

Please feel free to make a new booking for different dates.

Thank you for your understanding.
HotelMaster Team 🏨`;
        }
        
        if (notificationMessage) {
            await sendNotification(userPhone, notificationMessage, notificationType);
            
            // Also notify admin about status changes
            if (status === 'Active' || status === 'Completed') {
                const adminNotification = `📊 BOOKING STATUS UPDATE

Room ${roomNumber}:
Guest: ${guestName}
Status Changed: → ${status}
${status === 'Active' ? 'Guest has checked in' : 'Guest has checked out'}`;
                
                await sendNotification(ADMIN_PHONE, adminNotification, 'STATUS UPDATE');
            }
        }

        res.json(booking);
    } catch (err) {
        res.status(400).json('Error updating status: ' + err.message);
    }
});


// --- Notification Management Endpoints ---

// Get all notifications (for admin to view)
app.get('/api/notifications', (req, res) => {
    try {
        if (fs.existsSync(NOTIFICATIONS_FILE)) {
            const notifications = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
            res.json({ 
                success: true, 
                notifications: notifications,
                file: NOTIFICATIONS_FILE
            });
        } else {
            res.json({ 
                success: true, 
                notifications: 'No notifications yet.',
                message: 'Notifications will be saved here when bookings are created.'
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to read notifications: ' + error.message 
        });
    }
});

// Clear notifications (optional - for admin)
app.delete('/api/notifications/clear', (req, res) => {
    try {
        if (fs.existsSync(NOTIFICATIONS_FILE)) {
            fs.unlinkSync(NOTIFICATIONS_FILE);
        }
        res.json({ 
            success: true, 
            message: 'Notifications cleared successfully.' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to clear notifications: ' + error.message 
        });
    }
});

// --- Gemini API Chatbot Endpoint ---
app.post('/api/chatbot', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is required' 
            });
        }

        const GEMINI_API_KEY = 'AIzaSyD1iGRQIHJOuCIQ69ndP1hCHYKc5s-061Y';
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

        const systemPrompt = `You are HotelBot, the AI assistant for HotelMaster - OUR hotel management system.

Your role:
- Help guests understand our room types: Single, Double, Suite, Deluxe, and Presidential rooms.
- Explain room features like capacity, amenities (AC, furniture, bathroom facilities), and what makes each room type special.
- Guide guests on which room type suits their needs (solo travelers → Single, couples → Double, families → Suite, etc.).
- Provide information about our hotel facilities and services (if asked about restaurant, amenities, check-in/check-out times, etc.).
- Explain our booking process, cancellation policy, and how to use our system.
- Answer questions about room suitability for different occasions (business trips, family vacations, romantic getaways, etc.).

IMPORTANT RULES:
1. You work ONLY for HotelMaster. Never mention other hotels or compare with competitors.
2. DO NOT give specific prices - tell users to check the room listings in the "Browse Rooms" section for current pricing.
3. DO NOT confirm room availability - direct users to check real-time availability in the "Browse Rooms" section or make a booking request.
4. Only answer hotel-related questions. Politely decline anything unrelated (programming, math, general knowledge, etc.).
5. Be warm, professional, and helpful - like a friendly hotel receptionist.
6. When users ask about booking, guide them to use the "Book Now" button in the Browse Rooms section.
7. Keep responses concise and helpful. Don't make up amenities or features - stick to general room type information.
8. If asked about specific dates or room numbers, tell them to browse available rooms in the system.

Remember: You're here to help guests understand our rooms and guide them through OUR HotelMaster booking system!`;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser: ${message}\n\nHotelBot:`
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extract bot response
        if (response.data.candidates && response.data.candidates[0]?.content?.parts?.[0]?.text) {
            const botResponse = response.data.candidates[0].content.parts[0].text;
            res.json({ 
                success: true, 
                response: botResponse 
            });
        } else {
            throw new Error('Invalid response from Gemini API');
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get response from chatbot',
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// --- Start Server ---
app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}\n`);
    console.log('═'.repeat(70));
    console.log('🏨  HOTELMASTER NOTIFICATION SYSTEM');
    console.log('═'.repeat(70));
    console.log(`📱 Admin Phone: ${ADMIN_PHONE}`);
    console.log(`📝 Notifications File: ${NOTIFICATIONS_FILE}`);
    console.log(`🌐 View notifications: http://localhost:${PORT}/api/notifications`);
    console.log('═'.repeat(70));
    console.log('\n✅ Ready to receive bookings!\n');
});

