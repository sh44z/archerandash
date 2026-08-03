import mongoose from 'mongoose';

const LiveChatMessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['visitor', 'agent'],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

const LiveChatThreadSchema = new mongoose.Schema({
    visitorName: {
        type: String,
        required: [true, 'Please provide visitor name'],
    },
    visitorEmail: {
        type: String,
        required: [true, 'Please provide visitor email'],
    },
    status: {
        type: String,
        enum: ['new', 'open', 'resolved', 'archived'],
        default: 'new',
    },
    messages: [LiveChatMessageSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    lastAgentReplyAt: {
        type: Date,
        default: null,
    },
    lastVisitorMessageAt: {
        type: Date,
        default: null,
    },
});

export default mongoose.models.LiveChatThread || mongoose.model('LiveChatThread', LiveChatThreadSchema);
