const express = require("express");

const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


// GET ALL CONVERSATIONS & UNREAD COUNTS FOR CURRENT USER
router.get(
    "/conversations",
    authMiddleware.authUser,
    messageController.getConversations
);


// MARK MESSAGES AS READ IN A CONVERSATION
router.patch(
    "/read/:conversationId",
    authMiddleware.authUser,
    messageController.markAsRead
);


// GET MESSAGES FOR A CONVERSATION
router.get(
    "/:conversationId",
    authMiddleware.authUser,
    messageController.getMessages
);


// SEND MESSAGE (REST fallback)
router.post(
    "/",
    authMiddleware.authUser,
    messageController.sendMessage
);


module.exports = router;
