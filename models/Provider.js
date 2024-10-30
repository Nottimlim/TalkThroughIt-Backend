// TalkThroughIt-Backend/models/Provider.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const providerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 character long']
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
        type: String,
        required: true
    }],
    specialties: [{
        type: String,
        required: true
    }],
    yearsOfExperience: {
        type: Number,
        required: true
    },
    languages: [{
        type: String,
        required: true
    }],
    licensureState: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    sessionTypes: [{
        type: String,
        enum: ['In-Person', 'Video', 'Phone'],
        required: true
    }],
    acceptingClients: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Password hashing middleware
providerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Add password comparison method
providerSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

export default mongoose.model('Provider', providerSchema);
