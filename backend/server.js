require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectedDB = require('./src/db/db');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const userModel = require('./src/models/auth.model');
const ServiceRequest = require('./src/models/serviceRequest.model');
const Message = require('./src/models/message.model');


connectedDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});


// ========================================
// SOCKET.IO MIDDLEWARE — AUTH
// ========================================
io.use(async (socket, next) => {
    try {
        const cookies = socket.handshake.headers.cookie;

        if (!cookies) {
            return next(new Error("Authentication error"));
        }

        const tokenCookie = cookies
            .split(";")
            .find((c) => c.trim().startsWith("token="));

        if (!tokenCookie) {
            return next(new Error("Authentication error"));
        }

        const token = tokenCookie.split("=")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
        };

        next();

    } catch (err) {
        console.log("Socket auth error:", err.message);
        next(new Error("Authentication error"));
    }
});


// ========================================
// SOCKET.IO EVENT HANDLERS
// ========================================
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

    // Join personal user room for targeted notifications & unread counts
    socket.join(socket.user._id);

    // JOIN CONVERSATION ROOM
    socket.on("join-room", (conversationId) => {
        socket.join(conversationId);
        console.log(`${socket.user.name} joined room: ${conversationId}`);
    });

    // SEND MESSAGE
    socket.on("send-message", async (data) => {
        try {
            const { conversationId, message } = data;

            if (!conversationId || !message) {
                return;
            }

            const serviceRequest = await ServiceRequest.findById(conversationId);

            if (!serviceRequest) {
                return;
            }

            const userId = socket.user._id;
            const isRequester = serviceRequest.requesterId.toString() === userId;
            const isOwner = serviceRequest.gigOwnerId.toString() === userId;

            if (!isRequester && !isOwner) {
                return;
            }

            if (serviceRequest.status !== "accepted" && serviceRequest.status !== "completed") {
                return;
            }

            const receiverId = isRequester
                ? serviceRequest.gigOwnerId
                : serviceRequest.requesterId;

            const newMessage = await Message.create({
                conversationId,
                senderId: userId,
                receiverId,
                message,
                isRead: false,
            });

            const populatedMessage = await Message.findById(newMessage._id)
                .populate("senderId", "name profilePicture")
                .populate("receiverId", "name profilePicture");

            // Emit to room
            io.to(conversationId).emit("receive-message", populatedMessage);

            // Broadcast unread update notification to receiver's personal user room
            io.to(receiverId.toString()).emit("unread-update", {
                conversationId,
                message: populatedMessage,
            });

        } catch (error) {
            console.log("Socket send-message error:", error.message);
        }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user.name}`);
    });
});


server.listen(3000, () => {
    console.log('server is connected to port 3000');
});