const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessages');
const { authenticateToken } = require('../middleware/auth');

// Get or create chat session
router.post('/session/create', async (req, res) => {
    try {
        const { studentName, studentEmail, studentPhone } = req.body;
        
        const sessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const chatSession = new ChatMessage({
            sessionId,
            studentName,
            studentEmail,
            studentPhone,
            messages: [{
                sender: 'bot',
                message: `Hi ${studentName}! 👋 Welcome to UniPick Career Guidance.\n\nI'm here to help you with:\n✅ University recommendations\n✅ Career guidance\n✅ Scholarship information\n✅ Course details\n\nHow can I assist you today?`,
                timestamp: new Date()
            }]
        });
        
        await chatSession.save();
        
        console.log('✅ Chat session created:', sessionId);
        
        res.json({
            success: true,
            sessionId: sessionId,
            message: 'Chat session created'
        });
    } catch (error) {
        console.error('❌ Chat session error:', error);
        res.status(500).json({ success: false, message: 'Error creating session' });
    }
});

// Send message
router.post('/message/send', async (req, res) => {
    try {
        const { sessionId, message, sender } = req.body;
        
        console.log('📨 Received message:', { sessionId, message, sender });
        
        const chat = await ChatMessage.findOne({ sessionId });
        
        if (!chat) {
            console.error('❌ Session not found:', sessionId);
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        
        // Add user message
        chat.messages.push({
            sender: sender || 'student',
            message: message,
            timestamp: new Date()
        });
        
        // Get bot auto-reply
        const autoReply = getAutoReply(message);
        
        if (autoReply) {
            console.log('🤖 Bot reply:', autoReply);
            chat.messages.push({
                sender: 'bot',
                message: autoReply,
                timestamp: new Date()
            });
        } else {
            // Forward to counsellor
            chat.status = 'waiting';
            chat.messages.push({
                sender: 'bot',
                message: "Thanks for your question! 🙏 Our counsellor will respond shortly. Typically within 2-3 minutes during business hours (9 AM - 7 PM).",
                timestamp: new Date()
            });
        }
        
        await chat.save();
        
        console.log('✅ Message saved, total messages:', chat.messages.length);
        
        res.json({
            success: true,
            messages: chat.messages
        });
    } catch (error) {
        console.error('❌ Send message error:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

// Get messages for session
router.get('/messages/:sessionId', async (req, res) => {
    try {
        const chat = await ChatMessage.findOne({ sessionId: req.params.sessionId });
        
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        
        res.json({
            success: true,
            messages: chat.messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
});

// Admin: Get all active chats
router.get('/admin/active', authenticateToken, async (req, res) => {
    try {
        const activeChats = await ChatMessage.find({ 
            status: { $in: ['active', 'waiting'] } 
        })
        .sort({ 'messages.0.timestamp': -1 })
        .limit(50);
        
        res.json({
            success: true,
            chats: activeChats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching chats' });
    }
});

// Admin: Send reply
router.post('/admin/reply', authenticateToken, async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        
        const chat = await ChatMessage.findOne({ sessionId });
        
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        
        chat.messages.push({
            sender: 'admin',
            message: message,
            timestamp: new Date()
        });
        
        chat.status = 'active';
        chat.assignedTo = req.admin.username;
        
        await chat.save();
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending reply' });
    }
});

// AI Bot responses for common queries
function getAutoReply(message) {
    const msg = message.toLowerCase();
    
    // Greetings
    if (msg.match(/^(hi|hello|hey|good morning|good evening|namaste)/)) {
        return "Hello! 😊 I'm your UniPick assistant. I can help you with:\n\n📚 University recommendations\n💰 Scholarship information\n📊 Career guidance\n📝 Admission process\n\nWhat would you like to know?";
    }
    
    // Quiz/Assessment
    if (msg.includes('quiz') || msg.includes('assessment') || msg.includes('test')) {
        return "Our career assessment quiz is a great way to find your perfect university match! 🎯\n\nIt takes just 5 minutes and provides personalized recommendations based on:\n• Your interests\n• Academic background\n• Career goals\n• Budget preferences\n\n👉 Start the quiz here: " + (process.env.BASE_URL || 'http://localhost:3000') + "/quiz";
    }
    
    // Fees/Cost
    if (msg.includes('fee') || msg.includes('cost') || msg.includes('price') || msg.includes('expensive')) {
        return "University fees vary based on:\n\n📌 Program (Engineering, Medical, Management)\n📌 University ranking\n📌 Location\n\nTypical ranges:\n• Engineering: ₹3-15 LPA\n• Management: ₹5-18 LPA\n• Medical: ₹6-15 LPA\n\n💡 We also help with scholarships and education loans!\n\nWhat stream are you interested in?";
    }
    
    // Scholarship
    if (msg.includes('scholarship') || msg.includes('financial aid') || msg.includes('discount')) {
        return "Great news! We help students access various scholarships! 💰\n\n✅ Merit-based scholarships\n✅ Need-based financial aid\n✅ Special category benefits\n✅ Education loan assistance\n\nTo check your eligibility, I need:\n📝 Your academic stream\n📝 12th percentage/marks\n📝 Family income range\n\nShare these details, and I'll connect you with our counsellor!";
    }
    
    // Placement
    if (msg.includes('placement') || msg.includes('job') || msg.includes('package') || msg.includes('salary')) {
        return "Placement records are crucial! 📊\n\nOur partner universities offer:\n✅ 85-98% placement rates\n✅ Average packages: ₹4-12 LPA\n✅ Highest packages: ₹25-45 LPA\n✅ Top recruiters: TCS, Infosys, Wipro, Deloitte, etc.\n\nWhich field interests you?\n• Engineering\n• Management\n• Commerce\n• Science";
    }
    
    // Contact
    if (msg.includes('contact') || msg.includes('phone') || msg.includes('call') || msg.includes('number')) {
        return "📞 Contact our counselling team:\n\n☎️ Phone: " + (process.env.CA_PHONE || '+91-XXXXXXXXXX') + "\n📧 Email: " + (process.env.CA_EMAIL || 'guidance@UniPick.com') + "\n💬 WhatsApp: " + (process.env.CA_PHONE || '+91-XXXXXXXXXX') + "\n\n⏰ Available: Mon-Sat, 9:00 AM - 7:00 PM\n\nYou can also continue chatting here - I'm available 24/7!";
    }
    
    // Eligibility
    if (msg.includes('eligibility') || msg.includes('qualify') || msg.includes('criteria') || msg.includes('require')) {
        return "Eligibility varies by program:\n\n🎓 **Engineering (B.Tech)**\n• 12th PCM with 60%+ marks\n• JEE Main/State CET score\n\n🎓 **Management (MBA)**\n• Any graduation with 50%+\n• CAT/MAT/CMAT score\n\n🎓 **Medical (MBBS)**\n• 12th PCB with 60%+\n• NEET score\n\n📝 Share your stream & marks for personalized guidance!";
    }
    
    // Thank you
    if (msg.match(/(thank|thanks|thx|appreciate)/)) {
        return "You're welcome! 😊\n\nIs there anything else I can help you with?\n\n💡 Quick options:\n• View universities\n• Take career quiz\n• Check scholarship eligibility\n• Talk to counsellor";
    }
    
    // Universities
    if (msg.includes('university') || msg.includes('universities') || msg.includes('college')) {
        return "We partner with 100+ top universities across India! 🏛️\n\nOur universities offer:\n✅ NAAC A+ accreditation\n✅ NIRF ranked programs\n✅ World-class infrastructure\n✅ Industry collaborations\n\n👉 Explore universities: " + (process.env.BASE_URL || 'http://localhost:3000') + "/universities\n\nOr tell me your preferred:\n• Stream (Engg/Medical/Commerce)\n• Location\n• Budget";
    }
    
    // How it works
    if (msg.includes('how') || msg.includes('process') || msg.includes('work')) {
        return "Here's how UniPick works: 📋\n\n1️⃣ **Career Assessment**\n   Take our 5-min quiz\n\n2️⃣ **Get Recommendations**\n   Personalized university matches\n\n3️⃣ **Expert Counselling**\n   Talk to our advisors\n\n4️⃣ **Apply & Enroll**\n   We guide you end-to-end\n\n5️⃣ **Scholarship Support**\n   Maximize financial aid\n\n🚀 Ready to start? Take the quiz or ask me anything!";
    }
    
    // Default: Forward to counsellor
    return null;
}

module.exports = router;
