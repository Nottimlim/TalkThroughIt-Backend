import Message from '../models/Message.js';
import Client from '../models/Client.js';
import Provider from '../models/Provider.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId, content } = req.body;

        // Validate content
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        // Determine sender and receiver types (capitalize first letter)
        const senderType = req.user.type.charAt(0).toUpperCase() + req.user.type.slice(1); // 'Client' or 'Provider'
        const receiverType = senderType === 'Client' ? 'Provider' : 'Client';

        console.log('Message types:', { senderType, receiverType }); // Debug log

        // Verify receiver exists
        const ReceiverModel = receiverType === 'Client' ? Client : Provider;
        const receiver = await ReceiverModel.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Create and save message
        const message = new Message({
            senderId,
            senderType,
            receiverId,
            receiverType,
            content: content.trim(),
            read: false
        });

        await message.save();

        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });

    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ 
            message: 'Error sending message', 
            error: error.message,
            details: error.errors // Include validation errors in response
        });
    }
};

export const getConversation = async (req, res) => {
    try {
        const userId = req.user._id;
        const { otherUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        res.json({
            count: messages.length,
            messages: messages
        });

    } catch (error) {
        console.error('Get Conversation Error:', error);
        res.status(500).json({ message: 'Error retrieving conversation', error: error.message });
    }
};

export const getAllConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const userType = req.user.type.charAt(0).toUpperCase() + req.user.type.slice(1);

        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: -1 });

        const conversations = messages.reduce((acc, message) => {
            const otherUserId = message.senderId.toString() === userId.toString() 
                ? message.receiverId 
                : message.senderId;

            if (!acc[otherUserId]) {
                acc[otherUserId] = {
                    otherUserId,
                    otherUserType: message.senderId.toString() === userId.toString() 
                        ? message.receiverType 
                        : message.senderType,
                    messages: [],
                    lastMessage: message,
                    unreadCount: 0
                };
            }

            acc[otherUserId].messages.push(message);
            
            if (!message.read && message.receiverId.toString() === userId.toString()) {
                acc[otherUserId].unreadCount++;
            }

            return acc;
        }, {});

        const formattedConversations = await Promise.all(
            Object.values(conversations).map(async (conv) => {
                const OtherModel = conv.otherUserType === 'Client' ? Client : Provider;
                const otherUser = await OtherModel.findById(conv.otherUserId)
                    .select('firstName lastName');

                return {
                    otherUser: {
                        id: conv.otherUserId,
                        type: conv.otherUserType,
                        name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User'
                    },
                    lastMessage: {
                        content: conv.lastMessage.content,
                        timestamp: conv.lastMessage.createdAt,
                        sent: conv.lastMessage.senderId.toString() === userId.toString()
                    },
                    unreadCount: conv.unreadCount
                };
            })
        );

        res.json({
            count: formattedConversations.length,
            conversations: formattedConversations
        });

    } catch (error) {
        console.error('Get All Conversations Error:', error);
        res.status(500).json({ message: 'Error retrieving conversations', error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;

        await Message.updateMany(
            {
                receiverId: userId,
                senderId: conversationId,
                read: false
            },
            {
                read: true
            }
        );

        res.json({ message: 'Messages marked as read' });

    } catch (error) {
        console.error('Mark as Read Error:', error);
        res.status(500).json({ message: 'Error marking messages as read', error: error.message });
    }
};
