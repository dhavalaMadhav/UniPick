const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Lead = require('../models/Lead'); // ✅ ADD THIS LINE
const quizController = require('../controllers/quizController');
const leadController = require('../controllers/leadController');
const universityController = require('../controllers/universityController');
const { authenticateToken } = require('../middleware/auth');

// Quiz API
router.post('/quiz/submit', quizController.processQuizResults);

// Lead APIs
router.post('/leads/create', leadController.createLead);
router.post('/leads/quiz', leadController.createLeadFromQuiz);

// University APIs
router.get('/universities', universityController.getAllUniversities);
router.get('/universities/:id', universityController.getUniversityById);

// Admin login API
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Simple authentication (in production, use hashed passwords from database)
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Generate JWT token
            const token = jwt.sign(
                { 
                    username: username,
                    role: 'admin'
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );
            
            // Set token in httpOnly cookie
            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            
            res.json({ 
                success: true,
                token: token
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed' 
        });
    }
});

// Admin verify token
router.get('/admin/verify', authenticateToken, (req, res) => {
    res.json({ 
        success: true, 
        admin: req.admin 
    });
});

// ✅ FIXED: Update lead status and notes
router.post('/admin/leads/:id/status', async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        console.log('📝 Updating lead:', req.params.id, '→', status);
        
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { 
                status: status,
                notes: notes || undefined,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!lead) {
            console.error('❌ Lead not found:', req.params.id);
            return res.status(404).json({ 
                success: false, 
                message: 'Lead not found' 
            });
        }
        
        console.log('✅ Lead status updated successfully');
        
        res.json({ 
            success: true, 
            message: 'Status updated successfully',
            lead: lead 
        });
        
    } catch (error) {
        console.error('❌ Status update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

// Admin get all leads (Protected)
router.get('/admin/leads', authenticateToken, async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('recommendedUniversities.universityId')
            .sort({ createdAt: -1 });
        res.json({ success: true, leads });
    } catch (error) {
        console.error('❌ Error fetching leads:', error);
        res.status(500).json({ success: false, message: 'Error fetching leads' });
    }
});

// Admin delete lead (Protected)
router.delete('/admin/leads/:id', authenticateToken, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting lead:', error);
        res.status(500).json({ success: false, message: 'Error deleting lead' });
    }
});

module.exports = router;
