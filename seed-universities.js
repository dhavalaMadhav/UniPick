require('dotenv').config();
const mongoose = require('mongoose');
const University = require('./models/University');

mongoose.connect(process.env.MONGODB_URI);

const universities = [
    // FEATURED UNIVERSITIES
    {
        name: "Swarnim University",
        location: "Ahmedabad, Gujarat",
        state: "gujarat",
        established: 2020,
        description: "A premier institution focused on innovation and entrepreneurship. Offers cutting-edge programs in various disciplines with strong industry connections.",
        bannerImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved | AICTE",
        ranking: "NIRF Innovation: Top 50",
        website: "https://swarnimuniversity.edu.in",
        students: "4000+",
        faculty: "180+",
        campusSize: "35 acres",
        feeRange: "₹2 - 4.5 LPA",
        fee: 325000,
        globalRanking: 45,
        mastersPrograms: 40,
        scholarships: 35,
        featured: true,
        rating: 4.4,
        programmes: ["engineering", "management", "computer", "design", "law"],
        facilities: [
            "Startup Incubation Center",
            "Innovation Labs",
            "Modern Library",
            "Smart Classrooms",
            "Hostel Facilities",
            "Sports Complex",
            "Cafeteria",
            "Auditorium"
        ],
        placements: {
            percentage: 87,
            averagePackage: "₹5.2 LPA",
            highestPackage: "₹22 LPA",
            topRecruiters: ["Startups", "Tech Companies", "VC Firms", "Corporate"]
        }
    },
    {
        name: "Swaminarayan University",
        location: "Kalol, Gujarat",
        state: "gujarat",
        established: 2017,
        description: "A leading private university offering diverse programs in Engineering, Management, Pharmacy, and more with strong industry connections.",
        bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80",
        type: "Private",
        accreditation: "NAAC A+ | UGC Approved",
        ranking: "NIRF Rank: 150-200",
        website: "https://swaminarayanuniversity.ac.in",
        students: "5200+",
        faculty: "210+",
        campusSize: "55 acres",
        feeRange: "₹1.5 - 3.8 LPA",
        fee: 265000,
        globalRanking: 85,
        mastersPrograms: 35,
        scholarships: 30,
        featured: true,
        rating: 4.3,
        programmes: ["engineering", "management", "pharmacy", "medical", "sciences"],
        facilities: [
            "Modern Library with 50,000+ books",
            "State-of-the-art Computer Labs",
            "Sports Complex & Gymnasium",
            "Separate Boys & Girls Hostels",
            "24/7 Medical Facility",
            "Wi-Fi Enabled Campus",
            "Cafeteria & Food Court",
            "Auditorium (1000+ capacity)"
        ],
        placements: {
            percentage: 90,
            averagePackage: "₹4.8 LPA",
            highestPackage: "₹20 LPA",
            topRecruiters: ["TCS", "Infosys", "Wipro", "Capgemini", "Cognizant", "Amazon"]
        }
    },
    {
        name: "Sanjay Ghodawat University",
        location: "Kolhapur, Maharashtra",
        state: "maharashtra",
        established: 2017,
        description: "A modern university offering innovative programs in Engineering, Management, and Sciences with emphasis on practical learning and research.",
        bannerImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved | AICTE",
        ranking: "NIRF Rank: 180-220",
        website: "https://sanjayghodawatuniversity.ac.in",
        students: "5000+",
        faculty: "220+",
        campusSize: "65 acres",
        feeRange: "₹1.5 - 4 LPA",
        fee: 275000,
        globalRanking: 175,
        mastersPrograms: 38,
        scholarships: 32,
        featured: true,
        rating: 4.3,
        programmes: ["engineering", "management", "computer", "sciences", "commerce", "design"],
        facilities: [
            "State-of-the-art Laboratories",
            "Modern Library",
            "Hostel Facilities",
            "Sports Complex",
            "Auditorium",
            "Cafeteria",
            "Medical Center",
            "Research Centers"
        ],
        placements: {
            percentage: 88,
            averagePackage: "₹4.8 LPA",
            highestPackage: "₹20 LPA",
            topRecruiters: ["Sanjay Ghodawat Group", "TCS", "Wipro", "Capgemini", "Accenture", "IBM"]
        }
    },
    // NON-FEATURED UNIVERSITIES
    {
        name: "Gokul Global University",
        location: "Siddhpur, Gujarat",
        state: "gujarat",
        established: 2018,
        description: "A comprehensive university offering programs in multiple disciplines with focus on holistic development and global standards.",
        bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved | PCI",
        ranking: "NIRF Rank: 250-300",
        website: "https://gokulglobaluniversity.ac.in",
        students: "4500+",
        faculty: "190+",
        campusSize: "45 acres",
        feeRange: "₹1.2 - 3.2 LPA",
        fee: 220000,
        globalRanking: 152,
        mastersPrograms: 32,
        scholarships: 28,
        featured: false,
        rating: 4.1,
        programmes: ["engineering", "management", "computer", "arts", "education", "commerce"],
        facilities: [
            "Digital Library",
            "Computer Center",
            "Seminar Halls",
            "Hostel Accommodation",
            "Medical Center",
            "Sports Ground",
            "Cafeteria",
            "Transport Facility"
        ],
        placements: {
            percentage: 82,
            averagePackage: "₹4.0 LPA",
            highestPackage: "₹15 LPA",
            topRecruiters: ["Local Industries", "Educational Institutions", "Service Sector", "IT Companies"]
        }
    },
    {
        name: "Sandip University",
        location: "Nashik, Maharashtra",
        state: "maharashtra",
        established: 2016,
        description: "A premier institution in Maharashtra offering quality education in Engineering, Management, and Applied Sciences with modern infrastructure.",
        bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&q=80",
        type: "Private",
        accreditation: "NAAC B+ | UGC Approved",
        ranking: "NIRF Rank: 200-250",
        website: "https://sandipuniversity.edu.in",
        students: "6500+",
        faculty: "270+",
        campusSize: "80 acres",
        feeRange: "₹1.8 - 4.5 LPA",
        fee: 315000,
        globalRanking: 195,
        mastersPrograms: 42,
        scholarships: 35,
        featured: false,
        rating: 4.2,
        programmes: ["engineering", "management", "computer", "law", "pharmacy", "architecture"],
        facilities: [
            "Modern Campus",
            "Research Facilities",
            "Library with E-Resources",
            "Hostel with AC/Non-AC options",
            "Sports Complex",
            "Medical Center",
            "Auditorium",
            "Placement Cell"
        ],
        placements: {
            percentage: 85,
            averagePackage: "₹4.5 LPA",
            highestPackage: "₹18 LPA",
            topRecruiters: ["Tech Mahindra", "Persistent", "Zensar", "L&T", "KPIT", "Infosys"]
        }
    },
    {
        name: "Marwadi University",
        location: "Rajkot, Gujarat",
        state: "gujarat",
        established: 2016,
        description: "A dynamic university known for its excellent academic standards, industry partnerships, and placement records.",
        bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&q=80",
        type: "Private",
        accreditation: "NAAC A | UGC Approved",
        ranking: "NIRF Rank: 140-160",
        website: "https://marwadiuniversity.ac.in",
        students: "6500+",
        faculty: "280+",
        campusSize: "55 acres",
        feeRange: "₹2.2 - 4.5 LPA",
        fee: 335000,
        globalRanking: 142,
        mastersPrograms: 40,
        scholarships: 35,
        featured: false,
        rating: 4.2,
        programmes: ["engineering", "management", "computer", "sciences", "commerce"],
        facilities: [
            "Modern Campus",
            "Advanced Laboratories",
            "Digital Library",
            "Hostel Facilities",
            "Sports Complex",
            "Cafeteria",
            "Medical Center",
            "Auditorium"
        ],
        placements: {
            percentage: 85,
            averagePackage: "₹4.5 LPA",
            highestPackage: "₹18 LPA",
            topRecruiters: ["TCS", "Infosys", "Capgemini", "Cognizant", "L&T", "Reliance"]
        }
    },
    {
        name: "Sanskriti University",
        location: "Mathura, Uttar Pradesh",
        state: "uttar pradesh",
        established: 2016,
        description: "A comprehensive university offering diverse programs with modern infrastructure and emphasis on holistic development.",
        bannerImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80",
        type: "Private",
        accreditation: "UGC Approved | AICTE",
        ranking: "NIRF Rank: 300-350",
        website: "https://sanskriti.edu.in",
        students: "3500+",
        faculty: "150+",
        campusSize: "40 acres",
        feeRange: "₹1 - 2.5 LPA",
        fee: 175000,
        globalRanking: 210,
        mastersPrograms: 25,
        scholarships: 20,
        featured: false,
        rating: 3.9,
        programmes: ["engineering", "management", "arts", "commerce", "education", "pharmacy"],
        facilities: [
            "Modern Classrooms",
            "Library",
            "Hostel Facilities",
            "Sports Ground",
            "Medical Center",
            "Computer Labs",
            "Auditorium",
            "Cafeteria"
        ],
        placements: {
            percentage: 75,
            averagePackage: "₹3.5 LPA",
            highestPackage: "₹10 LPA",
            topRecruiters: ["Local Industries", "Educational Sector", "Service Companies"]
        }
    },
    // ADDITIONAL NON-FEATURED UNIVERSITIES
    {
        name: "RK University",
        location: "Rajkot, Gujarat",
        state: "gujarat",
        established: 2011,
        description: "One of Gujarat's leading universities with focus on professional education, research, and innovation across multiple disciplines.",
        bannerImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&q=80",
        type: "Private",
        accreditation: "NAAC A | UGC Approved",
        ranking: "NIRF Rank: 120-150",
        website: "https://rku.ac.in",
        students: "7000+",
        faculty: "300+",
        campusSize: "60 acres",
        feeRange: "₹2 - 5 LPA",
        fee: 350000,
        globalRanking: 125,
        mastersPrograms: 42,
        scholarships: 40,
        featured: false,
        rating: 4.3,
        programmes: ["engineering", "management", "computer", "pharmacy", "medical"],
        facilities: [
            "State-of-the-art Laboratories",
            "Central Library",
            "Hostel Facilities",
            "Sports Complex",
            "Auditorium",
            "Cafeteria",
            "Medical Center",
            "Transport Services"
        ],
        placements: {
            percentage: 88,
            averagePackage: "₹4.8 LPA",
            highestPackage: "₹20 LPA",
            topRecruiters: ["Reliance", "Adani", "Tata", "IBM", "Accenture", "Wipro"]
        }
    },
    {
        name: "JK Lakshmipat University",
        location: "Jaipur, Rajasthan",
        state: "rajasthan",
        established: 2011,
        description: "A premier university in Rajasthan offering industry-aligned programs with strong focus on research and innovation.",
        bannerImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80",
        type: "Private",
        accreditation: "NAAC A+ | UGC Approved",
        ranking: "NIRF Rank: 80-100",
        website: "https://jklu.edu.in",
        students: "5500+",
        faculty: "220+",
        campusSize: "30 acres",
        feeRange: "₹2.5 - 6 LPA",
        fee: 425000,
        globalRanking: 95,
        mastersPrograms: 36,
        scholarships: 32,
        featured: false,
        rating: 4.4,
        programmes: ["engineering", "management", "computer", "design", "architecture"],
        facilities: [
            "Modern Infrastructure",
            "Research Centers",
            "Library with Digital Access",
            "Hostel Accommodation",
            "Sports Facilities",
            "Cafeteria",
            "Medical Center",
            "Placement Cell"
        ],
        placements: {
            percentage: 90,
            averagePackage: "₹5.2 LPA",
            highestPackage: "₹22 LPA",
            topRecruiters: ["Amazon", "Microsoft", "Deloitte", "KPMG", "EY", "PwC"]
        }
    }
];

async function seedUniversities() {
    try {
        console.log('🔄 Seeding process started...');
        
        // Clear ALL existing universities
        await University.deleteMany({});
        console.log('🗑️  Removed all existing universities');
        
        // Insert new universities with individual save calls to trigger pre-save slugification
        const universityDocs = universities.map(u => new University(u));
        const inserted = [];
        for (const doc of universityDocs) {
            await doc.save();
            inserted.push(doc);
        }
        
        // Count featured vs non-featured
        const featuredCount = universities.filter(u => u.featured).length;
        const nonFeaturedCount = universities.length - featuredCount;
        
        console.log('✅ Universities seeded successfully!');
        console.log(`📊 Total universities added: ${inserted.length}`);
        console.log(`⭐ Featured universities: ${featuredCount}`);
        console.log(`📝 Non-featured universities: ${nonFeaturedCount}`);
        
        console.log('\n🎯 Featured Universities:');
        universities.filter(u => u.featured).forEach((uni, index) => {
            console.log(`${index + 1}. ${uni.name} - ${uni.location}`);
        });
        
        console.log('\n📚 All Universities:');
        universities.forEach((uni, index) => {
            console.log(`${index + 1}. ${uni.name}${uni.featured ? ' ⭐' : ''}`);
        });
        
        console.log('\n🌐 You can now access:');
        console.log('   - Universities page: http://localhost:3000/universities');
        console.log('   - Homepage: http://localhost:3000/');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding universities:', error);
        console.log('💡 Tip: Make sure MongoDB is running and connection string is correct');
        process.exit(1);
    }
}

seedUniversities();