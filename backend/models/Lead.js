const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    // ===== EXISTING FIELDS (Keep these) =====
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    city: String,
    stream: {
        type: String,
        required: true
    },
    courseInterested: String,
    quizScore: {
        type: Number,
        default: 0
    },
    quizAnswers: [{
        question: String,
        answer: String,
        score: Number
    }],
    recommendedUniversities: [{
        universityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'University'
        },
        matchPercentage: Number
    }],
    notes: String,
    status: {
        type: String,
        enum: ['new', 'contacted', 'followup', 'converted', 'closed'],
        default: 'new'
    },
    source: {
        type: String,
        enum: ['quiz', 'contact_form', 'university_enquiry', 'callback_request', 'whatsapp_click'],
        default: 'contact_form'
    },
    
    // ===== NEW FIELDS (Added for enhanced features) =====
    
    // Additional Student Info
    interestedUniversities: [String], // Array of university names
    preferredLocation: String,
    budgetRange: String,
    currentEducation: String,
    targetYear: String,
    message: String,
    
    // Callback Request Info
    preferredCallbackTime: String,
    urgency: {
        type: String,
        enum: ['immediate', 'within_hour', 'today', 'this_week'],
        default: 'this_week'
    },
    
    // Tracking Info
    followUpDate: Date,
    ipAddress: String,
    userAgent: String,
    
    // Quiz Results (Enhanced)
    quizResults: {
        stream: String,
        percentage: Number,
        recommendedUniversities: [String]
    }
    
}, {
    timestamps: true // Keep your existing timestamps
});

module.exports = mongoose.model('Lead', leadSchema);
