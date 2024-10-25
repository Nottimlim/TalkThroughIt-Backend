import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const providerSchema = new mongoose.Schema({
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
    credentials: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    insuranceAccepted: [{
        type: String
    }],
    acceptingClients: {
        type: Boolean,
        default: true
    },
    specialties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    }]
}, {
    timestamps: true
});

// Hash password before saving
providerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
providerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Provider', providerSchema);
