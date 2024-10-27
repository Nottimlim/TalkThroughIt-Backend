import mongoose from 'mongoose';

const specialtySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Mental Health', 'Relationships', 'Personal Growth', 'Trauma', 'Other']
    }
}, {
    timestamps: true
});

export default mongoose.model('Specialty', specialtySchema);
