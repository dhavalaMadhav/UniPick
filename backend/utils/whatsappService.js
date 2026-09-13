const axios = require('axios');

// Send WhatsApp notification to CA using UltraMsg API
const sendWhatsAppToCA = async (leadData) => {
    try {
        const message = `🎓 *New Student Enquiry*

📝 *Student Details:*
Name: ${leadData.studentName}
Phone: ${leadData.phone}
Email: ${leadData.email}
City: ${leadData.city || 'Not provided'}

🎯 *Interest:*
Stream: ${leadData.stream}
Course: ${leadData.courseInterested || 'Not specified'}
${leadData.quizScore ? `Quiz Score: ${leadData.quizScore}/100` : ''}

${leadData.recommendedUniversities && leadData.recommendedUniversities.length > 0 ? `
🏛️ *Recommended Universities:*
${leadData.recommendedUniversities.map(uni => `• ${uni.name} (${uni.matchPercentage}% match)`).join('\n')}
` : ''}

⏰ Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

📱 Contact student immediately!`;

        const response = await axios.post(
            process.env.WHATSAPP_API_URL,
            {
                token: process.env.WHATSAPP_API_TOKEN,
                to: process.env.CA_WHATSAPP,
                body: message
            }
        );

        console.log('✅ WhatsApp notification sent to CA');
        return response.data;
    } catch (error) {
        console.error('❌ Error sending WhatsApp:', error.message);
        // Don't throw error - continue even if WhatsApp fails
    }
};

module.exports = {
    sendWhatsAppToCA
};
