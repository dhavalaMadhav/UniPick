const express = require('express');
const router = express.Router();
const University = require('../models/University');
const Lead = require('../models/Lead');
const { authenticateToken, checkAuthenticated } = require('../middleware/auth');

// Helper function to send either JSON or rendered EJS based on request headers
function sendPageResponse(req, res, viewName, data) {
    const isJsonRequest = req.originalUrl.startsWith('/api') || 
                          req.xhr || 
                          (req.headers.accept && req.headers.accept.includes('application/json')) || 
                          req.query.format === 'json';
    
    if (isJsonRequest) {
        return res.json(data);
    } else {
        return res.render(viewName, { req, ...data });
    }
}

// Homepage
router.get('/', async (req, res) => {
    try {
        const universities = await University.find().limit(5);
        const testimonials = [
            {
                name: "Rahul Sharma",
                university: "Global Tech University",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
                course: "B.Tech Computer Science",
                review: "The career guidance team helped me find the perfect university for my engineering dreams. Their personalized approach made all the difference!"
            },
            {
                name: "Priya Patel",
                university: "Imperial Business School",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
                course: "MBA Finance",
                review: "Thanks to this platform, I got admitted to my dream business school. The assessment quiz was incredibly accurate in understanding my goals."
            },
            {
                name: "Arjun Kumar",
                university: "National Medical Institute",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
                course: "MBBS",
                review: "The guidance office was extremely helpful throughout my admission process. Now I'm studying at one of India's top medical institutes!"
            },
            {
                name: "Sneha Reddy",
                university: "Creative Arts Academy",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
                course: "B.Des Fashion Design",
                review: "I never thought finding the right design school would be so easy. The counsellors really understood my creative aspirations!"
            }
        ];
        
        sendPageResponse(req, res, 'index', { 
            universities,
            testimonials,
            title: 'UniPick - Your Trusted University Admissions Consultant'
        });
    } catch (error) {
        console.error('Error loading homepage:', error);
        res.status(500).send('Error loading page');
    }
});

// Quiz page
router.get('/quiz', (req, res) => {
    sendPageResponse(req, res, 'quiz', {
        title: 'Career Assessment Quiz - UniPick'
    });
});

// Quiz results page with database recommendations
router.get('/quiz-results', async (req, res) => {
    try {
        const universities = await University.find()
            .limit(5)
            .sort({ createdAt: -1 }); 
        
        sendPageResponse(req, res, 'quiz-results', {
            title: 'Your Career Guidance Results - UniPick',
            universities: universities
        });
    } catch (error) {
        console.error('❌ Error loading quiz results:', error);
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ error: 'Unable to load quiz results' });
        }
        res.status(500).render('error.ejs', {
            title: 'Error',
            message: 'Unable to load quiz results'
        });
    }
});

// Universities listing page
router.get('/universities', async (req, res) => {
    try {
        let universities = await University.find();
        if (!universities || universities.length === 0) {
            const { FALLBACK_UNIVERSITIES } = require('../controllers/universityController');
            universities = FALLBACK_UNIVERSITIES;
        }
        
        sendPageResponse(req, res, 'universities', {
            title: 'Universities - UniPick',
            universities: universities
        });
    } catch (error) {
        console.error('❌ Error fetching universities, using fallback:', error);
        const { FALLBACK_UNIVERSITIES } = require('../controllers/universityController');
        sendPageResponse(req, res, 'universities', {
            title: 'Universities - UniPick',
            universities: FALLBACK_UNIVERSITIES
        });
    }
});

// University detail page
router.get('/university/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        let university = await University.findOne({ slug: slug });
        if (!university && slug.match(/^[0-9a-fA-F]{24}$/)) {
            university = await University.findById(slug);
        }
        if (!university) {
            university = await University.findOne({ slug: new RegExp(`^${slug}$`, 'i') });
        }
        
        if (!university) {
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(404).json({ error: 'University not found' });
            }
            return res.status(404).render('error.ejs', {
                title: 'Not Found',
                message: 'University not found'
            });
        }
        
        sendPageResponse(req, res, 'university-detail', {
            title: university.name,
            university: university
        });
    } catch (error) {
        console.error('❌ Error loading university:', error);
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ error: 'Error loading university details' });
        }
        res.status(500).render('error.ejs', {
            title: 'Error',
            message: 'Error loading university details'
        });
    }
});

// GET /about - About Page
router.get('/about', (req, res) => {
    sendPageResponse(req, res, 'about', { 
        title: 'About -Ravi Vajendla | CA & Admission Consultant',
        page: 'about'
    });
});

router.get('/loading', (req, res) => {
    sendPageResponse(req, res, 'loading', {});
});

// Contact page
router.get('/contact', (req, res) => {
    sendPageResponse(req, res, 'contact', {
        title: 'Contact Us - UniPick'
    });
});

// Admin login page
router.get('/admin', checkAuthenticated, (req, res) => {
    sendPageResponse(req, res, 'admin/login', {
        title: 'Admin Login - UniPick',
        error: null
    });
});

// Admin dashboard (Protected with JWT)
router.get('/admin/dashboard', authenticateToken, async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('recommendedUniversities.universityId')
            .sort({ createdAt: -1 })
            .limit(50);
        
        const stats = {
            total: await Lead.countDocuments(),
            new: await Lead.countDocuments({ status: 'new' }),
            contacted: await Lead.countDocuments({ status: 'contacted' }),
            converted: await Lead.countDocuments({ status: 'converted' })
        };
        
        sendPageResponse(req, res, 'admin/dashboard', {
            title: 'Admin Dashboard - UniPick',
            leads,
            stats
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard');
    }
});

// Admin logout
router.get('/admin/logout', (req, res) => {
    res.clearCookie('adminToken');
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: true, redirect: '/admin' });
    }
    res.redirect('/admin');
});

// Dynamic Sitemap
router.get('/sitemap.xml', async (req, res) => {
    try {
        const universities = await University.find({}, 'slug updatedAt');
        const baseUrl = 'https://www.unipick.org';
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        const staticPages = ['', '/universities', '/about', '/contact', '/quiz'];
        staticPages.forEach(page => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}${page}</loc>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
            xml += '  </url>\n';
        });
        
        universities.forEach(uni => {
            if (uni.slug) {
                xml += '  <url>\n';
                xml += `    <loc>${baseUrl}/university/${uni.slug}</loc>\n`;
                xml += `    <lastmod>${uni.updatedAt ? uni.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>\n`;
                xml += `    <changefreq>monthly</changefreq>\n`;
                xml += `    <priority>0.7</priority>\n`;
                xml += '  </url>\n';
            }
        });
        
        xml += '</urlset>';
        
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap error:', error);
        res.status(500).end();
    }
});

module.exports = router;
