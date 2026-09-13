const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const nodemailer = require('nodemailer');

// Email configuration
let transporter;
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
} catch (error) {
    console.log('⚠️ Email not configured');
}

// Test route
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Leads API is working!' });
});

// Contact Form
router.post('/contact', async (req, res) => {
    console.log('📨 Contact form data received:', req.body);
    
    try {
        const { 
            name, 
            email, 
            phone, 
            city,
            interestedStream, 
            interestedUniversities, 
            budgetRange, 
            currentEducation,
            targetYear,
            courseInterested,
            message 
        } = req.body;
        
        // Validate
        if (!name || !email || !phone || !interestedStream) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill all required fields' 
            });
        }
        
        // Create lead
        const lead = new Lead({
            studentName: name,
            email,
            phone,
            city: city || 'Not provided',
            stream: interestedStream,
            courseInterested: courseInterested || 'Not specified',
            interestedUniversities: interestedUniversities || [],
            budgetRange: budgetRange || 'Not specified',
            currentEducation: currentEducation || 'Not specified',
            targetYear: targetYear || 'Not specified',
            message: message || '',
            source: 'contact_form',
            status: 'new',
            ipAddress: req.ip
        });
        
        await lead.save();
        console.log('✅ Lead saved with ID:', lead._id);
        
        // Send email to consultant
        if (transporter && process.env.CA_EMAIL) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.CA_EMAIL,
                    subject: '🎓 NEW LEAD - Contact Form',
                    html: `
                        <div style="font-family: Arial, sans-serif;">
                            <h2 style="color: #2c5282;">New Lead from UniPick</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Name:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Phone:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Email:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">City:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${city || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Stream:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${interestedStream}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Course:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${courseInterested || 'Not specified'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Universities:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${interestedUniversities?.join(', ') || 'Not specified'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">Budget:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${budgetRange || 'Not specified'}</td>
                                </tr>
                            </table>
                            ${message ? `
                            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #2c5282;">
                                <h3 style="margin-top: 0;">Message:</h3>
                                <p>${message}</p>
                            </div>
                            ` : ''}
                            <div style="margin-top: 30px; text-align: center;">
                                <a href="tel:${phone}" style="background: #2c5282; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;">
                                    📞 Call Now
                                </a>
                                <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;">
                                    💬 WhatsApp
                                </a>
                            </div>
                            <p style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                                Lead ID: ${lead._id}<br>
                                ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </p>
                        </div>
                    `
                });
                console.log('✅ Email sent to consultant');
            } catch (emailError) {
                console.error('⚠️ Email error:', emailError.message);
            }
            
            // Send confirmation to student
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: '✅ Thank You for Contacting UniPick!',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px;">
                            <h2 style="background: #2c5282; color: white; padding: 20px; text-align: center;">
                                Thank You, ${name}!
                            </h2>
                            <div style="padding: 30px; background: #f8f9fa;">
                                <p style="font-size: 18px; color: #1a365d;">
                                    We've received your inquiry and our counselling team will contact you within 24 hours.
                                </p>
                                <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2c5282;">
                                    <h3 style="color: #2c5282; margin-top: 0;">📋 Your Details:</h3>
                                    <p><strong>Stream:</strong> ${interestedStream}</p>
                                    ${interestedUniversities && interestedUniversities.length > 0 ? 
                                        `<p><strong>Universities:</strong> ${interestedUniversities.join(', ')}</p>` : ''}
                                </div>
                                <p>In the meantime:</p>
                                <ul style="line-height: 2;">
                                    <li>📚 <a href="${process.env.BASE_URL || 'http://localhost:3000'}/universities">Browse Universities</a></li>
                                    <li>🎯 <a href="${process.env.BASE_URL || 'http://localhost:3000'}/quiz">Take Career Quiz</a></li>
                                </ul>
                                <div style="background: #e6f2ff; padding: 20px; margin-top: 30px; border-radius: 5px; text-align: center;">
                                    <p style="margin: 0; color: #1a365d;">
                                        <strong>Need immediate help?</strong><br>
                                        Call: <a href="tel:${process.env.CA_PHONE}">${process.env.CA_PHONE || 'Contact Us'}</a>
                                    </p>
                                </div>
                            </div>
                            <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
                                <p style="margin: 0;">Best regards,<br><strong>UniPick Team</strong></p>
                            </div>
                        </div>
                    `
                });
                console.log('✅ Confirmation email sent to student');
            } catch (emailError) {
                console.error('⚠️ Student email error:', emailError.message);
            }
        }
        
        res.json({ 
            success: true, 
            message: 'Thank you! We will contact you within 24 hours.' 
        });
        
    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again or call us directly.' 
        });
    }
});

// Callback Request
router.post('/callback', async (req, res) => {
    console.log('📞 Callback request received:', req.body);
    
    try {
        const { name, phone, preferredCallbackTime, urgency } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and phone are required' 
            });
        }
        
        const lead = new Lead({
            studentName: name,
            phone,
            email: req.body.email || 'callback@email.com',
            stream: 'Not specified',
            preferredCallbackTime: preferredCallbackTime || 'ASAP',
            urgency: urgency || 'immediate',
            source: 'callback_request',
            status: 'new',
            ipAddress: req.ip
        });
        
        await lead.save();
        console.log('✅ Callback lead saved:', lead._id);
        
        // Send urgent email
        if (transporter && process.env.CA_EMAIL) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.CA_EMAIL,
                    subject: '🚨 URGENT - Callback Request',
                    html: `
                        <div style="font-family: Arial, sans-serif;">
                            <h2 style="background: #EA4335; color: white; padding: 20px; text-align: center;">
                                ⚡ URGENT CALLBACK REQUEST
                            </h2>
                            <div style="padding: 30px; background: #fff3cd;">
                                <h3>Student is waiting for your call!</h3>
                                <table style="width: 100%; font-size: 18px;">
                                    <tr>
                                        <td style="padding: 10px; font-weight: bold;">Name:</td>
                                        <td style="padding: 10px;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; font-weight: bold;">Phone:</td>
                                        <td style="padding: 10px;">
                                            <a href="tel:${phone}" style="font-size: 24px; color: #EA4335; font-weight: bold;">
                                                ${phone}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; font-weight: bold;">Time:</td>
                                        <td style="padding: 10px;">${preferredCallbackTime || 'ASAP'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; font-weight: bold;">Urgency:</td>
                                        <td style="padding: 10px;">
                                            <span style="background: #EA4335; color: white; padding: 5px 10px; border-radius: 3px;">
                                                ${(urgency || 'immediate').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                                <div style="margin-top: 30px; text-align: center;">
                                    <a href="tel:${phone}" style="background: #EA4335; color: white; padding: 20px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 20px; font-weight: bold;">
                                        📞 CALL NOW
                                    </a>
                                </div>
                            </div>
                        </div>
                    `
                });
                console.log('✅ Urgent email sent');
            } catch (emailError) {
                console.error('⚠️ Email error:', emailError.message);
            }
        }
        
        res.json({ 
            success: true, 
            message: 'We will call you back within the hour!' 
        });
        
    } catch (error) {
        console.error('❌ Callback error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please call us directly.' 
        });
    }
});

// Quiz Lead
router.post('/quiz-lead', async (req, res) => {
    console.log('🎯 Quiz lead received:', req.body);
    
    try {
        const { name, email, phone, quizResults, quizAnswers, quizScore } = req.body;
        
        const lead = new Lead({
            studentName: name,
            email,
            phone,
            stream: quizResults?.stream || 'Not specified',
            quizScore: quizScore || quizResults?.percentage || 0,
            quizAnswers: quizAnswers || [],
            quizResults: quizResults,
            source: 'quiz',
            status: 'new',
            ipAddress: req.ip
        });
        
        await lead.save();
        console.log('✅ Quiz lead saved:', lead._id);
        
        res.json({ success: true, message: 'Results sent!' });
        
    } catch (error) {
        console.error('❌ Quiz lead error:', error);
        res.status(500).json({ success: false });
    }
});

// WhatsApp click tracking
router.post('/whatsapp-click', async (req, res) => {
    try {
        const { source } = req.body;
        
        const lead = new Lead({
            studentName: 'WhatsApp Click',
            phone: 'Unknown',
            email: 'whatsapp@email.com',
            stream: 'Not specified',
            source: 'whatsapp_click',
            notes: `Clicked from: ${source}`,
            ipAddress: req.ip
        });
        
        await lead.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false });
    }
});

module.exports = router;
