// TalkThroughIt-Backend/models/Client.js
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

// Password hashing middleware
clientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password comparison method
clientSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

export default mongoose.model('Client', clientSchema);
