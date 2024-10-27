import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
        type: String,
        required: true
    }],
    acceptingClients: {
        type: Boolean,
        default: true
    },
    specialties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    }],
    availability: [{
        day: String,
        slots: [String]
    }],
    profileImage: {
        type: String,
        default: ''
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    languages: [{
        type: String,
        default: ['English']
    }],
    therapyApproaches: [{
        type: String
    }],
    education: [{
        degree: String,
        institution: String,
        year: Number
    }],
    licensureState: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    telehealth: {
        type: Boolean,
        default: true
    },
    inPerson: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
providerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
providerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Provider', providerSchema);
