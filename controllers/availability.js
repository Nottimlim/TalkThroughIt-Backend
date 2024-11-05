import Availability from "../models/Availability.js";
import Provider from "../models/Provider.js";

// Get provider's availability
export const getProviderAvailability = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    console.log("Backend - Fetching availability for provider:", providerId);

    const availability = await Availability.find({ providerId }).sort({
      dayOfWeek: 1,
    });

    console.log("Backend - Found availability:", availability);

    res.json({
      providerId,
      availability: availability || [],
    });
  } catch (error) {
    console.error("Get Availability Error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving availability", error: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
      console.log('Received update request body:', JSON.stringify(req.body, null, 2));
      console.log('Provider ID from token:', req.user._id);

      const providerId = req.user._id; // From auth token
      const { availabilityData } = req.body;

      if (!availabilityData || !Array.isArray(availabilityData)) {
          console.log('Invalid data format received:', availabilityData);
          return res.status(400).json({ 
              message: "Invalid availability data format",
              received: availabilityData 
          });
      }

      // Validate provider
      const provider = await Provider.findById(providerId);
      if (!provider) {
          return res.status(404).json({ message: "Provider not found" });
      }

      // Process each day's availability
      const availabilityPromises = availabilityData.map(async (dayData) => {
          console.log('Processing day data:', dayData);
          
          const { dayOfWeek, timeSlots, isAvailable } = dayData;

          // Additional validation
          if (!dayOfWeek || !timeSlots || !Array.isArray(timeSlots)) {
              throw new Error(`Invalid data structure for ${dayOfWeek}`);
          }

          // Update or create availability for the day
          return await Availability.findOneAndUpdate(
              { providerId, dayOfWeek },
              { 
                  timeSlots, 
                  isAvailable,
                  providerId // ensure providerId is set
              },
              { upsert: true, new: true }
          );
      });

      const updatedAvailability = await Promise.all(availabilityPromises);
      console.log('Updated availability:', updatedAvailability);

      res.json({
          message: "Availability updated successfully",
          availability: updatedAvailability
      });
  } catch (error) {
      console.error("Update Availability Error:", error);
      res.status(500).json({ 
          message: "Error updating availability", 
          error: error.message,
          stack: error.stack 
      });
  }
};


// Get available time slots for a specific day
export const getDayAvailability = async (req, res) => {
  try {
    const { providerId, dayOfWeek } = req.params;
    const { date } = req.query;

    console.log("Getting availability for:", { providerId, dayOfWeek, date });

    const availability = await Availability.findOne({
      providerId,
      dayOfWeek,
      isAvailable: true,
    });

    console.log("Backend - Raw availability data:", availability);

    if (!availability) {
      return res.json({
        providerId,
        dayOfWeek,
        available: false,
        timeSlots: [],
      });
    }

    // Include meeting types in the response
    const availableTimeSlots = availability.timeSlots
      .filter((slot) => !slot.isBooked)
      .map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        availableMeetingTypes: slot.availableMeetingTypes,
      }));

    console.log("Backend - Processed time slots:", availableTimeSlots);

    res.json({
      providerId,
      dayOfWeek,
      available: true,
      timeSlots: availableTimeSlots,
    });
  } catch (error) {
    console.error("Backend - Get Day Availability Error:", error);
    res.status(500).json({
      message: "Error retrieving day availability",
      error: error.message,
    });
  }
};

// Helper function to validate time slots
const validateTimeSlots = (timeSlots) => {
  if (!Array.isArray(timeSlots)) return false;

  return timeSlots.every((slot) => {
    // Check if slot has required properties
    if (!slot.startTime || !slot.endTime || !slot.availableMeetingTypes)
      return false;

    // Validate time format (HH:MM)
    const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeFormat.test(slot.startTime) || !timeFormat.test(slot.endTime))
      return false;

    // Validate meeting types
    if (
      !Array.isArray(slot.availableMeetingTypes) ||
      slot.availableMeetingTypes.length === 0
    )
      return false;
    const validMeetingTypes = ["video", "phone", "inPerson"];
    if (
      !slot.availableMeetingTypes.every((type) =>
        validMeetingTypes.includes(type)
      )
    )
      return false;

    // Ensure end time is after start time
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return endMinutes > startMinutes;
  });
};

export const getPublicAvailability = async (req, res) => {
  try {
      const { providerId } = req.params;
      console.log("Backend - Fetching availability for provider:", providerId);

      const provider = await Provider.findById(providerId);
      if (!provider) {
          return res.status(404).json({ message: "Provider not found" });
      }

      const availability = await Availability.find({
          providerId,
          isAvailable: true,
      }).sort({ dayOfWeek: 1 });

      console.log("Found raw availability:", JSON.stringify(availability, null, 2));

      // Transform the availability data with full time slot details
      const availabilityData = availability.map(day => ({
          dayOfWeek: day.dayOfWeek,
          isAvailable: day.isAvailable,
          timeSlots: day.timeSlots.map(slot => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
              isBooked: slot.isBooked,
              availableMeetingTypes: slot.availableMeetingTypes
          })).filter(slot => !slot.isBooked) // Only include unbooked slots
      }));

      const response = {
          provider: {
              _id: provider._id,
              firstName: provider.firstName,
              lastName: provider.lastName,
              title: provider.title,
              credentials: provider.credentials,
              location: provider.location,
              profileImage: provider.profileImage
          },
          availability: availabilityData
      };

      console.log("Sending formatted response:", JSON.stringify(response, null, 2));

      res.json(response);
  } catch (error) {
      console.error("Get Public Availability Error:", error);
      res.status(500).json({
          message: "Error retrieving availability",
          error: error.message
      });
  }
};





