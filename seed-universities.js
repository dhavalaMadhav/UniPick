require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const University = require('./backend/models/University');

const universities = [
    {
        name: "Swarrnim Startup & Innovation University",
        location: "Gandhinagar, Gujarat",
        state: "gujarat",
        established: 2017,
        description: "Swarrnim Startup & Innovation University (SSIU) was established in 2017 under the Gujarat Private Universities Act and is India's first private 'startup-focused' university. Nestling in a green campus, Swarrnim emphasizes innovation and entrepreneurship. It offers over 100 multidisciplinary programs (around 106 courses) across Engineering, Architecture, Design, Science, Management, Paramedical, and Agriculture among other fields. Its focus on startups is reflected in its curriculum and clubs.",
        bannerImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved | AICTE | AIU | Ayush | CCIM | INC | COA",
        ranking: "NIRF 2025 Reported | India's 1st Startup University",
        website: "https://swarrnimuniversity.edu.in",
        students: "2,045+",
        faculty: "180+",
        campusSize: "75 acres",
        feeRange: "₹1.3 - 4.3 LPA",
        fee: 350000,
        globalRanking: 45,
        mastersPrograms: 40,
        scholarships: 35,
        featured: true,
        rating: 4.3,
        programmes: ["engineering", "management", "computer", "design", "architecture", "sciences", "medical"],
        facilities: [
            "75-Acre Main Campus",
            "In-Campus Hospital",
            "Startup Incubation & Research Center",
            "Modern Library & Computer Labs",
            "On-Campus Hostels & Mess",
            "Sports Grounds & Complex",
            "Wi-Fi Enabled Campus",
            "Entrepreneurship & Startup Clubs"
        ],
        placements: {
            percentage: 98,
            averagePackage: "₹5.2 LPA",
            highestPackage: "₹84 LPA (Dom) / ₹48 LPA (Intl)",
            topRecruiters: ["Wipro", "Infosys", "IBM", "ICICI Bank", "Tech Mahindra", "eClinicalWorks", "Cognizant", "Byju's", "Reliance", "HCL", "Deloitte", "Coca-Cola"]
        },
        contactInfo: {
            phone: "+91 95123 43333",
            email: "info@swarrnim.edu.in",
            address: "Bhoyan Rathod, Adalaj Kalol Highway, Gandhinagar, Gujarat – 382422"
        },
        address: "Bhoyan Rathod, Adalaj Kalol Highway, Gandhinagar, Gujarat – 382422"
    },
    {
        name: "Swaminarayan University",
        location: "Kalol, Gandhinagar, Gujarat",
        state: "gujarat",
        established: 2022,
        description: "Swaminarayan University (SU), established by Shree Swaminarayan Gurukul in 2022, is a multi-disciplinary private university in Kalol (Gandhinagar district). The 60-acre campus is UGC-approved under the Gujarat Private Universities Act 2009. SU comprises a large group of institutes offering programs in Engineering, Management, Commerce, Arts & Humanities, Education, Physiotherapy, Allied Health/Paramedical, Ayurveda, Homoeopathy, Nursing, Science, Law, and Information Technology.",
        bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved | Gujarat Private Universities Act 2009",
        ranking: "UGC Recognized | High Placement Success Rate",
        website: "https://swaminarayanuniversity.ac.in",
        students: "3,500+",
        faculty: "200+",
        campusSize: "60 acres",
        feeRange: "₹1.5 - 3.8 LPA",
        fee: 265000,
        globalRanking: 85,
        mastersPrograms: 35,
        scholarships: 30,
        featured: true,
        rating: 4.3,
        programmes: ["engineering", "management", "computer", "commerce", "medical", "law", "sciences", "arts", "education"],
        facilities: [
            "60-Acre Campus on Ahmedabad-Mehsana Highway",
            "Training & Placement Cell",
            "Modern Laboratories & Classrooms",
            "Central Library",
            "Ayurveda & Allied Health Facilities",
            "Hostel & Dining Facilities",
            "Sports & Recreation Grounds"
        ],
        placements: {
            percentage: 90,
            averagePackage: "₹4.5 LPA",
            highestPackage: "₹34.5 LPA",
            topRecruiters: ["TCS", "Infosys", "Wipro", "Financial & Tech Corporates", "Healthcare Partners"]
        },
        contactInfo: {
            phone: "+91 98765 43211",
            email: "info@swaminarayanuniversity.ac.in",
            address: "Ahmedabad–Mehsana Highway, Kalol, Gandhinagar District, Gujarat – 382725"
        },
        address: "Ahmedabad–Mehsana Highway, Kalol, Gandhinagar District, Gujarat – 382725"
    },
    {
        name: "Sankalchand Patel University",
        location: "Visnagar, Mehsana, Gujarat",
        state: "gujarat",
        established: 2016,
        description: "Sankalchand Patel University (SPU, est. 2016) is a UGC-recognized private university spread over an 84-acre green campus in Visnagar. It encompasses 16 constituent faculties covering Engineering, Medicine, Dental, Nursing, Pharmacy, Physiotherapy, Science, Commerce & Management, Law, Education, Design, and Vocational Studies. SPU currently enrolls over 10,000 students with 600+ faculty. Graded 4-star in GSIRF.",
        bannerImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved | GSIRF 4-Star Graded | AICTE",
        ranking: "GSIRF 4-Star Rating | Top University in North Gujarat",
        website: "https://spu.ac.in",
        students: "10,000+",
        faculty: "600+",
        campusSize: "84 acres",
        feeRange: "₹1.8 - 4.5 LPA",
        fee: 300000,
        globalRanking: 110,
        mastersPrograms: 45,
        scholarships: 40,
        featured: true,
        rating: 4.4,
        programmes: ["engineering", "management", "medical", "dental", "pharmacy", "computer", "law", "design", "education", "commerce", "sciences"],
        facilities: [
            "84-Acre Green Campus (Sankalchand Patel Vidyadham)",
            "Attached Teaching Hospitals & Diagnostic Center",
            "14 Advanced Research Laboratories",
            "Audio-Visual Studio & Learning Centers",
            "Biogas Plant & EV Charging Station",
            "Wi-Fi Enabled Classrooms",
            "Auditoriums & Hostels"
        ],
        placements: {
            percentage: 88,
            averagePackage: "₹3.5 - 4 LPA",
            highestPackage: "₹18 LPA",
            topRecruiters: ["Pharma Majors", "Tech & IT Firms", "Government & Private Hospitals", "Manufacturing Leaders", "Zydus", "Torrent"]
        },
        contactInfo: {
            phone: "+91 98765 43212",
            email: "info@spu.ac.in",
            address: "Sankalchand Patel Vidyadham, Ambaji-Gandhinagar Hwy, Visnagar – 384315, Mehsana District, Gujarat"
        },
        address: "Sankalchand Patel Vidyadham, Ambaji-Gandhinagar Hwy, Visnagar – 384315, Mehsana District, Gujarat"
    },
    {
        name: "Uka Tarsadia University",
        location: "Bardoli, Surat, Gujarat",
        state: "gujarat",
        established: 2011,
        description: "Uka Tarsadia University (UTU), established under the Gujarat Private University (Amendment) Act 2011, is a private university at Gopal Vidyanagar, Surat. Approved under UGC Section 22, UTU hosts over 10,000 students on its fully Wi-Fi campus. It consists of 28 institutes offering programs from Engineering and Architecture to Pharmacy, Biotechnology, IT, Management, Design, Nursing, Agriculture and more.",
        bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved (Section 22) | AICTE | PCI",
        ranking: "UGC Recognized | Top Campus in South Gujarat",
        website: "https://utu.ac.in",
        students: "10,000+",
        faculty: "450+",
        campusSize: "100+ acres",
        feeRange: "₹1.5 - 4.0 LPA",
        fee: 280000,
        globalRanking: 130,
        mastersPrograms: 40,
        scholarships: 35,
        featured: true,
        rating: 4.3,
        programmes: ["engineering", "management", "pharmacy", "computer", "architecture", "design", "sciences"],
        facilities: [
            "Maliba Campus (Gopal Vidyanagar) Fully Wi-Fi Enabled",
            "28 Specialized Constituent Institutes",
            "Modern High-Tech Research Laboratories",
            "Central & Departmental Libraries",
            "Hostels, Mess & Food Courts",
            "Sports Fields & Indoor Stadium"
        ],
        placements: {
            percentage: 89,
            averagePackage: "₹4.2 LPA",
            highestPackage: "₹15 LPA",
            topRecruiters: ["L&T", "Reliance Industries", "TCS", "Sun Pharma", "Alembic", "Infosys", "Torrent Pharma"]
        },
        contactInfo: {
            phone: "+91 98765 43213",
            email: "info@utu.ac.in",
            address: "Maliba Campus, Gopal Vidyanagar, Bardoli–Mahuva Road, Tarsadi – 394350, Dist. Surat, Gujarat"
        },
        address: "Maliba Campus, Gopal Vidyanagar, Bardoli–Mahuva Road, Tarsadi – 394350, Dist. Surat, Gujarat"
    },
    {
        name: "Ajeenkya D Y Patil University",
        location: "Lohegaon, Pune, Maharashtra",
        state: "maharashtra",
        established: 2015,
        description: "Ajeenkya D Y Patil University (ADYPU) is a private university in the DY Patil Group (est. 2015) located at Lohegaon, Pune, Maharashtra. NAAC has accredited it 'A' grade. ADYPU comprises several schools of Engineering, Management, Design, Hospitality, Law, Liberal Arts, Architecture, Film & Media, Science, Allied Health, and Centers of Indian Knowledge System. Its scenic 100-acre Pune campus includes specialized labs and a finishing school for industry skills.",
        bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80",
        type: "Private",
        accreditation: "NAAC Grade 'A' | UGC Approved | Maharashtra Govt Recognized",
        ranking: "NAAC A Grade | Top Private University in Maharashtra",
        website: "https://adypu.edu.in",
        students: "6,500+",
        faculty: "320+",
        campusSize: "100 acres",
        feeRange: "₹2.5 - 5.5 LPA",
        fee: 380000,
        globalRanking: 60,
        mastersPrograms: 45,
        scholarships: 40,
        featured: true,
        rating: 4.6,
        programmes: ["engineering", "management", "design", "architecture", "law", "computer", "arts", "sciences"],
        facilities: [
            "100-Acre Scenic Pune Campus",
            "Specialized Innovation & Design Labs",
            "Finishing School for Industry Skills",
            "Apple Mac & Design Studios",
            "State-of-the-Art Sports Complex",
            "Luxury Hostels & Student Residences"
        ],
        placements: {
            percentage: 100,
            averagePackage: "₹13 - 14 LPA",
            highestPackage: "₹45 LPA",
            topRecruiters: ["Tech Mahindra", "Deloitte", "HSBC", "Tata Technologies", "TVS Motors", "HCL", "Cohesity", "Entrata"]
        },
        contactInfo: {
            phone: "+91 98765 43214",
            email: "info@adypu.edu.in",
            address: "Charholi Budruk via Lohegaon, Pune, Maharashtra – 412105"
        },
        address: "Charholi Budruk via Lohegaon, Pune, Maharashtra – 412105"
    },
    {
        name: "Karpaga Vinayaga College of Engineering & Technology",
        location: "Chengalpattu, Chennai, Tamil Nadu",
        state: "tamilnadu",
        established: 2001,
        description: "Karpaga Vinayaga College of Engineering & Technology (est. 2001) is a private engineering college in Chengalpattu (near Chennai), affiliated to Anna University and approved by AICTE. It holds NBA accreditation for its core engineering programs and has NAAC 'A' grade. KVCET offers B.E. degrees in fields such as Computer Science, Electronics, Mechanical, Biomedical, CSE-AI, Biotechnology, and M.E./M.Tech. programs in similar streams.",
        bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80",
        type: "Private",
        accreditation: "NAAC Grade 'A' | NBA Accredited | Anna University Affiliated | AICTE",
        ranking: "NAAC A Grade | NBA Accredited Engineering College",
        website: "https://kvcet.ac.in",
        students: "3,200+",
        faculty: "210+",
        campusSize: "45 acres",
        feeRange: "₹1.2 - 2.8 LPA",
        fee: 180000,
        globalRanking: 160,
        mastersPrograms: 25,
        scholarships: 30,
        featured: true,
        rating: 4.2,
        programmes: ["engineering", "computer", "sciences"],
        facilities: [
            "Modern Lecture Halls & Smart Classrooms",
            "Advanced CSE, AI & Biotech Laboratories",
            "Central Digital Library",
            "Soft-Skills & Career Enhancement Training Center",
            "On-Campus Boys & Girls Hostels",
            "Sports Facilities & Cafeteria"
        ],
        placements: {
            percentage: 95,
            averagePackage: "₹3.1 LPA",
            highestPackage: "₹12 LPA",
            topRecruiters: ["Transvaal Global Tech", "TCS", "Cognizant", "Wipro", "Infosys", "HCL Tech", "Tech Mahindra"]
        },
        contactInfo: {
            phone: "+91 98765 43215",
            email: "info@kvcet.ac.in",
            address: "GST Road, Chinna Kolambakkam, Palayanoor Post, Chengalpattu – 603308, Tamil Nadu"
        },
        address: "GST Road, Chinna Kolambakkam, Palayanoor Post, Chengalpattu – 603308, Tamil Nadu"
    }
];

async function seedUniversities() {
    try {
        console.log('🔄 Seeding MongoDB Atlas databases (test & CollegeSarthi)...');
        const baseUri = 'mongodb+srv://madhavdhavala0_db_user:EGSITZvuJJILWKpw@cluster0.bjmlhzz.mongodb.net';
        const targetDBs = ['test', 'CollegeSarthi'];
        
        for (const dbName of targetDBs) {
            console.log(`\n📡 Connecting to Database: [${dbName}]...`);
            const conn = await mongoose.createConnection(`${baseUri}/${dbName}?retryWrites=true&w=majority`).asPromise();
            const UniModel = conn.model('University', University.schema);
            
            await UniModel.deleteMany({});
            console.log(`🗑️  Cleared existing universities in database [${dbName}]`);
            
            const inserted = [];
            for (const uData of universities) {
                const doc = new UniModel(uData);
                await doc.save();
                inserted.push(doc);
            }
            
            console.log(`✅ Seeded ${inserted.length} universities into database [${dbName}]`);
            inserted.forEach((uni, idx) => {
                console.log(`   ${idx + 1}. ${uni.name} (${uni.location})`);
            });
            
            await conn.close();
        }
        
        console.log('\n🎉 ALL MONGODB ATLAS DATABASES (PRODUCTION & LOCAL) SUCCESSFULLY SEEDED WITH THE 6 UNIVERSITIES!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding databases:', error);
        process.exit(1);
    }
}

seedUniversities();