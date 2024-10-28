# TalkThrough.it Backend API

A comprehensive Node.js/Express API for the TalkThrough.it therapy platform, connecting mental health providers with clients seeking therapy services.

## Table of Contents
- [Features](#features)
- [Setup Guide](#setup-guide)
- [API Documentation](#api-documentation)
- [Testing Guide](#testing-guide)
- [Troubleshooting Guide](#troubleshooting-guide)

## Features

### 1. Authentication System
- Secure client/provider registration flows
- JWT-based authentication
- Role-based access control
- Session management
- Password encryption
- Token refresh mechanism

### 2. Provider Search
Advanced search functionality with multiple filters:
- Location (city, state)
- Insurance providers
- Languages spoken
- Session types (telehealth/in-person)
- Specialties
- Availability
- Combined filtering support

### 3. SavedTherapists System
- Save preferred providers
- Categorize providers
- Add private notes
- View saved providers
- Category management
- Remove saved providers

### 4. Messaging System
- Direct messaging
- Conversation threading
- Read receipts
- Message history
- Conversation management
- Unread message tracking

### 5. Provider Specialties
- Standard specialty categories
- Multiple specialty selection
- Category-based search
- Specialty verification
- Specialty-based matching

### 6. Provider Availability
- Weekly availability settings
- Time slot management
- Schedule viewing
- Day-specific availability
- Booking status tracking

## Setup Guide

### Prerequisites
- Node.js v20+ ([Download](https://nodejs.org/))
- npm v9+ (comes with Node.js)
- Git ([Download](https://git-scm.com/downloads))

### Step-by-Step Installation

1. Clone the Repository
```bash
git clone https://github.com/yourusername/talkthrough-backend.git
cd talkthrough-backend
```

2. Install Dependencies
```bash
npm install
```

3. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_key_here
```

4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation with Examples

### Authentication

#### Register Client
```http
POST /auth/register/client
Content-Type: application/json

{
    "email": "client@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "location": "New York, NY",
    "insuranceProvider": "Blue Cross"
}

// Success Response
{
    "token": "eyJhbGc...",
    "user": {
        "id": "user_id",
        "email": "client@example.com",
        "firstName": "John",
        "type": "client"
    }
}
```

#### Register Provider
```http
POST /auth/register/provider
Content-Type: application/json

{
    "email": "provider@example.com",
    "password": "SecurePass123!",
    "firstName": "Dr",
    "lastName": "Smith",
    "credentials": "PhD, Licensed Psychologist",
    "bio": "Specializing in anxiety and depression",
    "location": "New York, NY",
    "insuranceAccepted": ["Blue Cross", "Aetna"],
    "languages": ["English", "Spanish"],
    "therapyApproaches": ["CBT", "Mindfulness"]
}
```

### Provider Search Examples

#### Basic Location Search
```http
GET /search/providers?location=New York
```

#### Advanced Search
```http
GET /search/providers?location=New York&insurance=Blue Cross&language=Spanish&specialty=Anxiety&sessionType=telehealth
```

### SavedTherapists Examples

#### Save Provider
```http
POST /saved-therapists
Authorization: Bearer your_token_here
Content-Type: application/json

{
    "providerId": "provider_id",
    "category": "Favorites",
    "notes": "Specialist in anxiety, offers telehealth"
}
```

### Messaging Examples

#### Send Message
```http
POST /messages
Authorization: Bearer your_token_here
Content-Type: application/json

{
    "receiverId": "recipient_id",
    "content": "Hello, I'm interested in scheduling a consultation."
}
```

### Availability Examples

#### Set Weekly Availability
```http
PUT /availability/update
Authorization: Bearer provider_token_here
Content-Type: application/json

{
    "availabilityData": [
        {
            "dayOfWeek": "Monday",
            "isAvailable": true,
            "timeSlots": [
                {
                    "startTime": "09:00",
                    "endTime": "10:00"
                }
            ]
        }
    ]
}
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Authentication Errors
```bash
Error: Invalid token
```
Solutions:
- Check if your JWT_SECRET in .env matches the one used to generate the token
- Verify token format in request: `Authorization: Bearer your_token_here`
- Token might be expired - try logging in again
- Ensure user has correct permissions

#### 2. Validation Errors
```bash
Error: Validation failed
```
Solutions:
- Check all required fields are present
- Verify data types match schema
- Ensure valid email format
- Check password meets requirements

### Development Tools

#### Debugging Tips
```javascript
// Add to your requests to see what's being sent
console.log('Request payload:', {
    headers: req.headers,
    body: req.body
});

// Add to error handlers to see full error details
console.error('Error details:', {
    message: error.message,
    stack: error.stack
});
```

#### Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm test auth
npm test search
```

## Security Best Practices

1. API Security
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Keep JWT_SECRET secure and complex

2. Data Protection
- Never log sensitive data
- Sanitize user inputs
- Use password hashing
- Regular security audits

## Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Implement changes
4. Write/update tests
5. Submit pull request

### Code Standards
- Use ES6+ features
- Follow ESLint rules
- Write JSDoc comments
- Maintain test coverage