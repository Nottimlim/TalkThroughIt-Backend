import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const availabilitySlotSchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number, // 0-6 (Sunday-Saturday)
        required: true
    },
    startTime: {
        type: String, // Format: "HH:mm"
        required: true
    },
    endTime: {
        type: String, // Format: "HH:mm"
        required: true
    }
});

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
    specialties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    }],
    yearsOfExperience: {
        type: Number,
        required: true
    },
    languages: [{
        type: String,
        default: ['English']
    }],
    acceptingClients: {
        type: Boolean,
        default: true
    },
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
    },
    availability: [availabilitySlotSchema],
    
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }],
    
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
}, {
    timestamps: true
});

providerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

providerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Provider', providerSchema);
