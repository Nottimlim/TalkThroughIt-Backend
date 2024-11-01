import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import {
    sendMessage,
    getConversation,
    getAllConversations,
    markAsRead
} from '../controllers/messages.js';

const   router = express.Router();

// Send a message
router.post('/', verifyToken, sendMessage);
// conversations
// router.get('/conversations', verifyToken, getConversations);

// Get specific conversation
router.get('/conversation/:otherUserId', verifyToken, getConversation);

// Get all conversations
router.get('/conversations', verifyToken, getAllConversations);

// Mark messages as read
router.put('/read/:conversationId', verifyToken, markAsRead);

export default router;
