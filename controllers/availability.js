import Availability from '../models/Availability.js';
import Provider from '../models/Provider.js';

// Get provider's availability
export const getProviderAvailability = async (req, res) => {
    try {
        const providerId = req.params.providerId;
        
        const availability = await Availability.find({ providerId })
            .sort({ dayOfWeek: 1 });

        res.json({
            providerId,
            availability
        });
    } catch (error) {
        console.error('Get Availability Error:', error);
        res.status(500).json({ message: 'Error retrieving availability', error: error.message });
    }
};

// Update provider's availability
export const updateAvailability = async (req, res) => {
    try {
        const providerId = req.user._id; // From auth token
        const { availabilityData } = req.body;

        // Validate provider
        const provider = await Provider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        // Validate availability data structure
        if (!Array.isArray(availabilityData)) {
            return res.status(400).json({ message: 'Invalid availability data format' });
        }

        // Process each day's availability
        const availabilityPromises = availabilityData.map(async (dayData) => {
            const { dayOfWeek, timeSlots, isAvailable } = dayData;

            // Validate time slots
            if (timeSlots && !validateTimeSlots(timeSlots)) {
                throw new Error(`Invalid time slots for ${dayOfWeek}`);
            }

            // Update or create availability for the day
            return await Availability.findOneAndUpdate(
                { providerId, dayOfWeek },
                { timeSlots, isAvailable },
                { upsert: true, new: true }
            );
        });

        const updatedAvailability = await Promise.all(availabilityPromises);

        res.json({
            message: 'Availability updated successfully',
            availability: updatedAvailability
        });

    } catch (error) {
        console.error('Update Availability Error:', error);
        res.status(500).json({ message: 'Error updating availability', error: error.message });
    }
};

// Get available time slots for a specific day
export const getDayAvailability = async (req, res) => {
    try {
        const { providerId, dayOfWeek } = req.params;

        const availability = await Availability.findOne({
            providerId,
            dayOfWeek,
            isAvailable: true
        });

        if (!availability) {
            return res.json({
                providerId,
                dayOfWeek,
                available: false,
                timeSlots: []
            });
        }

        // Filter out booked slots
        const availableTimeSlots = availability.timeSlots.filter(slot => !slot.isBooked);

        res.json({
            providerId,
            dayOfWeek,
            available: true,
            timeSlots: availableTimeSlots
        });

    } catch (error) {
        console.error('Get Day Availability Error:', error);
        res.status(500).json({ message: 'Error retrieving day availability', error: error.message });
    }
};

// Helper function to validate time slots
const validateTimeSlots = (timeSlots) => {
    if (!Array.isArray(timeSlots)) return false;

    return timeSlots.every(slot => {
        // Check if slot has required properties
        if (!slot.startTime || !slot.endTime) return false;

        // Validate time format (HH:MM)
        const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeFormat.test(slot.startTime) || !timeFormat.test(slot.endTime)) return false;

        // Ensure end time is after start time
        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        return endMinutes > startMinutes;
    });
};
