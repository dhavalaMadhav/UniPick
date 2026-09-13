const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    studentName: String,
    studentEmail: String,
    studentPhone: String,
    messages: [{
        sender: {
            type: String,
            enum: ['student', 'admin', 'bot'],
            required: true
        },
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    }],
    status: {
        type: String,
        enum: ['active', 'closed', 'waiting'],
        default: 'active'
    },
    assignedTo: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
