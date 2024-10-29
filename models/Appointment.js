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
    }
}, {
    timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);
