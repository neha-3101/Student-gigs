const Message = require("../models/message.model");
const ServiceRequest = require("../models/serviceRequest.model");
const userModel = require("../models/auth.model");


// ========================================
// GET MESSAGES FOR A CONVERSATION
// ========================================
async function getMessages(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const { conversationId } = req.params;

        // Find the service request (conversation)
        const serviceRequest = await ServiceRequest.findById(conversationId);

        if (!serviceRequest) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        // Verify the user is a participant
        const isRequester = serviceRequest.requesterId.toString() === user._id.toString();
        const isOwner = serviceRequest.gigOwnerId.toString() === user._id.toString();

        if (!isRequester && !isOwner) {
            return res.status(403).json({
                message: "You are not authorized to view this conversation",
            });
        }

        // Mark unread messages received by this user in this conversation as read
        await Message.updateMany(
            {
                conversationId: conversationId,
                receiverId: user._id,
                isRead: false,
            },
            {
                $set: { isRead: true, readAt: new Date() },
            }
        );

        const messages = await Message.find({
            conversationId: conversationId,
        })
            .populate("senderId", "name profilePicture")
            .populate("receiverId", "name profilePicture")
            .sort({ createdAt: 1 });

        res.status(200).json({
            message: "Messages fetched successfully",
            messages,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message,
        });
    }
}


// ========================================
// MARK MESSAGES AS READ
// ========================================
async function markAsRead(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const { conversationId } = req.params;

        await Message.updateMany(
            {
                conversationId: conversationId,
                receiverId: user._id,
                isRead: false,
            },
            {
                $set: { isRead: true, readAt: new Date() },
            }
        );

        res.status(200).json({
            message: "Messages marked as read",
            conversationId,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to mark messages as read",
            error: error.message,
        });
    }
}


// ========================================
// GET ALL CONVERSATIONS & UNREAD COUNTS FOR CURRENT USER
// ========================================
async function getConversations(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        // Find all active requests where user is participant
        const serviceRequests = await ServiceRequest.find({
            $or: [{ requesterId: user._id }, { gigOwnerId: user._id }],
            status: { $in: ["accepted", "completed", "pending"] },
        })
            .populate("gigId", "title category price")
            .populate("requesterId", "name email profilePicture")
            .populate("gigOwnerId", "name email profilePicture")
            .sort({ updatedAt: -1 });

        let totalUnreadCount = 0;
        const conversations = [];

        for (const reqItem of serviceRequests) {
            // Find latest message
            const latestMsg = await Message.findOne({
                conversationId: reqItem._id,
            })
                .sort({ createdAt: -1 })
                .populate("senderId", "name profilePicture");

            // Count unread messages for this user
            const unreadCount = await Message.countDocuments({
                conversationId: reqItem._id,
                receiverId: user._id,
                isRead: false,
            });

            totalUnreadCount += unreadCount;

            const isRequester = reqItem.requesterId._id.toString() === user._id.toString();
            const otherUser = isRequester ? reqItem.gigOwnerId : reqItem.requesterId;

            conversations.push({
                requestId: reqItem._id,
                status: reqItem.status,
                gig: reqItem.gigId,
                otherUser: otherUser,
                latestMessage: latestMsg ? latestMsg.message : (reqItem.status === "pending" ? "Request Pending" : "Connected"),
                latestMessageSender: latestMsg ? latestMsg.senderId?.name : "",
                updatedAt: latestMsg ? latestMsg.createdAt : reqItem.updatedAt,
                unreadCount: unreadCount,
            });
        }

        // Sort conversations by latest message timestamp
        conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        res.status(200).json({
            message: "Conversations fetched successfully",
            totalUnreadCount,
            conversations,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch conversations",
            error: error.message,
        });
    }
}


// ========================================
// SEND MESSAGE (REST fallback)
// ========================================
async function sendMessage(req, res) {
    try {
        const user = await userModel.findOne({
            email: req.user.email,
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const { conversationId, message } = req.body;

        if (!conversationId || !message) {
            return res.status(400).json({
                message: "conversationId and message are required",
            });
        }

        const serviceRequest = await ServiceRequest.findById(conversationId);

        if (!serviceRequest) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const isRequester = serviceRequest.requesterId.toString() === user._id.toString();
        const isOwner = serviceRequest.gigOwnerId.toString() === user._id.toString();

        if (!isRequester && !isOwner) {
            return res.status(403).json({
                message: "You are not authorized to send messages in this conversation",
            });
        }

        if (serviceRequest.status !== "accepted" && serviceRequest.status !== "completed") {
            return res.status(400).json({
                message: "Chat is only available for accepted requests",
            });
        }

        const receiverId = isRequester
            ? serviceRequest.gigOwnerId
            : serviceRequest.requesterId;

        const newMessage = await Message.create({
            conversationId,
            senderId: user._id,
            receiverId,
            message,
            isRead: false,
        });

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("senderId", "name profilePicture")
            .populate("receiverId", "name profilePicture");

        res.status(201).json({
            message: "Message sent successfully",
            data: populatedMessage,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to send message",
            error: error.message,
        });
    }
}


module.exports = {
    getMessages,
    markAsRead,
    getConversations,
    sendMessage,
};
