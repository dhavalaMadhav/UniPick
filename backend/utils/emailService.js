// In your email service file
const nodemailer = require('nodemailer');

// Or for development only, you can disable SSL verification:
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Don't use SSL in development
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // ONLY for development/testing
  }
});

// Send lead notification to CA
const sendLeadNotificationToCA = async (leadData) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CA_EMAIL,
        subject: `New Student Enquiry - ${leadData.studentName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #2c5282;">
                <h2 style="color: #1a365d; border-bottom: 3px solid #2c5282; padding-bottom: 10px;">New Student Enquiry</h2>
                
                <div style="background-color: #f0f7ff; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #2c5282; margin-top: 0;">Student Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold; width: 40%;">Name:</td>
                            <td style="padding: 8px;">${leadData.studentName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Email:</td>
                            <td style="padding: 8px;">${leadData.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Phone:</td>
                            <td style="padding: 8px;">${leadData.phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">City:</td>
                            <td style="padding: 8px;">${leadData.city || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Stream:</td>
                            <td style="padding: 8px;">${leadData.stream}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Course Interested:</td>
                            <td style="padding: 8px;">${leadData.courseInterested || 'Not specified'}</td>
                        </tr>
                        ${leadData.quizScore ? `
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">Quiz Score:</td>
                            <td style="padding: 8px;">${leadData.quizScore}/100</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>
                
                ${leadData.recommendedUniversities && leadData.recommendedUniversities.length > 0 ? `
                <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #e0e0e0;">
                    <h3 style="color: #2c5282; margin-top: 0;">Recommended Universities</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${leadData.recommendedUniversities.map(uni => `
                            <li style="padding: 10px; margin: 5px 0; background-color: #f8f9fa; border-left: 4px solid #2c5282;">
                                <strong>${uni.name}</strong> - ${uni.matchPercentage}% Match
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${leadData.notes ? `
                <div style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h3 style="color: #856404; margin-top: 0;">Additional Notes</h3>
                    <p style="color: #856404; margin: 0;">${leadData.notes}</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
                    <p style="color: #666; font-size: 14px; margin: 0;">
                        <strong>Source:</strong> ${leadData.source === 'quiz' ? 'Career Guidance Quiz' : leadData.source === 'university_enquiry' ? 'University Enquiry' : 'Contact Form'}<br>
                        <strong>Received:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Lead notification sent to CA');
    } catch (error) {
        console.error('❌ Error sending email to CA:', error);
    }
};

// Send confirmation email to student
const sendConfirmationToStudent = async (leadData) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: leadData.email,
        subject: 'Your Career Guidance Request - UniPick',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #2c5282;">
                <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px;">Edu<span style="color: #fff;">Path</span></h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Career Guidance Platform</p>
                </div>
                
                <div style="padding: 30px; background-color: #fff;">
                    <h2 style="color: #1a365d; margin-top: 0;">Thank You for Your Interest!</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                        Dear <strong>${leadData.studentName}</strong>,
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                        We have received your career guidance request. Our counselling team will review your profile and contact you shortly with personalized recommendations.
                    </p>
                    
                    <div style="background-color: #f0f7ff; padding: 20px; margin: 20px 0; border-left: 4px solid #2c5282;">
                        <h3 style="color: #2c5282; margin-top: 0; font-size: 18px;">What Happens Next?</h3>
                        <ul style="color: #555; line-height: 1.8; margin: 10px 0;">
                            <li>Our guidance team will review your profile within 24 hours</li>
                            <li>You'll receive a call from our counsellor</li>
                            <li>Get detailed information about suitable universities</li>
                            <li>Receive assistance with the admission process</li>
                        </ul>
                    </div>
                    
                    ${leadData.recommendedUniversities && leadData.recommendedUniversities.length > 0 ? `
                    <div style="background-color: #fff; padding: 20px; margin: 20px 0; border: 1px solid #e0e0e0;">
                        <h3 style="color: #2c5282; margin-top: 0;">Your Recommended Universities</h3>
                        ${leadData.recommendedUniversities.map(uni => `
                            <div style="padding: 15px; margin: 10px 0; background-color: #f8f9fa; border-left: 4px solid #2c5282;">
                                <strong style="color: #1a365d; font-size: 18px;">${uni.name}</strong><br>
                                <span style="color: #2c5282; font-weight: 600;">Match Score: ${uni.matchPercentage}%</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    <div style="background-color: #2c5282; color: white; padding: 20px; margin: 30px 0; text-align: center;">
                        <h3 style="margin: 0 0 15px 0;">Need Immediate Assistance?</h3>
                        <p style="margin: 5px 0; font-size: 16px;">
                            📞 Call us: ${process.env.CA_PHONE}<br>
                            📧 Email: ${process.env.CA_EMAIL}
                        </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
                        Best regards,<br>
                        <strong>Career Guidance Team</strong><br>
                        UniPick
                    </p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                    <p style="margin: 0;">© 2025 UniPick. All rights reserved.</p>
                    <p style="margin: 5px 0 0 0;">Your trusted partner in education guidance</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Confirmation sent to student');
    } catch (error) {
        console.error('❌ Error sending confirmation to student:', error);
    }
};

module.exports = {
    sendLeadNotificationToCA,
    sendConfirmationToStudent
};
