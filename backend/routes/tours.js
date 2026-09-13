const express = require('express');
const router = express.Router();
const VirtualTour = require('../models/VirtualTour');
const University = require('../models/University');
const { authenticateToken } = require('../middleware/auth');

// Get all virtual tours
router.get('/all', async (req, res) => {
    try {
        const tours = await VirtualTour.find({ isActive: true })
            .populate('university', 'name location logo')
            .sort({ featured: -1, views: -1 });
        
        res.json({
            success: true,
            tours: tours
        });
    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ success: false, message: 'Error fetching tours' });
    }
});

// Get tours by university
router.get('/university/:universityId', async (req, res) => {
    try {
        const tours = await VirtualTour.find({ 
            university: req.params.universityId,
            isActive: true 
        }).sort({ featured: -1 });
        
        res.json({
            success: true,
            tours: tours
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tours' });
    }
});

// Get single tour
router.get('/:tourId', async (req, res) => {
    try {
        const tour = await VirtualTour.findById(req.params.tourId)
            .populate('university', 'name location description website');
        
        if (!tour) {
            return res.status(404).json({ success: false, message: 'Tour not found' });
        }
        
        // Increment views
        tour.views += 1;
        await tour.save();
        
        res.json({
            success: true,
            tour: tour
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tour' });
    }
});

// Admin: Create tour
router.post('/admin/create', authenticateToken, async (req, res) => {
    try {
        const tour = new VirtualTour(req.body);
        await tour.save();
        
        res.json({
            success: true,
            message: 'Virtual tour created successfully',
            tour: tour
        });
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ success: false, message: 'Error creating tour' });
    }
});

// Admin: Update tour
router.put('/admin/update/:tourId', authenticateToken, async (req, res) => {
    try {
        const tour = await VirtualTour.findByIdAndUpdate(
            req.params.tourId,
            req.body,
            { new: true }
        );
        
        res.json({
            success: true,
            message: 'Tour updated successfully',
            tour: tour
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating tour' });
    }
});

// Admin: Delete tour
router.delete('/admin/delete/:tourId', authenticateToken, async (req, res) => {
    try {
        await VirtualTour.findByIdAndUpdate(req.params.tourId, { isActive: false });
        
        res.json({
            success: true,
            message: 'Tour deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting tour' });
    }
});

module.exports = router;
