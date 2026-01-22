import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
    },
    reason: {
        type: String,
        required: [true, 'Please select a reason for contact'],
        enum: ['Product Enquiry', 'Order Status', 'Partnership', 'Other'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
    },
    status: {
        type: String,
        default: 'new',
        enum: ['new', 'read', 'replied', 'archived']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
