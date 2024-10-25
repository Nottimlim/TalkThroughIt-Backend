import mongoose from 'mongoose';

const savedProviderSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    }
}, {
    timestamps: true
});

// Ensure a client can't save the same provider multiple times
savedProviderSchema.index({ clientId: 1, providerId: 1 }, { unique: true });

export default mongoose.model('SavedProvider', savedProviderSchema);
