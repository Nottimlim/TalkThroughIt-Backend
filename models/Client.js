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
    }
}, {
    timestamps: true
});

// Hash password before saving
clientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
clientSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Client', clientSchema);
