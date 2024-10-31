import express from 'express';
import verifyToken from '../middleware/verify-token.js';
import {
    sendMessage,
    getConversation,
    getAllConversations,
    markAsRead
} from '../controllers/messages.js';

const   router = express.Router();

/**
 * Message Routes
 * Handles all routes related to messaging between clients and providers
 */

// Send a message
router.post('/', verifyToken, sendMessage);

// Get specific conversation
router.get('/conversation/:otherUserId', verifyToken, getConversation);

// Get all conversations
router.get('/conversations', verifyToken, getAllConversations);

// Mark messages as read
router.put('/read/:conversationId', verifyToken, markAsRead);

export default router;
