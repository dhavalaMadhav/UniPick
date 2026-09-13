const University = require('../models/University');

// Get all universities
const getAllUniversities = async (req, res) => {
    try {
        const universities = await University.find().sort({ rating: -1, globalRanking: 1 });
        res.json({
            success: true,
            universities
        });
    } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching universities'
        });
    }
};

// Get university by ID or slug
const getUniversityById = async (req, res) => {
    try {
        let university = null;
        const idOrSlug = req.params.id;
        
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            university = await University.findById(idOrSlug);
        }
        if (!university) {
            university = await University.findOne({ slug: idOrSlug });
        }
        if (!university) {
            university = await University.findOne({ slug: new RegExp(`^${idOrSlug}$`, 'i') });
        }
        
        if (!university) {
            return res.status(404).json({
                success: false,
                message: 'University not found'
            });
        }
        res.json({
            success: true,
            university
        });
    } catch (error) {
        console.error('Error fetching university:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching university details'
        });
    }
};

module.exports = {
    getAllUniversities,
    getUniversityById
};
