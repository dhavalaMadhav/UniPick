const Lead = require('../models/Lead');
const University = require('../models/University');
const { sendLeadNotificationToCA, sendConfirmationToStudent } = require('../utils/emailService');
const { sendWhatsAppToCA } = require('../utils/whatsappService');

// Create new lead from contact form
const createLead = async (req, res) => {
    try {
        const { studentName, email, phone, city, stream, courseInterested, notes, source } = req.body;

        // Create lead
        const lead = new Lead({
            studentName,
            email,
            phone,
            city,
            stream,
            courseInterested,
            notes,
            source: source || 'contact_form'
        });

        await lead.save();

        // Prepare data for notifications
        const leadData = {
            studentName,
            email,
            phone,
            city,
            stream,
            courseInterested,
            notes,
            source: source || 'contact_form'
        };

        // Send notifications (don't wait for them)
        sendLeadNotificationToCA(leadData).catch(err => console.error('Email error:', err));
        sendWhatsAppToCA(leadData).catch(err => console.error('WhatsApp error:', err));
        sendConfirmationToStudent(leadData).catch(err => console.error('Confirmation error:', err));

        res.json({
            success: true,
            message: 'Your request has been submitted successfully. Our guidance team will contact you shortly.'
        });

    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting your request. Please try again.'
        });
    }
};

// Create lead from quiz with recommendations
const createLeadFromQuiz = async (req, res) => {
    try {
        const { studentName, email, phone, city, stream, quizScore, recommendedUniversities } = req.body;

        // 🛡️ FIX #1: Safe map
        const safeRecommended = Array.isArray(recommendedUniversities) ? recommendedUniversities : [];
        const universityIds = safeRecommended.map(r => r.universityId || r._id).filter(Boolean);
        
        console.log('🔍 Safe universityIds:', universityIds);

        // Get university details (safe)
        const universities = await University.find({
            '_id': { $in: universityIds }
        });

        // 🛡️ FIX #2: Safe lead creation
        const lead = new Lead({
            studentName: studentName?.trim() || 'Quiz User',
            email: email?.trim().toLowerCase() || '',
            phone: phone?.trim() || '',
            city: city?.trim() || '',
            stream: stream || 'engineering', // ✅ Required field safe
            quizScore: Number(quizScore) || 0, // ✅ No NaN
            recommendedUniversities: safeRecommended,
            source: 'quiz'
        });

        await lead.save();

        // Safe notifications (skip if no email)
        if (email) {
            const leadData = {
                studentName: lead.studentName,
                email: lead.email,
                phone: lead.phone,
                city: lead.city,
                stream: lead.stream,
                quizScore: lead.quizScore,
                recommendedUniversities: universities.map(uni => ({
                    name: uni.name,
                    matchPercentage: 85 // default
                })),
                source: 'quiz'
            };

            sendLeadNotificationToCA(leadData).catch(console.error);
            sendWhatsAppToCA(leadData).catch(console.error);
            sendConfirmationToStudent(leadData).catch(console.error);
        }

        res.json({
            success: true,
            message: 'Thank you! Our counselling team will contact you soon.'
        });

    } catch (error) {
        console.error('Error creating quiz lead:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = {
    createLead,
    createLeadFromQuiz
};
