import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    availableMeetingTypes: [{
        type: String,
        enum: ['video', 'phone', 'inPerson'],
        required: true
    }]
});

const availabilitySchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    timeSlots: [timeSlotSchema],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index to ensure unique provider-day combinations
availabilitySchema.index({ providerId: 1, dayOfWeek: 1 }, { unique: true });

export default mongoose.model('Availability', availabilitySchema);
