import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderType'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverType'
    },
    senderType: {
        type: String,
        required: true,
        enum: ['Client', 'Provider']  // Changed to capital letters
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['Client', 'Provider']  // Changed to capital letters
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Message', messageSchema);
