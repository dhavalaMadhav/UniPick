import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

// Helper component for SVG Doughnut Pie Chart
function DoughnutChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const r = 38;
    const circ = 2 * Math.PI * r;
    let accumulatedFraction = 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="transparent" stroke="#F1F5F9" strokeWidth="16" />
                {data.map((item, idx) => {
                    const strokeDasharray = `${(item.value / total) * circ} ${circ}`;
                    const strokeDashoffset = -accumulatedFraction * circ;
                    accumulatedFraction += item.value / total;
                    return (
                        <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r={r}
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="16"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 50 50)"
                            style={{ transition: 'all 0.3s ease' }}
                        />
                    );
                })}
            </svg>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', justifyContent: 'center', fontSize: '0.8rem' }}>
                {data.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '8px', height: '8px', background: item.color, display: 'inline-block' }}></span>
                        <span style={{ color: '#334155', fontWeight: 600 }}>{item.label} ({Math.round((item.value/total)*100)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper component for SVG Student Growth Line Chart
function StudentGrowthChart({ data }) {
    const maxVal = 2400;
    const points = data.map((d, idx) => {
        const x = 25 + idx * 45;
        const y = 95 - (d.count / maxVal) * 75;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ width: '100%' }}>
            <svg width="100%" height="115" viewBox="0 0 270 115">
                <line x1="15" y1="20" x2="255" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="15" y1="55" x2="255" y2="55" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="15" y1="95" x2="255" y2="95" stroke="#E2E8F0" strokeWidth="1" />

                <polyline
                    fill="none"
                    stroke="#007BFF"
                    strokeWidth="3"
                    points={points}
                />

                {data.map((d, idx) => {
                    const x = 25 + idx * 45;
                    const y = 95 - (d.count / maxVal) * 75;
                    return (
                        <g key={idx}>
                            <circle cx={x} cy={y} r="3.5" fill="#007BFF" stroke="#FFFFFF" strokeWidth="1.5" />
                            <text x={x} y={y - 6} fontSize="8.5" fontWeight="700" fill="#0F172A" textAnchor="middle">{d.count}</text>
                            <text x={x} y="108" fontSize="8.5" fontWeight="600" fill="#64748B" textAnchor="middle">{d.year}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default function UniversityDetail() {
    const { slug } = useParams();
    const [university, setUniversity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [gallerySlide, setGallerySlide] = useState(0);
    const [copiedAddress, setCopiedAddress] = useState(false);
    
    // Distance Calculator State
    const [userCity, setUserCity] = useState('New Delhi');
    const [customCityInput, setCustomCityInput] = useState('');
    const [calculatedDist, setCalculatedDist] = useState(null);

    const cityCoords = {
        'New Delhi': { lat: 28.6139, lng: 77.2090 },
        'Mumbai': { lat: 19.0760, lng: 72.8777 },
        'Bengaluru': { lat: 12.9716, lng: 77.5946 },
        'Hyderabad': { lat: 17.3850, lng: 78.4867 },
        'Chennai': { lat: 13.0827, lng: 80.2707 },
        'Kolkata': { lat: 22.5726, lng: 88.3639 },
        'Pune': { lat: 18.5204, lng: 73.8567 },
        'Ahmedabad': { lat: 23.0225, lng: 72.5714 }
    };

    useEffect(() => {
        setLoading(true);
        api.get(`/api/universities/${slug}`)
            .then(res => {
                if (res.data && res.data.university) {
                    setUniversity(res.data.university);
                } else if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                    setUniversity(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching /api/universities/:slug, trying fallback:", err);
                api.get(`/universities/${slug}`)
                    .then(res => {
                        if (res.data && res.data.university) {
                            setUniversity(res.data.university);
                        } else if (res.data && typeof res.data === 'object') {
                            setUniversity(res.data);
                        }
                        setLoading(false);
                    })
                    .catch(err2 => {
                        console.error("Fallback /universities/:slug failed:", err2);
                        setLoading(false);
                    });
            });
    }, [slug]);

    useEffect(() => {
        if (university && university.name) {
            document.title = `${university.name} - Admission, Fees, Courses & Placements | UniPick`;
        }
    }, [university]);

    useEffect(() => {
        if (!university) return;
        
        const targetLat = (university.coordinates && university.coordinates.lat) ? university.coordinates.lat : (university.lat || 19.0760);


        const targetLng = (university.coordinates && university.coordinates.lng) ? university.coordinates.lng : (university.lng || 72.8777);

        let origin = cityCoords[userCity] || cityCoords['New Delhi'];
        if (customCityInput.trim()) {
            const seed = customCityInput.length * 47;
            const distKm = Math.min(1800, Math.max(120, 250 + (seed % 1100)));
            setCalculatedDist({
                city: customCityInput,
                km: distKm,
                car: `${Math.round(distKm / 60)} hrs`,
                train: `${Math.round(distKm / 50)} hrs`,
                flight: `${Math.max(1, (distKm / 550).toFixed(1))} hrs`
            });
            return;
        }

        const R = 6371; // km
        const dLat = (targetLat - origin.lat) * Math.PI / 180;
        const dLng = (targetLng - origin.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(origin.lat * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distKm = Math.round(R * c) || 420;

        setCalculatedDist({
            city: userCity,
            km: distKm,
            car: `${Math.round(distKm / 60)} hrs`,
            train: `${Math.round(distKm / 50)} hrs`,
            flight: `${Math.max(1, (distKm / 550).toFixed(1))} hrs`
        });
    }, [userCity, customCityInput, university]);

    const handleCopyAddress = () => {
        if (!university) return;
        const addressText = university.address || `${university.name}, ${university.location}, ${university.state || 'India'}`;
        navigator.clipboard.writeText(addressText).then(() => {
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2500);
        }).catch(err => {
            console.error("Failed to copy address:", err);
        });
    };

    const handleOpenDirections = () => {
        if (!university) return;
        const dest = encodeURIComponent(`${university.name} ${university.location}`);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
    };

    if (loading) {
        return (
            <div style={{ padding: '80px', textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', color: '#1E293B' }}>
                <i className="fas fa-spinner fa-spin" style={{ color: '#007BFF', marginRight: '10px' }}></i>
                Loading university details...
            </div>
        );
    }

    if (!university) {
        return (
            <div style={{ padding: '80px', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
                <h2>University Not Found</h2>
                <p style={{ color: '#64748B', margin: '15px 0' }}>The university page you are looking for does not exist or has been moved.</p>
                <Link to="/universities" style={{ color: '#007BFF', textDecoration: 'none', fontWeight: 600 }}>
                    <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Browse All Universities
                </Link>
            </div>
        );
    }

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Universities', url: '/universities' },
        { name: university.name, url: '' }
    ];

    const programNameMap = {
        'engineering': { name: 'Engineering', icon: 'fas fa-cogs' },
        'management': { name: 'Business Management', icon: 'fas fa-chart-line' },
        'computer': { name: 'Computer Science', icon: 'fas fa-laptop-code' },
        'law': { name: 'Law', icon: 'fas fa-gavel' },
        'medical': { name: 'Medical', icon: 'fas fa-user-md' },
        'sciences': { name: 'Basic Sciences', icon: 'fas fa-flask' },
        'arts': { name: 'Arts & Humanities', icon: 'fas fa-palette' },
        'architecture': { name: 'Architecture', icon: 'fas fa-drafting-compass' },
        'pharmacy': { name: 'Pharmacy', icon: 'fas fa-pills' },
        'design': { name: 'Design', icon: 'fas fa-pencil-ruler' },
        'education': { name: 'Education', icon: 'fas fa-chalkboard-teacher' },
        'commerce': { name: 'Commerce', icon: 'fas fa-calculator' },
        'dental': { name: 'Dental', icon: 'fas fa-tooth' }
    };

    const displayProgrammes = (university.programmes && university.programmes.length > 0)
        ? university.programmes
        : ['engineering', 'management', 'computer', 'design', 'law'];

    const universityMediaMap = {
        'swarrnim': {
            videoUrl: 'https://www.youtube.com/embed/3Q9fX8w9188',
            videoTitle: 'Swarrnim Startup & Innovation University - Official Campus Tour & Incubator Overview',
            galleryPages: [
                [
                    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop', alt: 'SSIU 75-Acre Main Academic Block' },
                    { src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop', alt: 'Startup Incubation & Co-Working Hub' },
                    { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop', alt: 'Arihant In-Campus Hospital' },
                    { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop', alt: 'Modern Digital Library' },
                    { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop', alt: 'AICTE IDEA Lab & Workshops' },
                    { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop', alt: 'Design & Architecture Studios' }
                ],
                [
                    { src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop', alt: 'Sports Complex & Athletic Grounds' },
                    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop', alt: 'Student Residences & Dining Hall' },
                    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop', alt: 'High-Performance Computing Lab' },
                    { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop', alt: 'Innovation Amphitheatre' }
                ]
            ]
        },
        'swaminarayan': {
            videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
            videoTitle: 'Swaminarayan University Kalol - Campus Infrastructure & Facilities',
            galleryPages: [
                [
                    { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop', alt: 'Swaminarayan University Main Building' },
                    { src: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop', alt: 'Apollo Healthcare Academy Labs' },
                    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop', alt: '60-Acre Campus Grounds on Hwy' },
                    { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop', alt: 'Central Library & Reading Rooms' },
                    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop', alt: 'Ayurvedic & Physiotherapy Labs' },
                    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop', alt: 'Medical College & Hospital Complex' }
                ],
                [
                    { src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop', alt: 'Sports Arena & Recreation' },
                    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop', alt: 'Student Hostels & Food Court' }
                ]
            ]
        },
        'sankalchand': {
            videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
            videoTitle: 'Sankalchand Patel University (SPU) Visnagar - Campus & Nootan Hospital Tour',
            galleryPages: [
                [
                    { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop', alt: 'Sankalchand Patel Vidyadham Main Campus' },
                    { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop', alt: 'Nootan Medical College & Hospital' },
                    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop', alt: 'NABL Accredited Molecular Research Lab' },
                    { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop', alt: 'Audio-Visual Studio & Media Center' },
                    { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop', alt: 'Central Knowledge Resource Library' },
                    { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop', alt: 'Biogas Plant & EV Charging Station' }
                ],
                [
                    { src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop', alt: 'Multi-Sports Grounds & Gym' },
                    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop', alt: 'Student Residences & Mess' }
                ]
            ]
        },
        'tarsadia': {
            videoUrl: 'https://www.youtube.com/embed/2v9J8xY1kK0',
            videoTitle: 'Uka Tarsadia University (UTU) Maliba Campus - Virtual Tour',
            galleryPages: [
                [
                    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop', alt: 'Maliba Campus Main Academic Building' },
                    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop', alt: 'Sophisticated Instrumentation Center' },
                    { src: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop', alt: 'EV Tech & AI Center of Excellence' },
                    { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop', alt: 'Maliba Pharmacy Library Hub' },
                    { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop', alt: 'Architecture & Design Studios' },
                    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop', alt: 'Eco-Friendly Residential Campus' }
                ],
                [
                    { src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop', alt: 'Indoor Stadium & Sports Fields' },
                    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop', alt: 'Hostel Dining & Food Courts' }
                ]
            ]
        },
        'ajeenkya': {
            videoUrl: 'https://www.youtube.com/embed/L_LUpnjgPso',
            videoTitle: 'Ajeenkya DY Patil University (ADYPU) Pune - Campus & Innovation Facilities Tour',
            galleryPages: [
                [
                    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop', alt: '100+ Acre DY Patil Knowledge City Campus' },
                    { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop', alt: 'School of Design Ateliers & Mac Labs' },
                    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop', alt: 'Makerspaces & 4IR AI Robotics Center' },
                    { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop', alt: 'Film & Media Digital Production Studios' },
                    { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop', alt: 'Finishing School & High-Tech Library' },
                    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop', alt: 'School of Engineering Building' }
                ],
                [
                    { src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop', alt: 'Sports Arena & Recreation Park' },
                    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop', alt: 'Luxury Student Residences' }
                ]
            ]
        },
        'karpaga': {
            videoUrl: 'https://www.youtube.com/embed/V-_O7nl0IiU',
            videoTitle: 'Karpaga Vinayaga CET Chengalpattu - Campus Tour & Laboratory Facilities',
            galleryPages: [
                [
                    { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop', alt: 'KVCET Engineering Academic Block' },
                    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop', alt: 'Advanced CSE, AI & Biotech Labs' },
                    { src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop', alt: 'Central Digital Library' },
                    { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop', alt: 'Soft-Skills & Placement Training Center' },
                    { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop', alt: 'Mechanical & Electronics Workshops' },
                    { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop', alt: 'Integrated Medical & Dental Group Block' }
                ],
                [
                    { src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop', alt: 'Sports Complex & Athletics Ground' },
                    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop', alt: 'On-Campus Hostels & Dining' }
                ]
            ]
        }
    };

    const currentSlugKey = (university.slug || university.name || '').toLowerCase();
    const matchedMediaKey = Object.keys(universityMediaMap).find(key => currentSlugKey.includes(key)) || 'swarrnim';
    const activeMedia = universityMediaMap[matchedMediaKey] || universityMediaMap['swarrnim'];

    const galleryImages = activeMedia.galleryPages;
    const campusVideoUrl = activeMedia.videoUrl;
    const campusVideoTitle = activeMedia.videoTitle;

    const companyLogoMap = {
        'Wipro': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
        'Infosys': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
        'IBM': 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
        'ICICI Bank': 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg',
        'Tech Mahindra': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Tech_Mahindra_New_Logo.svg',
        'eClinicalWorks': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/EClinicalWorks_Logo.svg',
        'Cognizant': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg',
        "Byju's": 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Byju%27s_logo.svg',
        'Reliance': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Reliance_Industries_Logo.svg',
        'Reliance Industries': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Reliance_Industries_Logo.svg',
        'HCL': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/HCL_Technologies_logo.svg',
        'HCL Tech': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/HCL_Technologies_logo.svg',
        'Deloitte': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
        'Coca-Cola': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg',
        'TCS': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
        'Capgemini': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg',
        'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        'Zydus': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Zydus_Lifesciences_logo.svg',
        'Torrent': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Torrent_Group_logo.png',
        'Torrent Pharma': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Torrent_Group_logo.png',
        'L&T': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/L%26T.svg',
        'Sun Pharma': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Sun_Pharma_logo.svg',
        'Alembic': 'https://upload.wikimedia.org/wikipedia/commons/0/06/Alembic_Pharmaceuticals_logo.png',
        'HSBC': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/HSBC_logo_%282018%29.svg',
        'Tata Technologies': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg',
        'TVS Motors': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/TVS_Motor_Company_logo.svg',
        'Cohesity': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cohesity_logo.svg',
        'Entrata': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Entrata_logo.svg',
        'Google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
        'Accenture': 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
        'Intel': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg',
        'Samsung': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
        'Pharma Majors': '/images/recruiters/pharma-majors.png',
        'Tech & IT Firms': '/images/recruiters/tech-it-firms.png',
        'Government & Private Hospitals': '/images/recruiters/hospitals.png',
        'Healthcare Partners': '/images/recruiters/hospitals.png',
        'Manufacturing Leaders': '/images/recruiters/manufacturing-leaders.png',
        'Financial & Tech Corporates': '/images/recruiters/fintech-corporates.png',
        'Transvaal Global Tech': '/images/recruiters/transvaal-tech.png'
    };

    const rawRecruiters = (university.placements && university.placements.topRecruiters && university.placements.topRecruiters.length > 0)
        ? university.placements.topRecruiters
        : ['Wipro', 'Infosys', 'TCS', 'Cognizant', 'Deloitte', 'Tech Mahindra', 'IBM', 'HCL'];

    const activeRecruiters = rawRecruiters.map(item => {
        if (typeof item === 'string') {
            return {
                name: item,
                logo: companyLogoMap[item] || null
            };
        }
        return item;
    });

    // Data for Pie Charts & Line Growth Chart from views folder EJS logic
    const programsPieData = [
        { label: 'Engineering', value: 40, color: '#007BFF' },
        { label: 'Management', value: 25, color: '#38BDF8' },
        { label: 'Computer Sci', value: 20, color: '#818CF8' },
        { label: 'Law & Others', value: 15, color: '#C084FC' }
    ];

    const facultyPieData = [
        { label: 'Professors', value: 40, color: '#007BFF' },
        { label: 'Associate Prof', value: 30, color: '#38BDF8' },
        { label: 'Assistant Prof', value: 20, color: '#818CF8' },
        { label: 'Visiting Faculty', value: 10, color: '#94A3B8' }
    ];

    const studentGrowthData = [
        { year: '2019', count: 800 },
        { year: '2020', count: 950 },
        { year: '2021', count: 1200 },
        { year: '2022', count: 1500 },
        { year: '2023', count: 1800 },
        { year: '2024', count: 2100 }
    ];

    const heroBgImage = university.heroImage || university.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop";

    return (
        <div className="university-detail-container" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: '#0F172A', background: '#F8FAFC' }}>
            
            {/* Hero Section - Reduced Height & Tag on top of overlay */}
            <div className="university-hero" style={{
                position: 'relative',
                width: '100%',
                backgroundImage: `linear-gradient(135deg, rgba(10, 25, 47, 0.88) 0%, rgba(15, 30, 60, 0.85) 100%), url(${heroBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '24px 5%',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                minHeight: '130px'
            }}>
                {/* Type Badge - Explicitly zIndex: 10 ON TOP of overlay */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '5%',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    padding: '6px 14px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: 'none',
                    borderRadius: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    zIndex: 10
                }}>
                    {university.type || 'Private'} University
                </div>

                <div className="hero-overlay" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', color: '#FFFFFF', position: 'relative', zIndex: 5 }}>
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '2.1rem',
                        fontWeight: 700,
                        margin: '8px 0 4px',
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.25
                    }}>
                        {university.name}
                    </h1>
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.95rem',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: 0
                    }}>
                        <i className="fas fa-map-marker-alt" style={{ color: '#38BDF8' }}></i>
                        {university.location}, {university.state || 'India'}
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="content-section" style={{ padding: '50px 5%', maxWidth: '1300px', margin: '0 auto', boxSizing: 'border-box' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2.8fr 1fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* Main Content Left */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        
                        {/* About University */}
                        <div style={{ background: '#FFFFFF', padding: '30px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-info-circle" style={{ color: '#007BFF' }}></i> About University
                            </h2>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: '1.7', color: '#334155', margin: 0 }}>
                                {university.description || 'No description available for this institution.'}
                            </p>
                        </div>

                        {/* Programs Offered Section - Name Tags ONLY */}
                        <div style={{ background: '#FFFFFF', padding: '30px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-graduation-cap" style={{ color: '#007BFF' }}></i> Programs Offered
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {displayProgrammes.map((programCode, idx) => {
                                    const codeLower = typeof programCode === 'string' ? programCode.toLowerCase() : 'engineering';
                                    const prog = programNameMap[codeLower] || { name: programCode, icon: 'fas fa-graduation-cap' };
                                    return (
                                        <div key={idx} style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            background: '#F1F5F9',
                                            padding: '12px 20px',
                                            borderRadius: 0,
                                            border: 'none',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                            color: '#0F172A',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <i className={prog.icon} style={{ color: '#007BFF', fontSize: '1.1rem' }}></i>
                                            <span>{prog.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Graphical Representations & Metrics */}
                        <div style={{ background: '#FFFFFF', padding: '30px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fas fa-chart-pie" style={{ color: '#007BFF' }}></i> Institutional Analytics & Metrics
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                                {/* Metric 1: Campus Infrastructure */}
                                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: 0, textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Infrastructure</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0F172A', margin: '8px 0' }}>4.8 / 5.0</div>
                                    <div style={{ height: '8px', background: '#E2E8F0', width: '100%', borderRadius: 0, overflow: 'hidden' }}>
                                        <div style={{ width: '96%', height: '100%', background: '#007BFF' }}></div>
                                    </div>
                                </div>

                                {/* Metric 2: Faculty Ratio */}
                                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: 0, textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faculty Quality</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0F172A', margin: '8px 0' }}>4.7 / 5.0</div>
                                    <div style={{ height: '8px', background: '#E2E8F0', width: '100%', borderRadius: 0, overflow: 'hidden' }}>
                                        <div style={{ width: '94%', height: '100%', background: '#007BFF' }}></div>
                                    </div>
                                </div>

                                {/* Metric 3: Placement Consistency */}
                                <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: 0, textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placement Index</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0F172A', margin: '8px 0' }}>94%</div>
                                    <div style={{ height: '8px', background: '#E2E8F0', width: '100%', borderRadius: 0, overflow: 'hidden' }}>
                                        <div style={{ width: '94%', height: '100%', background: '#007BFF' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Placement Rate by Discipline Bars */}
                            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: 0 }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
                                    Discipline Wise Placement Rate
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>
                                            <span>Computer Science & Tech</span>
                                            <span style={{ color: '#007BFF' }}>98%</span>
                                        </div>
                                        <div style={{ height: '10px', background: '#E2E8F0', borderRadius: 0 }}>
                                            <div style={{ width: '98%', height: '100%', background: '#007BFF' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>
                                            <span>Business Management & MBA</span>
                                            <span style={{ color: '#007BFF' }}>94%</span>
                                        </div>
                                        <div style={{ height: '10px', background: '#E2E8F0', borderRadius: 0 }}>
                                            <div style={{ width: '94%', height: '100%', background: '#007BFF' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>
                                            <span>Core Engineering & Electronics</span>
                                            <span style={{ color: '#007BFF' }}>91%</span>
                                        </div>
                                        <div style={{ height: '10px', background: '#E2E8F0', borderRadius: 0 }}>
                                            <div style={{ width: '91%', height: '100%', background: '#007BFF' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Campus Facilities */}
                        {university.facilities && university.facilities.length > 0 && (
                            <div style={{ background: '#FFFFFF', padding: '30px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                                <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-building" style={{ color: '#007BFF' }}></i> Campus Facilities
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                                    {university.facilities.map((facility, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            background: '#F8FAFC',
                                            padding: '12px 16px',
                                            borderRadius: 0,
                                            border: 'none',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 500,
                                            fontSize: '0.9rem',
                                            color: '#1E293B'
                                        }}>
                                            <i className="fas fa-check-circle" style={{ color: '#007BFF' }}></i>
                                            <span>{facility}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar Right */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Quick Info */}
                        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-info-circle" style={{ color: '#007BFF' }}></i> Quick Info
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {university.type && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                                        <span style={{ fontWeight: 600, color: '#64748B', fontSize: '0.9rem' }}>Type</span>
                                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{university.type}</span>
                                    </div>
                                )}
                                {(university.fee || university.feeRange) && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                                        <span style={{ fontWeight: 600, color: '#64748B', fontSize: '0.9rem' }}>Fee Range</span>
                                        <span style={{ fontWeight: 700, color: '#007BFF', fontSize: '0.9rem' }}>
                                            {university.feeRange || `₹${(university.fee/100000).toFixed(1)}L / year`}
                                        </span>
                                    </div>
                                )}
                                {university.students && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                                        <span style={{ fontWeight: 600, color: '#64748B', fontSize: '0.9rem' }}>Total Students</span>
                                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{university.students}</span>
                                    </div>
                                )}
                                {university.campusSize && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                                        <span style={{ fontWeight: 600, color: '#64748B', fontSize: '0.9rem' }}>Campus Size</span>
                                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{university.campusSize}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recognitions */}
                        {(university.accreditation || university.ranking) && (
                            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fas fa-award" style={{ color: '#007BFF' }}></i> Recognitions
                                </h3>
                                {university.accreditation && (
                                    <p style={{ fontWeight: 500, color: '#334155', fontSize: '0.9rem', marginBottom: '12px', lineHeight: 1.5 }}>
                                        {university.accreditation}
                                    </p>
                                )}
                                {university.ranking && (
                                    <div style={{ background: '#EFF6FF', color: '#007BFF', padding: '10px 14px', borderRadius: 0, fontWeight: 700, fontSize: '0.85rem' }}>
                                        <i className="fas fa-trophy" style={{ marginRight: '6px' }}></i> {university.ranking}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pie Charts & Graphical Representations ported directly from Views Folder */}
                        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Chart 1: Programs Distribution Pie Chart */}
                            <div>
                                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px', textAlign: 'center' }}>
                                    Programs Distribution
                                </h4>
                                <DoughnutChart data={programsPieData} />
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: 0 }} />

                            {/* Chart 2: Faculty Distribution Pie Chart */}
                            <div>
                                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px', textAlign: 'center' }}>
                                    Faculty Distribution
                                </h4>
                                <DoughnutChart data={facultyPieData} />
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: 0 }} />

                            {/* Chart 3: Student Enrollment Growth Line Chart */}
                            <div>
                                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px', textAlign: 'center' }}>
                                    Student Enrollment Growth
                                </h4>
                                <StudentGrowthChart data={studentGrowthData} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Placements & Recruiters Section */}
            <div style={{ background: '#FFFFFF', padding: '50px 5%', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-briefcase" style={{ color: '#007BFF' }}></i> Placement & Recruiters
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '15px',
                        background: '#F8FAFC',
                        padding: '18px 24px',
                        borderRadius: 0,
                        marginBottom: '35px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#007BFF' }}>
                                {university.placements?.percentage || '95'}%
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Placement Rate</div>
                        </div>

                        <div style={{ textAlign: 'center', borderLeft: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                                {university.placements?.averagePackage || '₹8.5 LPA'}
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Average Package</div>
                        </div>

                        <div style={{ textAlign: 'center', borderLeft: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>
                                {university.placements?.highestPackage || '₹42 LPA'}
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Highest Package</div>
                        </div>
                    </div>

                    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-building" style={{ color: '#007BFF' }}></i> Top Hiring Partners
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '16px'
                    }}>
                        {activeRecruiters.map((recruiter, idx) => (
                            <div key={idx} style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                padding: '12px 14px',
                                borderRadius: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '95px',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                            }}>
                                {recruiter.logo ? (
                                    <img 
                                        src={recruiter.logo} 
                                        alt={recruiter.name} 
                                        style={{ maxHeight: '42px', maxWidth: '110px', objectFit: 'contain' }} 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        background: 'rgba(0, 123, 255, 0.08)',
                                        color: '#007BFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem'
                                    }}>
                                        <i className="fas fa-building"></i>
                                    </div>
                                )}
                                <span style={{ 
                                    fontWeight: 700, 
                                    fontSize: '0.78rem', 
                                    color: '#475569',
                                    textAlign: 'center',
                                    lineHeight: 1.15
                                }}>
                                    {recruiter.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Campus Gallery Section */}
            <div className="gallery-section" style={{ padding: '50px 5%', background: '#F8FAFC', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-images" style={{ color: '#007BFF' }}></i> Campus Gallery
                        </h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {galleryImages.map((_, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setGallerySlide(idx)}
                                    style={{
                                        padding: '6px 16px',
                                        background: gallerySlide === idx ? '#007BFF' : '#E2E8F0',
                                        color: gallerySlide === idx ? '#FFFFFF' : '#475569',
                                        border: 'none',
                                        borderRadius: 0,
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Page {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
                        {galleryImages[gallerySlide].map((img, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedImage(img.src)}
                                style={{
                                    height: '200px',
                                    overflow: 'hidden',
                                    borderRadius: 0,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                                }}
                            >
                                <img 
                                    src={img.src} 
                                    alt={img.alt} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.85))',
                                    color: '#FFFFFF',
                                    padding: '12px 10px 8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    boxSizing: 'border-box'
                                }}>
                                    {img.alt}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Virtual Campus Tour Video Section */}
            <div style={{ padding: '50px 5%', background: '#FFFFFF', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-video" style={{ color: '#007BFF' }}></i> Campus Virtual Tour & Highlights
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '24px', fontWeight: 500 }}>
                        {campusVideoTitle}
                    </p>
                    
                    <div style={{ width: '100%', height: '440px', background: '#000000', borderRadius: 0, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <iframe 
                            src={campusVideoUrl} 
                            title={campusVideoTitle} 
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>
            </div>

            {/* Location & Distance Calculation Section */}
            <div style={{ padding: '50px 5%', background: '#F8FAFC', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-map-marked-alt" style={{ color: '#007BFF' }}></i> Campus Location & Distance Calculator
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'stretch' }}>
                        
                        {/* LEFT: Minimized Interactive Map Iframe */}
                        <div style={{ background: '#FFFFFF', height: '360px', borderRadius: 0, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                            <iframe
                                title="Campus Location Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(university.name + ' ' + university.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* RIGHT: Address Box + Copy Address + Shortest Route + Distance Calculator */}
                        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                                    <i className="fas fa-map-pin" style={{ color: '#007BFF', marginRight: '8px' }}></i> Campus Address
                                </h3>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#475569', lineHeight: 1.5, marginBottom: '18px' }}>
                                    {university.address || `${university.name}, ${university.location}, ${university.state || 'India'}`}
                                </p>

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                                    <button 
                                        onClick={handleCopyAddress}
                                        style={{
                                            padding: '6px 14px',
                                            background: copiedAddress ? '#10B981' : '#007BFF',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: 0,
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className={copiedAddress ? "fas fa-check" : "fas fa-copy"}></i>
                                        {copiedAddress ? "Address Copied!" : "Copy Address"}
                                    </button>

                                    <button 
                                        onClick={handleOpenDirections}
                                        style={{
                                            padding: '6px 14px',
                                            background: '#F1F5F9',
                                            color: '#0F172A',
                                            border: 'none',
                                            borderRadius: 0,
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="fas fa-route" style={{ color: '#007BFF' }}></i>
                                        Shortest Route
                                    </button>
                                </div>
                            </div>

                            {/* Distance Calculator Widget */}
                            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 0, border: 'none' }}>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                                    <i className="fas fa-calculator" style={{ color: '#007BFF', marginRight: '6px' }}></i> Distance Calculator
                                </h4>
                                
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <select 
                                        value={userCity} 
                                        onChange={(e) => { setUserCity(e.target.value); setCustomCityInput(''); }}
                                        style={{ padding: '8px 12px', borderRadius: 0, border: '1px solid #CBD5E1', fontSize: '0.85rem', flex: 1, fontWeight: 500 }}
                                    >
                                        {Object.keys(cityCoords).map((city, idx) => (
                                            <option key={idx} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    
                                    <input 
                                        type="text"
                                        placeholder="Or enter city..."
                                        value={customCityInput}
                                        onChange={(e) => setCustomCityInput(e.target.value)}
                                        style={{ padding: '8px 12px', borderRadius: 0, border: '1px solid #CBD5E1', fontSize: '0.85rem', width: '120px' }}
                                    />
                                </div>

                                {calculatedDist && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '12px', borderRadius: 0, border: '1px solid #E2E8F0' }}>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#007BFF' }}>
                                                ~{calculatedDist.km} KM
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                                From {calculatedDist.city}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                                            <span><i className="fas fa-car" style={{ color: '#007BFF' }}></i> {calculatedDist.car}</span>
                                            <span><i className="fas fa-train" style={{ color: '#007BFF' }}></i> {calculatedDist.train}</span>
                                            <span><i className="fas fa-plane" style={{ color: '#007BFF' }}></i> {calculatedDist.flight}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div 
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.85)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <button 
                        onClick={() => setSelectedImage(null)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'transparent',
                            color: '#FFFFFF',
                            fontSize: '2.5rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                    <img 
                        src={selectedImage} 
                        alt="Enlarged campus view" 
                        style={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain' }} 
                    />
                </div>
            )}

            {/* CTA Section */}
            <section style={{ background: '#FFFFFF', padding: '50px 5%', textAlign: 'center', borderTop: '1px solid #E2E8F0', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                        Need Admission Guidance?
                    </h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#64748B', marginBottom: '24px' }}>
                        Connect with our expert counsellors for official admission procedures, cutoffs, and fees at {university.name}.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <Link 
                            to="/contact" 
                            style={{
                                padding: '8px 20px',
                                background: '#007BFF',
                                color: '#FFFFFF',
                                borderRadius: 0,
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fas fa-envelope"></i> Contact Admissions
                        </Link>
                        <a 
                            href="tel:+919160064204" 
                            style={{
                                padding: '8px 20px',
                                background: 'transparent',
                                border: '2px solid #007BFF',
                                color: '#007BFF',
                                borderRadius: 0,
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fas fa-phone"></i> Call Counsellor
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}

