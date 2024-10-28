# TalkThrough.it Messaging System Documentation

## Overview
The messaging system enables direct communication between clients and providers within the therapy platform. This document details the implementation, API endpoints, and usage of the messaging feature.

## Technical Implementation

### Models Used

The messaging system uses the following MongoDB schema:

```javascript
Message {
    senderId: ObjectId,        // ID of message sender
    receiverId: ObjectId,      // ID of message recipient
    senderType: String,        // 'Client' or 'Provider'
    receiverType: String,      // 'Client' or 'Provider'
    content: String,           // Message content
    read: Boolean,             // Message read status
    createdAt: Date           // Timestamp
}
```

### API Endpoints

#### 1. Send Message
Send a new message to a client or provider.

**Endpoint:** `POST /messages`

**Headers Required:**
- `Authorization: Bearer [token]`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "receiverId": "recipient_user_id",
    "content": "Message content"
}
```

**Success Response (201):**
```json
{
    "message": "Message sent successfully",
    "data": {
        "_id": "message_id",
        "senderId": "sender_id",
        "receiverId": "receiver_id",
        "content": "Message content",
        "read": false,
        "createdAt": "timestamp"
    }
}
```

#### 2. Get Conversation History
Retrieve message history between users.

**Endpoint:** `GET /messages/conversation/:otherUserId`

**Headers Required:**
- `Authorization: Bearer [token]`

**Success Response (200):**
```json
{
    "count": 2,
    "messages": [
        {
            "_id": "message_id",
            "senderId": "sender_id",
            "receiverId": "receiver_id",
            "content": "Message content",
            "read": true,
            "createdAt": "timestamp"
        }
    ]
}
```

#### 3. View All Conversations
Get all conversations for current user.

**Endpoint:** `GET /messages/conversations`

**Headers Required:**
- `Authorization: Bearer [token]`

**Success Response (200):**
```json
{
    "count": 1,
    "conversations": [
        {
            "otherUser": {
                "id": "user_id",
                "type": "Client/Provider",
                "name": "User Name"
            },
            "lastMessage": {
                "content": "Last message",
                "timestamp": "timestamp",
                "sent": true
            },
            "unreadCount": 0
        }
    ]
}
```

#### 4. Mark Messages as Read
Mark all messages in a conversation as read.

**Endpoint:** `PUT /messages/read/:conversationId`

**Headers Required:**
- `Authorization: Bearer [token]`

**Success Response (200):**
```json
{
    "message": "Messages marked as read"
}
```

### Error Responses

**Unauthorized (401)**
```json
{
    "message": "Authentication token required"
}
```

**Not Found (404)**
```json
{
    "message": "Receiver not found"
}
```

**Bad Request (400)**
```json
{
    "message": "Message content is required"
}
```

## Testing Guide

### 1. Send Message as Client
```http
POST http://localhost:5000/messages
Authorization: Bearer [client_token]
Content-Type: application/json

{
    "receiverId": "[provider_id]",
    "content": "Hello, I'm interested in scheduling a consultation."
}
```

### 2. Send Message as Provider
```http
POST http://localhost:5000/messages
Authorization: Bearer [provider_token]
Content-Type: application/json

{
    "receiverId": "[client_id]",
    "content": "Thank you for your message. I have availability next week."
}
```

### 3. View Conversation
```http
GET http://localhost:5000/messages/conversation/[other_user_id]
Authorization: Bearer [your_token]
```

### 4. View All Conversations
```http
GET http://localhost:5000/messages/conversations
Authorization: Bearer [your_token]
```

## Security Features

- JWT authentication required for all endpoints
- Users can only access their own conversations
- Message content validation and sanitization
- Sender/receiver verification

## Current Limitations

- Text-only messages
- No file attachments
- No message editing/deletion
- No real-time updates

## Implementation Notes

- Messages are stored in MongoDB
- Timestamps are automatically added
- Read status is tracked
- Conversations are ordered by latest message

## Best Practices

1. Always verify token before sending messages
2. Check receiver exists before sending
3. Validate message content
4. Handle errors appropriately

## Troubleshooting

### Authentication Issues
1. Token Invalid/Expired
   - **Symptom:** 401 Unauthorized response
   - **Common Causes:**
     * Token expired
     * Invalid token format
     * Token from different user
   - **Solutions:**
     * Re-login to get a new token
     * Check token format: `Bearer your_token_here`
     * Verify you're using the correct user's token
   - **Example Error:**
     ```json
     {
         "message": "Invalid or expired token"
     }
     ```

2. Missing Authorization Header
   - **Symptom:** 401 "Authentication token required"
   - **Common Causes:**
     * Header not included in request
     * Incorrect header format
   - **Solutions:**
     * Add Authorization header
     * Check header format: `Authorization: Bearer token`
   - **Example Request Fix:**
     ```javascript
     headers: {
         'Authorization': 'Bearer your_token_here',
         'Content-Type': 'application/json'
     }
     ```

### Message Delivery Issues
1. Receiver Not Found
   - **Symptom:** 404 "Receiver not found"
   - **Common Causes:**
     * Invalid receiverId
     * Receiver account deleted
     * Typo in ID
   - **Solutions:**
     * Verify receiver ID exists
     * Check ID format (should be MongoDB ObjectId)
     * Confirm receiver is active user
   - **Verification Step:**
     ```http
     GET /search/providers?name=[receiver_name]
     // Use to verify correct provider ID
     ```

2. Content Validation Failed
   - **Symptom:** 400 Bad Request
   - **Common Causes:**
     * Empty message content
     * Content too long
     * Invalid content format
   - **Solutions:**
     * Ensure content is not empty
     * Check content length
     * Remove invalid characters
   - **Example Valid Request:**
     ```json
     {
         "receiverId": "valid_id",
         "content": "Valid message content"
     }
     ```

### Performance Issues
1. Slow Message Loading
   - **Symptom:** Long response times for conversation history
   - **Common Causes:**
     * Too many messages
     * Large conversation history
     * Network latency
   - **Solutions:**
     * Use pagination
     * Limit conversation history
     * Check network connection
   - **Example Paginated Request:**
     ```http
     GET /messages/conversation/[id]?page=1&limit=20
     ```

2. Message List Not Updating
   - **Symptom:** New messages not appearing
   - **Common Causes:**
     * Cache issues
     * Client-side state
     * Server sync delays
   - **Solutions:**
     * Refresh conversation
     * Clear local cache
     * Implement polling
   - **Verification Step:**
     ```http
     GET /messages/conversations
     // Check if messages appear in full list
     ```

### Common Error Codes and Solutions

1. 400 Bad Request
   ```json
   {
       "message": "Error sending message",
       "error": "Message content is required"
   }
   ```
   **Solution:** Check request body format and content

2. 401 Unauthorized
   ```json
   {
       "message": "Authentication token required"
   }
   ```
   **Solution:** Check token presence and validity

3. 403 Forbidden
   ```json
   {
       "message": "Access denied"
   }
   ```
   **Solution:** Verify user permissions and role

4. 404 Not Found
   ```json
   {
       "message": "Conversation not found"
   }
   ```
   **Solution:** Verify IDs and conversation existence

5. 500 Server Error
   ```json
   {
       "message": "Internal server error"
   }
   ```
   **Solution:** Check server logs and contact support

## Logging and Debugging

### Enable Debug Logs
```javascript
// Add to your request
console.log('Request payload:', {
    receiverId,
    content,
    headers: req.headers
});
```

### Monitor Response
```javascript
// Add to your error handling
console.error('Error details:', {
    statusCode: err.status,
    message: err.message,
    stack: err.stack
});
```

## Quick Fixes for Common Issues

### Message Not Sending
```json
// Check request format
{
    "receiverId": "valid_mongodb_id",
    "content": "Non-empty message"
}
```

### Conversation Not Loading
```http
// Verify conversation ID format
/messages/conversation/valid_mongodb_id
```

### Read Status Not Updating
```http
// Force read status update
PUT /messages/read/[conversationId]
```
