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
        enum: ['Client', 'Provider']
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['Client', 'Provider']
    },
    content: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Message', messageSchema);
