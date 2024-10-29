import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String
    },
    duration: {
        type: Number, // duration in minutes
        default: 60
    },
    meetingType: {
        type: String,
        enum: ['in-person', 'video', 'phone'],
        default: 'video'
    },
    meetingLink: {
        type: String,
        // Only required if meeting type is video
        validate: {
            validator: function(v) {
                return this.meetingType !== 'video' || (this.meetingType === 'video' && v);
            },
            message: 'Meeting link is required for video appointments'
        }
    },
    location: {
        type: String,
        // Only required if meeting type is in-person
        validate: {
            validator: function(v) {
                return this.meetingType !== 'in-person' || (this.meetingType === 'in-person' && v);
            },
            message: 'Location is required for in-person appointments'
        }
    },
    cancellationReason: {
        type: String,
        required: function() {
            return this.status === 'cancelled';
        }
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    reminderSettings: {
        email: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        },
        reminderTime: {
            type: Number,
            default: 24, // hours before appointment
            enum: [1, 24, 48] // 1 hour, 1 day, or 2 days before
        }
    } // Added closing brace here
}, {
    timestamps: true
});

// Indexes for efficient queries
appointmentSchema.index({ datetime: 1, provider: 1 });
appointmentSchema.index({ datetime: 1, client: 1 });
appointmentSchema.index({ status: 1 });

// Methods
appointmentSchema.methods.canCancel = function() {
    const now = new Date();
    const appointmentTime = new Date(this.datetime);
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
    return hoursUntilAppointment >= 24;
};

appointmentSchema.methods.generateMeetingLink = async function() {
    if (this.meetingType === 'video') {
        // You could integrate with Zoom/Google Meet API here
        this.meetingLink = `https://meet.talkthrough.it/${this._id}`;
        await this.save();
    }
};

// Pre-save middleware
appointmentSchema.pre('save', async function(next) {
    if (this.isModified('status') && this.status === 'confirmed') {
        if (this.meetingType === 'video' && !this.meetingLink) {
            await this.generateMeetingLink();
        }
    }
    next();
});

export default mongoose.model('Appointment', appointmentSchema);
