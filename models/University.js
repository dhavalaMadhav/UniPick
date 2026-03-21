const mongoose = require('mongoose');
const slugify = require('slugify');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    location: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    established: {
        type: Number,
        required: true
    },
    description: String,
    bannerImage: String,
    logo: String,
    type: {
        type: String,
        enum: ['Private', 'Government', 'Deemed'],
        default: 'Private'
    },
    accreditation: String,
    ranking: String,
    website: String,
    students: String,
    faculty: String,
    campusSize: String,
    feeRange: String,
    fee: Number,
    
    // New fields for card display
    globalRanking: Number,
    mastersPrograms: Number,
    scholarships: Number,
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.0,
        min: 0,
        max: 5
    },
    programmes: [{
        type: String,
        enum: [
            'engineering',
            'management',
            'computer',
            'law',
            'medical',
            'sciences',
            'arts',
            'architecture',
            'pharmacy',
            'design',
            'education',
            'commerce',
            'dental'
        ]
    }],
    
    // Facilities as array of strings
    facilities: [String],
    
    // Placements as object
    placements: {
        percentage: Number,
        averagePackage: String,
        highestPackage: String,
        topRecruiters: [String]
    },
    
    // Admission process as array of strings
    admissionProcess: [String],
    
    // Contact info as object
    contactInfo: {
        phone: String,
        email: String,
        address: String
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    // In your university model, add coordinates field:
    coordinates: {
        lat: Number,
        lng: Number
    },
    address: String
});

// Generate slug before saving
universitySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('University', universitySchema);