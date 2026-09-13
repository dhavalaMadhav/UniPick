const mongoose = require('mongoose');

const virtualTourSchema = new mongoose.Schema({
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    tourType: {
        type: String,
        enum: ['360_video', 'video_walkthrough', 'image_gallery', 'virtual_reality'],
        default: 'video_walkthrough'
    },
    mediaUrl: {
        type: String,
        required: true
    },
    thumbnail: String,
    location: {
        type: String,
        enum: ['Campus', 'Library', 'Labs', 'Hostel', 'Cafeteria', 'Sports Complex', 'Auditorium', 'Classroom', 'Other'],
        required: true
    },
    duration: String, // e.g., "3:45"
    views: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VirtualTour', virtualTourSchema);
