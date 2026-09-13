const express = require('express');
const router = express.Router();
const University = require('../models/University');


// Course data with programme mapping
const coursesData = {
    engineering: [
        {
            name: 'Computer Science Engineering',
            slug: 'computer-science',
            programmeType: 'computer',
            description: 'Learn programming, algorithms, data structures, AI, and software development',
            fullDescription: 'Computer Science Engineering is one of the most sought-after programs that combines theoretical computer science with practical engineering. Students learn programming languages, data structures, algorithms, artificial intelligence, machine learning, web development, mobile app development, database management, and software engineering principles. The curriculum includes hands-on projects, internships, and industry collaborations to prepare students for careers in technology.',
            icon: 'fas fa-laptop-code',
            duration: '4 Years',
            degree: 'B.Tech/BE',
            eligibility: '10+2 with Physics, Chemistry, Mathematics (Min 60%)',
            averageFees: '₹2-8 Lakhs per year',
            careerOptions: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Full Stack Developer', 'Cloud Architect', 'Cybersecurity Analyst'],
            topRecruiters: ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro'],
            skills: ['Programming', 'Problem Solving', 'Data Structures', 'Algorithms', 'Web Development', 'Database Management']
        },
        {
            name: 'Mechanical Engineering',
            slug: 'mechanical',
            programmeType: 'engineering',
            description: 'Study mechanics, thermodynamics, robotics, and manufacturing processes',
            fullDescription: 'Mechanical Engineering deals with the design, analysis, manufacturing, and maintenance of mechanical systems. It is one of the oldest and broadest engineering disciplines covering areas like thermodynamics, fluid mechanics, materials science, structural analysis, and manufacturing processes. Students work on projects involving robotics, automation, CAD/CAM, and sustainable energy systems.',
            icon: 'fas fa-cogs',
            duration: '4 Years',
            degree: 'B.Tech/BE',
            eligibility: '10+2 with Physics, Chemistry, Mathematics (Min 60%)',
            averageFees: '₹1.5-6 Lakhs per year',
            careerOptions: ['Mechanical Engineer', 'Automation Engineer', 'CAD Designer', 'Production Manager', 'Quality Control Engineer', 'Robotics Engineer'],
            topRecruiters: ['Tata Motors', 'Mahindra', 'L&T', 'Bosch', 'Siemens', 'Ashok Leyland'],
            skills: ['CAD', 'Thermodynamics', 'Manufacturing', 'Design', 'Analysis', 'Robotics']
        },
        {
            name: 'Civil Engineering',
            slug: 'civil',
            programmeType: 'engineering',
            description: 'Design and build infrastructure including buildings, bridges, and roads',
            fullDescription: 'Civil Engineering involves the design, construction, and maintenance of physical infrastructure including roads, bridges, dams, buildings, and water supply systems. Students learn structural analysis, geotechnical engineering, transportation engineering, environmental engineering, and project management. The field combines technical knowledge with practical site experience.',
            icon: 'fas fa-hard-hat',
            duration: '4 Years',
            degree: 'B.Tech/BE',
            eligibility: '10+2 with Physics, Chemistry, Mathematics (Min 60%)',
            averageFees: '₹1-5 Lakhs per year',
            careerOptions: ['Civil Engineer', 'Structural Engineer', 'Construction Manager', 'Urban Planner', 'Site Engineer', 'Project Manager'],
            topRecruiters: ['L&T', 'Shapoorji Pallonji', 'DLF', 'PWD', 'NHAI', 'Tata Projects'],
            skills: ['AutoCAD', 'Structural Design', 'Project Management', 'Site Planning', 'Construction Technology']
        },
        {
            name: 'Electrical Engineering',
            slug: 'electrical',
            programmeType: 'engineering',
            description: 'Power systems, electrical machines, renewable energy, and control systems',
            fullDescription: 'Electrical Engineering focuses on the study and application of electricity, electronics, and electromagnetism. Students learn about power generation, transmission, distribution, electrical machines, control systems, and renewable energy technologies. The curriculum includes circuit analysis, power electronics, and electrical design.',
            icon: 'fas fa-bolt',
            duration: '4 Years',
            degree: 'B.Tech/BE',
            eligibility: '10+2 with Physics, Chemistry, Mathematics (Min 60%)',
            averageFees: '₹1.5-6 Lakhs per year',
            careerOptions: ['Electrical Engineer', 'Power Systems Engineer', 'Control Systems Engineer', 'Renewable Energy Consultant', 'Electrical Designer'],
            topRecruiters: ['NTPC', 'Power Grid', 'Siemens', 'ABB', 'Tata Power', 'L&T'],
            skills: ['Circuit Design', 'Power Systems', 'Control Systems', 'Renewable Energy', 'Electrical Machines']
        },
        {
            name: 'Electronics Engineering',
            slug: 'electronics',
            programmeType: 'engineering',
            description: 'Microelectronics, embedded systems, VLSI, and communication systems',
            fullDescription: 'Electronics Engineering deals with electronic circuits, devices, and systems including microprocessors, embedded systems, VLSI design, and communication systems. Students learn about analog and digital electronics, signal processing, microcontrollers, and IoT devices. The field is crucial for developing modern electronic gadgets and communication technologies.',
            icon: 'fas fa-microchip',
            duration: '4 Years',
            degree: 'B.Tech/BE',
            eligibility: '10+2 with Physics, Chemistry, Mathematics (Min 60%)',
            averageFees: '₹2-7 Lakhs per year',
            careerOptions: ['Electronics Engineer', 'VLSI Design Engineer', 'Embedded Systems Developer', 'Hardware Engineer', 'IoT Specialist'],
            topRecruiters: ['Intel', 'Qualcomm', 'Samsung', 'Texas Instruments', 'Broadcom', 'Analog Devices'],
            skills: ['Circuit Design', 'Embedded Systems', 'VLSI', 'Microcontrollers', 'PCB Design', 'Signal Processing']
        }
    ],
    management: [
        {
            name: 'Master of Business Administration',
            slug: 'mba',
            programmeType: 'management',
            description: 'Advanced management, leadership, strategy, and business analytics',
            fullDescription: 'MBA is a postgraduate program focusing on advanced business management, leadership, and strategic thinking. The curriculum covers finance, marketing, human resources, operations, and strategic management. Students develop leadership skills, analytical thinking, and business acumen through case studies, projects, and internships. Specializations include finance, marketing, HR, operations, consulting, and international business.',
            icon: 'fas fa-chart-line',
            duration: '2 Years',
            degree: 'MBA',
            eligibility: 'Graduation in any discipline + CAT/MAT/XAT/GMAT',
            averageFees: '₹5-25 Lakhs per year',
            careerOptions: ['Management Consultant', 'Business Development Manager', 'Product Manager', 'Investment Banker', 'Marketing Manager', 'Operations Manager'],
            topRecruiters: ['McKinsey', 'BCG', 'Bain', 'Goldman Sachs', 'Deloitte', 'KPMG'],
            skills: ['Strategic Thinking', 'Leadership', 'Financial Analysis', 'Consulting', 'Business Strategy', 'Analytics']
        },
        {
            name: 'Business Administration',
            slug: 'business-administration',
            programmeType: 'management',
            description: 'Core business concepts, organizational management, and strategic planning',
            fullDescription: 'Business Administration programs provide essential knowledge of business operations, management principles, and organizational behavior. Students learn about business strategy, operations management, financial management, and business ethics. The curriculum emphasizes practical business skills and decision-making capabilities.',
            icon: 'fas fa-building',
            duration: '3-4 Years',
            degree: 'BBA/B.Com/BMS',
            eligibility: '10+2 from any stream (Min 50%)',
            averageFees: '₹1-4 Lakhs per year',
            careerOptions: ['Business Manager', 'Administrative Officer', 'Operations Coordinator', 'Business Consultant', 'Project Coordinator'],
            topRecruiters: ['Corporate Firms', 'MNCs', 'Consulting Firms', 'Banks', 'Retail Companies'],
            skills: ['Business Management', 'Strategic Planning', 'Operations', 'Communication', 'Problem Solving']
        },
        {
            name: 'Finance',
            slug: 'finance',
            programmeType: 'management',
            description: 'Financial management, investment analysis, banking, and wealth management',
            fullDescription: 'Finance programs focus on financial markets, investment analysis, corporate finance, banking operations, and financial planning. Students learn about stock markets, portfolio management, financial modeling, risk management, and investment strategies. The curriculum combines theoretical knowledge with practical applications in financial decision-making.',
            icon: 'fas fa-coins',
            duration: '3 Years',
            degree: 'BBA/B.Com',
            eligibility: '10+2 with Commerce/Mathematics (preferred)',
            averageFees: '₹1-5 Lakhs per year',
            careerOptions: ['Financial Analyst', 'Investment Banker', 'Portfolio Manager', 'Financial Planner', 'Risk Analyst', 'Wealth Manager'],
            topRecruiters: ['HDFC Bank', 'ICICI Bank', 'Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Axis Bank'],
            skills: ['Financial Analysis', 'Investment Management', 'Risk Assessment', 'Excel', 'Financial Modeling', 'Market Research']
        },
        {
            name: 'Marketing',
            slug: 'marketing',
            programmeType: 'management',
            description: 'Brand management, digital marketing, consumer behavior, and sales strategy',
            fullDescription: 'Marketing programs cover brand management, digital marketing, consumer behavior, market research, and advertising strategies. Students learn about marketing mix, social media marketing, content marketing, SEO/SEM, and marketing analytics. The curriculum emphasizes both traditional and digital marketing approaches.',
            icon: 'fas fa-bullhorn',
            duration: '3 Years',
            degree: 'BBA/B.Com',
            eligibility: '10+2 from any stream',
            averageFees: '₹1-4 Lakhs per year',
            careerOptions: ['Marketing Manager', 'Brand Manager', 'Digital Marketing Specialist', 'Market Research Analyst', 'Social Media Manager', 'Content Strategist'],
            topRecruiters: ['Unilever', 'P&G', 'Amazon', 'Flipkart', 'Google', 'Facebook'],
            skills: ['Digital Marketing', 'Brand Management', 'Market Research', 'SEO/SEM', 'Content Creation', 'Analytics']
        },
        {
            name: 'Human Resources',
            slug: 'human-resources',
            programmeType: 'management',
            description: 'Talent management, recruitment, employee relations, and organizational development',
            fullDescription: 'Human Resources programs focus on talent acquisition, employee relations, performance management, compensation and benefits, and organizational development. Students learn about HR policies, labor laws, training and development, and strategic HR management. The curriculum prepares students for managing people and organizational culture.',
            icon: 'fas fa-users',
            duration: '3 Years',
            degree: 'BBA/B.Com',
            eligibility: '10+2 from any stream',
            averageFees: '₹1-4 Lakhs per year',
            careerOptions: ['HR Manager', 'Recruitment Specialist', 'Training Manager', 'HR Business Partner', 'Talent Acquisition Lead', 'Compensation Analyst'],
            topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Deloitte', 'Accenture', 'Cognizant'],
            skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'HR Analytics', 'Training', 'Communication']
        }
    ],
    science: [
        {
            name: 'Computer Applications',
            slug: 'computer-applications',
            programmeType: 'computer',
            description: 'Programming, software development, database management, and IT applications',
            fullDescription: 'Computer Applications programs focus on practical aspects of computing including programming languages, software development, database management, web technologies, and IT applications. Students learn languages like Java, Python, C++, and technologies like web development, mobile apps, and database systems. The curriculum emphasizes hands-on coding and application development.',
            icon: 'fas fa-desktop',
            duration: '3 Years',
            degree: 'BCA',
            eligibility: '10+2 with Mathematics (preferred)',
            averageFees: '₹1-4 Lakhs per year',
            careerOptions: ['Software Developer', 'Web Developer', 'App Developer', 'Database Administrator', 'System Analyst', 'IT Consultant'],
            topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Tech Mahindra', 'Capgemini', 'HCL'],
            skills: ['Programming', 'Web Development', 'Database Management', 'Software Testing', 'Java', 'Python']
        },
        {
            name: 'Mathematics',
            slug: 'mathematics',
            programmeType: 'science',
            description: 'Pure mathematics, applied mathematics, statistics, and mathematical modeling',
            fullDescription: 'Mathematics programs cover pure and applied mathematics including algebra, calculus, geometry, statistics, and mathematical modeling. Students develop analytical and problem-solving skills through theoretical study and practical applications. The curriculum prepares students for careers in research, teaching, data science, and quantitative analysis.',
            icon: 'fas fa-square-root-alt',
            duration: '3 Years',
            degree: 'BSc',
            eligibility: '10+2 with Mathematics',
            averageFees: '₹30,000-2 Lakhs per year',
            careerOptions: ['Data Analyst', 'Statistician', 'Mathematician', 'Teacher', 'Quantitative Analyst', 'Research Scientist', 'Actuary'],
            topRecruiters: ['Banks', 'Insurance Companies', 'Research Institutions', 'Educational Institutions', 'Analytics Companies'],
            skills: ['Mathematical Analysis', 'Problem Solving', 'Statistics', 'Data Analysis', 'Logical Reasoning', 'Research']
        },
        {
            name: 'Physics',
            slug: 'physics',
            programmeType: 'science',
            description: 'Classical mechanics, quantum physics, electromagnetism, and experimental physics',
            fullDescription: 'Physics programs explore fundamental principles of matter, energy, and their interactions. Students study classical mechanics, quantum mechanics, thermodynamics, electromagnetism, and modern physics. The curriculum includes theoretical concepts and experimental work in laboratories, preparing students for research, teaching, or technical careers.',
            icon: 'fas fa-atom',
            duration: '3 Years',
            degree: 'BSc',
            eligibility: '10+2 with Physics and Mathematics',
            averageFees: '₹30,000-2 Lakhs per year',
            careerOptions: ['Research Scientist', 'Physics Teacher', 'Laboratory Technician', 'Data Analyst', 'Scientific Officer', 'Astronomer'],
            topRecruiters: ['ISRO', 'DRDO', 'BARC', 'Research Institutes', 'Universities', 'CSIR Labs'],
            skills: ['Analytical Thinking', 'Experimental Skills', 'Mathematical Analysis', 'Research', 'Problem Solving', 'Data Interpretation']
        }
    ],
    arts: [
        {
            name: 'Literature',
            slug: 'literature',
            programmeType: 'arts',
            description: 'English literature, poetry, drama, literary criticism, and creative writing',
            fullDescription: 'Literature programs explore English and world literature including poetry, drama, novels, and literary criticism. Students analyze literary works, study different literary periods, develop critical thinking, and enhance creative writing skills. The curriculum covers classical to contemporary literature with focus on interpretation and analysis.',
            icon: 'fas fa-book-open',
            duration: '3 Years',
            degree: 'BA',
            eligibility: '10+2 from any stream',
            averageFees: '₹20,000-1.5 Lakhs per year',
            careerOptions: ['Content Writer', 'Editor', 'Teacher', 'Journalist', 'Author', 'Literary Critic', 'Publishing Professional'],
            topRecruiters: ['Publishing Houses', 'Media Companies', 'Educational Institutions', 'Content Agencies', 'NGOs'],
            skills: ['Critical Thinking', 'Creative Writing', 'Research', 'Communication', 'Analysis', 'Editing']
        },
        {
            name: 'Psychology',
            slug: 'psychology',
            programmeType: 'arts',
            description: 'Human behavior, mental health, counseling, and psychological research',
            fullDescription: 'Psychology programs study human behavior, mental processes, cognitive functions, and emotional well-being. Students learn about developmental psychology, abnormal psychology, counseling techniques, research methods, and therapeutic approaches. The curriculum combines theoretical knowledge with practical applications in mental health and counseling.',
            icon: 'fas fa-brain',
            duration: '3 Years',
            degree: 'BA/BSc',
            eligibility: '10+2 from any stream',
            averageFees: '₹50,000-3 Lakhs per year',
            careerOptions: ['Clinical Psychologist', 'Counselor', 'HR Professional', 'School Psychologist', 'Research Analyst', 'Child Psychologist'],
            topRecruiters: ['Hospitals', 'Counseling Centers', 'Schools', 'NGOs', 'Corporate HR Departments', 'Research Institutions'],
            skills: ['Counseling', 'Research', 'Communication', 'Empathy', 'Assessment', 'Problem Solving']
        }
    ],
    health: [
        {
            name: 'Medicine',
            slug: 'medicine',
            programmeType: 'medical',
            description: 'Medical sciences, clinical practice, patient care, and healthcare management',
            fullDescription: 'Medicine encompasses the study and practice of diagnosing, treating, and preventing diseases. Students learn anatomy, physiology, pathology, pharmacology, and clinical medicine through classroom instruction and hospital rotations. The field requires dedication, compassion, and continuous learning to provide quality healthcare.',
            icon: 'fas fa-user-md',
            duration: '5.5 Years',
            degree: 'MBBS/MD',
            eligibility: 'NEET qualification with PCB (Min 50%)',
            averageFees: '₹5-25 Lakhs per year',
            careerOptions: ['Doctor', 'Surgeon', 'Physician', 'Medical Specialist', 'Researcher', 'Healthcare Administrator'],
            topRecruiters: ['Hospitals', 'Clinics', 'Medical Colleges', 'Research Institutions', 'Healthcare Organizations'],
            skills: ['Clinical Skills', 'Diagnosis', 'Patient Care', 'Medical Knowledge', 'Communication', 'Decision Making']
        },
        {
            name: 'Pharmacy',
            slug: 'pharmacy',
            programmeType: 'pharmacy',
            description: 'Pharmaceutical sciences, drug development, and patient care',
            fullDescription: 'Pharmacy programs focus on pharmaceutical sciences, drug formulation, pharmacology, medicinal chemistry, and patient care. Students learn about drug manufacturing, quality control, pharmaceutical marketing, hospital pharmacy, and clinical pharmacy. The curriculum combines theoretical pharmaceutical knowledge with practical training in drug development and patient counseling.',
            icon: 'fas fa-pills',
            duration: '4 Years',
            degree: 'B.Pharm',
            eligibility: '10+2 with Physics, Chemistry, Biology/Mathematics',
            averageFees: '₹1-4 Lakhs per year',
            careerOptions: ['Pharmacist', 'Drug Inspector', 'Medical Representative', 'Research Scientist', 'Hospital Pharmacist', 'Pharmaceutical Analyst'],
            topRecruiters: ['Cipla', 'Sun Pharma', 'Dr. Reddy\'s', 'Lupin', 'Pfizer', 'GlaxoSmithKline'],
            skills: ['Pharmaceutical Knowledge', 'Drug Formulation', 'Quality Control', 'Research', 'Patient Counseling', 'Regulatory Affairs']
        }
    ],
    commerce: [
        {
            name: 'Accounting',
            slug: 'accounting',
            programmeType: 'commerce',
            description: 'Financial accounting, cost accounting, auditing, and taxation',
            fullDescription: 'Accounting programs provide comprehensive knowledge of financial accounting, cost accounting, management accounting, auditing, and taxation. Students learn about financial statements, accounting standards, audit procedures, tax laws, and accounting software. The curriculum prepares students for professional accounting careers and certifications like CA, CMA, and ACCA.',
            icon: 'fas fa-file-invoice-dollar',
            duration: '3 Years',
            degree: 'B.Com',
            eligibility: '10+2 with Commerce (preferred)',
            averageFees: '₹20,000-2 Lakhs per year',
            careerOptions: ['Accountant', 'Auditor', 'Tax Consultant', 'Financial Analyst', 'Accounts Manager', 'Internal Auditor'],
            topRecruiters: ['Big 4 Firms', 'Banks', 'Financial Institutions', 'Corporate Companies', 'Audit Firms'],
            skills: ['Accounting', 'Auditing', 'Taxation', 'Financial Analysis', 'Tally/SAP', 'Excel']
        },
        {
            name: 'Banking & Finance',
            slug: 'banking-finance',
            programmeType: 'commerce',
            description: 'Banking operations, financial markets, investment management, and risk analysis',
            fullDescription: 'Banking & Finance programs cover banking operations, financial markets, investment management, risk analysis, and financial planning. Students learn about retail banking, corporate banking, investment banking, financial regulations, and banking technology. The curriculum combines banking fundamentals with modern financial practices.',
            icon: 'fas fa-university',
            duration: '3 Years',
            degree: 'B.Com/BBA',
            eligibility: '10+2 with Commerce/Mathematics',
            averageFees: '₹50,000-3 Lakhs per year',
            careerOptions: ['Bank Manager', 'Financial Advisor', 'Investment Analyst', 'Loan Officer', 'Credit Analyst', 'Relationship Manager'],
            topRecruiters: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank'],
            skills: ['Banking Operations', 'Financial Analysis', 'Investment Management', 'Risk Assessment', 'Customer Service', 'Financial Planning']
        }
    ],
    diploma: [
        {
            name: 'Diploma Programs',
            slug: 'certificate',
            programmeType: 'diploma',
            description: 'Short-term vocational and skill-based diploma courses across various fields',
            fullDescription: 'Diploma programs offer focused, practical training in specific fields ranging from engineering, IT, design, to healthcare. These programs are shorter than degree courses and emphasize hands-on skills and industry readiness. Students can pursue diplomas after 10th or 12th grade, gaining specialized knowledge for immediate employment or as a pathway to degree programs.',
            icon: 'fas fa-certificate',
            duration: '1-3 Years',
            degree: 'Diploma',
            eligibility: '10th/10+2 depending on course',
            averageFees: '₹30,000-2 Lakhs total',
            careerOptions: ['Junior Engineer', 'Technician', 'Assistant', 'Operator', 'Technical Support', 'Specialist'],
            topRecruiters: ['Manufacturing Companies', 'IT Firms', 'Hospitals', 'Service Industries', 'Government Departments'],
            skills: ['Technical Skills', 'Practical Knowledge', 'Industry Tools', 'Problem Solving', 'Hands-on Experience']
        }
    ]
};


// Helper function to send either JSON or rendered EJS based on request headers
function sendCourseResponse(req, res, viewName, data) {
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

// Category mapping helper
function resolveCategory(catParam) {
    const cat = (catParam || '').toLowerCase();
    if (coursesData[cat]) return cat;
    if (cat === 'science-arts') return 'science';
    if (cat === 'health-commerce') return 'health';
    if (cat === 'medical') return 'health';
    if (cat === 'business') return 'management';
    return cat;
}

// Helper to find course anywhere in coursesData
function findCourseAnywhere(slugParam) {
    const targetSlug = (slugParam || '').toLowerCase();
    for (const cat of Object.keys(coursesData)) {
        const found = coursesData[cat].find(c => c.slug === targetSlug || c.slug.replace(/-/g, '') === targetSlug.replace(/-/g, ''));
        if (found) {
            return { course: found, category: cat };
        }
    }
    return null;
}

// GET /courses - Main courses listing page
router.get('/', async (req, res) => {
    try {
        const allCourses = [];
        Object.keys(coursesData).forEach(category => {
            coursesData[category].forEach(course => {
                allCourses.push({
                    ...course,
                    category: category,
                    categoryName: category.charAt(0).toUpperCase() + category.slice(1)
                });
            });
        });
        
        sendCourseResponse(req, res, 'courses', { 
            courses: allCourses,
            title: 'Explore Courses - Unipick'
        });
    } catch (error) {
        console.error('Error loading courses:', error);
        res.status(500).json({ error: 'Error loading courses: ' + error.message });
    }
});


// GET /courses/:category - Display courses by category or single course fallback
router.get('/:category', async (req, res) => {
    try {
        const rawCat = req.params.category.toLowerCase();
        const category = resolveCategory(rawCat);
        
        if (coursesData[category]) {
            const courses = coursesData[category].map(course => ({
                ...course,
                category: category,
                categoryName: category.charAt(0).toUpperCase() + category.slice(1)
            }));
            
            return sendCourseResponse(req, res, 'courses', { 
                courses: courses,
                title: `${category.charAt(0).toUpperCase() + category.slice(1)} Courses - Unipick`
            });
        }
        
        // If category is not in coursesData, check if it's a direct course slug!
        const result = findCourseAnywhere(rawCat);
        if (result) {
            const { course, category: foundCat } = result;
            let universities = await University.find({
                programmes: { $in: [course.programmeType, course.programmeType + 's', 'sciences', 'engineering', 'management', 'computer', 'medical', 'pharmacy', 'commerce'] }
            })
            .sort({ rating: -1 })
            .limit(12);
            
            if (!universities || universities.length === 0) {
                universities = await University.find().limit(12);
            }
            
            return sendCourseResponse(req, res, 'course-detail', {
                course: course,
                category: foundCat,
                categoryName: foundCat.charAt(0).toUpperCase() + foundCat.slice(1),
                universities: universities,
                title: `${course.name} - Unipick`
            });
        }
        
        return res.status(404).json({ error: 'Category or Course not found' });
    } catch (error) {
        console.error('Error loading category:', error);
        res.status(500).json({ error: 'Error loading category' });
    }
});


// GET /courses/:category/:slug - Display individual course details
router.get('/:category/:slug', async (req, res) => {
    try {
        const rawCat = req.params.category.toLowerCase();
        const slug = req.params.slug.toLowerCase();
        
        let category = resolveCategory(rawCat);
        let course = coursesData[category] ? coursesData[category].find(c => c.slug === slug) : null;
        
        // Robust fallback: If course not found in specified category, search across ALL categories
        if (!course) {
            const fallbackResult = findCourseAnywhere(slug);
            if (fallbackResult) {
                course = fallbackResult.course;
                category = fallbackResult.category;
            }
        }
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        // Fetch universities offering this programmeType (with fallbacks)
        const progSearch = [course.programmeType];
        if (course.programmeType === 'science') progSearch.push('sciences');
        if (course.programmeType === 'sciences') progSearch.push('science');
        if (course.programmeType === 'medical') progSearch.push('health');
        
        let universities = await University.find({
            programmes: { $in: progSearch },
            featured: true
        })
        .sort({ rating: -1 })
        .limit(12);
        
        if (!universities || universities.length === 0) {
            universities = await University.find({
                programmes: { $in: progSearch }
            })
            .sort({ rating: -1 })
            .limit(12);
        }

        if (!universities || universities.length === 0) {
            universities = await University.find().sort({ rating: -1 }).limit(12);
        }
        
        sendCourseResponse(req, res, 'course-detail', { 
            course: course,
            category: category,
            categoryName: category.charAt(0).toUpperCase() + category.slice(1),
            universities: universities,
            title: `${course.name} - Unipick`
        });
    } catch (error) {
        console.error('Error loading course:', error);
        res.status(500).json({ error: 'Error loading course' });
    }
});


module.exports = router;
