import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const clientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    insuranceProvider: {
        type: String,
        required: true
    },
    therapyGoals: {
        type: String
    },
    // Add these new fields
    savedProviders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider'
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
}, {
    timestamps: true
});

// Keep existing password methods
clientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

clientSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Client', clientSchema);
