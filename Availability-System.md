# TalkThrough.it Availability System Documentation

## Overview
The availability system enables providers to set and manage their available time slots for client consultations. This document details the implementation, API endpoints, and usage of the availability feature.

## Technical Implementation

### Models Used
```javascript
Availability {
    providerId: ObjectId,      // Reference to Provider
    dayOfWeek: String,        // Monday, Tuesday, etc.
    timeSlots: [{
        startTime: String,    // Format: "HH:MM"
        endTime: String,      // Format: "HH:MM"
        isBooked: Boolean     // Slot availability status
    }],
    isAvailable: Boolean      // Overall day availability
}
```

## API Endpoints

### 1. Update Provider Availability
Set or update a provider's availability schedule.

**Endpoint:** `PUT /availability/update`

**Headers Required:**
- `Authorization: Bearer [token]`
- `Content-Type: application/json`

**Request Body:**
```json
{
    "availabilityData": [
        {
            "dayOfWeek": "Monday",
            "isAvailable": true,
            "timeSlots": [
                {
                    "startTime": "09:00",
                    "endTime": "10:00"
                },
                {
                    "startTime": "10:00",
                    "endTime": "11:00"
                }
            ]
        }
    ]
}
```

**Success Response (200):**
```json
{
    "message": "Availability updated successfully",
    "availability": [
        {
            "providerId": "provider_id",
            "dayOfWeek": "Monday",
            "timeSlots": [
                {
                    "startTime": "09:00",
                    "endTime": "10:00",
                    "isBooked": false
                }
            ],
            "isAvailable": true
        }
    ]
}
```

### 2. Get Provider's Full Availability
Retrieve all availability settings for a provider.

**Endpoint:** `GET /availability/provider/:providerId`

**Success Response (200):**
```json
{
    "providerId": "provider_id",
    "availability": [
        {
            "dayOfWeek": "Monday",
            "timeSlots": [
                {
                    "startTime": "09:00",
                    "endTime": "10:00",
                    "isBooked": false
                }
            ],
            "isAvailable": true
        }
    ]
}
```

### 3. Get Specific Day's Availability
Get available time slots for a specific day.

**Endpoint:** `GET /availability/provider/:providerId/day/:dayOfWeek`

**Success Response (200):**
```json
{
    "providerId": "provider_id",
    "dayOfWeek": "Monday",
    "available": true,
    "timeSlots": [
        {
            "startTime": "09:00",
            "endTime": "10:00",
            "isBooked": false
        }
    ]
}
```

## Error Responses

### Unauthorized (401)
```json
{
    "message": "Authentication token required"
}
```

### Provider Only (403)
```json
{
    "message": "Access denied. Providers only."
}
```

### Invalid Data (400)
```json
{
    "message": "Invalid availability data format"
}
```

## Testing Guide

### 1. Update Provider Availability
```http
PUT http://localhost:5000/availability/update
Authorization: Bearer [provider_token]
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

### 2. View Provider's Availability
```http
GET http://localhost:5000/availability/provider/[provider_id]
```

### 3. Check Specific Day
```http
GET http://localhost:5000/availability/provider/[provider_id]/day/Monday
```

## Time Slot Rules

1. Format Requirements:
   - Time must be in 24-hour format (HH:MM)
   - Valid hours: 00-23
   - Valid minutes: 00-59

2. Validation Rules:
   - End time must be after start time
   - No overlapping time slots
   - Minimum slot duration: 1 hour
   - Must be within provider's working hours

## Best Practices

1. Provider Availability Management:
   - Set regular weekly schedules
   - Update availability in advance
   - Mark unavailable days appropriately
   - Maintain consistent time slots

2. Time Slot Management:
   - Use standard intervals (e.g., hourly slots)
   - Include buffer time between sessions
   - Consider timezone differences
   - Regular schedule updates

## Implementation Notes

1. Data Storage:
   - Availability stored per provider
   - Separate records for each day
   - Time slots as sub-documents
   - Booking status tracking

2. Performance Considerations:
   - Indexed by providerId and dayOfWeek
   - Optimized queries for specific days
   - Efficient update operations

## Security Features

1. Authentication:
   - JWT token required
   - Provider-only access for updates
   - Role verification

2. Data Validation:
   - Time format validation
   - Slot overlap prevention
   - Business rules enforcement

## Troubleshooting

### Common Issues

1. Invalid Time Format
   - **Symptom:** 400 Bad Request
   - **Solution:** Ensure HH:MM format
   - **Example:** "09:00" not "9:00"

2. Authorization Errors
   - **Symptom:** 401/403 responses
   - **Solution:** Check token and provider status
   - **Example:** Verify provider token validity

3. Overlapping Slots
   - **Symptom:** Validation error
   - **Solution:** Check for time slot conflicts
   - **Example:** Adjust slot times to prevent overlap

### Debug Checklist

1. Request Validation:
   - [ ] Valid provider token
   - [ ] Correct time format
   - [ ] Non-overlapping slots
   - [ ] Valid day of week

2. Response Verification:
   - [ ] Availability saved correctly
   - [ ] Time slots accessible
   - [ ] Booking status accurate

## Calendar Integration Notes

The availability system is designed to work with frontend calendar components:

1. Data Format:
   - Compatible with standard calendar libraries
   - Easy conversion to datetime objects
   - Supports recurring schedules

2. Integration Points:
   - Fetch available slots
   - Update slot status
   - Manage bookings
   - Handle schedule changes

## Future Enhancements

1. Potential Features:
   - Recurring availability patterns
   - Custom slot durations
   - Break time management
   - Timezone support
   - Automated reminder system

2. Calendar Improvements:
   - Real-time updates
   - Batch schedule updates
   - Holiday management
   - Emergency availability
