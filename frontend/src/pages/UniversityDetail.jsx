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
        'Tech Mahindra': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="55" viewBox="0 0 180 55"><path d="M12 10 L28 10 L28 40 L20 40 L20 22 L12 22 Z M24 10 L40 10 L40 22 L24 22 Z" fill="%23E2231A"/><text x="10" y="36" font-family="'Inter', Arial, sans-serif" font-size="18" font-weight="900" fill="%23E2231A">Tech</text><text x="60" y="36" font-family="'Inter', Arial, sans-serif" font-size="18" font-weight="900" fill="%23333333">Mahindra</text></svg>`,
        'Deloitte': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><text x="10" y="34" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="28" font-weight="900" fill="%23000000" letter-spacing="-0.5">Deloitte<tspan fill="%2386BC25">.</tspan></text></svg>`,
        'HSBC': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><polygon points="10,25 25,12 25,38" fill="%23DB0011"/><polygon points="40,25 25,12 25,38" fill="%23DB0011"/><polygon points="25,12 10,25 40,25" fill="%23FFFFFF"/><polygon points="25,38 10,25 40,25" fill="%23FFFFFF"/><text x="48" y="33" font-family="'Arial', sans-serif" font-size="22" font-weight="900" fill="%23000000">HSBC</text></svg>`,
        'Tata Technologies': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><path d="M25 10 C15 10 10 18 10 25 C10 32 15 40 25 40 C35 40 40 32 40 25 C40 18 35 10 25 10 Z M25 14 L25 36 M18 18 L32 18" fill="none" stroke="%231C3F94" stroke-width="4"/><text x="50" y="33" font-family="'Arial', sans-serif" font-size="20" font-weight="bold" fill="%231C3F94">TATA</text></svg>`,
        'Tata Motors': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><path d="M25 10 C15 10 10 18 10 25 C10 32 15 40 25 40 C35 40 40 32 40 25 C40 18 35 10 25 10 Z M25 14 L25 36 M18 18 L32 18" fill="none" stroke="%231C3F94" stroke-width="4"/><text x="50" y="33" font-family="'Arial', sans-serif" font-size="20" font-weight="bold" fill="%231C3F94">TATA</text></svg>`,
        'Tata Projects': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><path d="M25 10 C15 10 10 18 10 25 C10 32 15 40 25 40 C35 40 40 32 40 25 C40 18 35 10 25 10 Z M25 14 L25 36 M18 18 L32 18" fill="none" stroke="%231C3F94" stroke-width="4"/><text x="50" y="33" font-family="'Arial', sans-serif" font-size="20" font-weight="bold" fill="%231C3F94">TATA</text></svg>`,
        'Tata Power': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><path d="M25 10 C15 10 10 18 10 25 C10 32 15 40 25 40 C35 40 40 32 40 25 C40 18 35 10 25 10 Z M25 14 L25 36 M18 18 L32 18" fill="none" stroke="%231C3F94" stroke-width="4"/><text x="50" y="33" font-family="'Arial', sans-serif" font-size="20" font-weight="bold" fill="%231C3F94">TATA</text></svg>`,
        'TVS Motors': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><path d="M10 14 L26 36 L42 14" fill="none" stroke="%23D32F2F" stroke-width="4"/><text x="46" y="34" font-family="'Impact', Arial, sans-serif" font-size="24" font-style="italic" fill="%231976D2">TVS</text><text x="96" y="34" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="%23333">MOTOR</text></svg>`,
        'HCL': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="35" font-family="'Arial Black', sans-serif" font-size="32" font-weight="900" fill="%2300549E" letter-spacing="1">HCL</text></svg>`,
        'HCL Tech': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="35" font-family="'Arial Black', sans-serif" font-size="32" font-weight="900" fill="%2300549E" letter-spacing="1">HCL</text></svg>`,
        'Cohesity': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><circle cx="20" cy="25" r="10" fill="none" stroke="%234FA83D" stroke-width="4.5"/><text x="38" y="32" font-family="'Inter', sans-serif" font-size="19" font-weight="800" fill="%232D3748" letter-spacing="1">COHESITY</text></svg>`,
        'Entrata': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><rect x="10" y="14" width="18" height="22" rx="3" fill="%23E53E3E"/><text x="36" y="32" font-family="'Inter', sans-serif" font-size="22" font-weight="700" fill="%231A202C">entrata</text></svg>`,
        'Wipro': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><circle cx="16" cy="22" r="4" fill="%23E53E3E"/><circle cx="24" cy="16" r="3.5" fill="%23D69E2E"/><circle cx="28" cy="27" r="4" fill="%2338A169"/><circle cx="18" cy="32" r="3.5" fill="%233182CE"/><text x="38" y="33" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="%231A202C">wipro</text></svg>`,
        'Infosys': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><text x="10" y="34" font-family="'Trebuchet MS', Arial, sans-serif" font-size="28" font-weight="bold" fill="%23007CC3">Infosys</text></svg>`,
        'IBM': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="50" viewBox="0 0 130 50"><text x="10" y="35" font-family="'Arial Black', sans-serif" font-size="32" font-weight="900" fill="%23052FAD" letter-spacing="3">IBM</text></svg>`,
        'ICICI Bank': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><path d="M12 15 L22 35 L32 15" fill="none" stroke="%23F37021" stroke-width="5"/><text x="38" y="32" font-family="'Arial', sans-serif" font-size="20" font-weight="bold" fill="%23004A8F">ICICI Bank</text></svg>`,
        'Cognizant': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="33" font-family="'Inter', sans-serif" font-size="22" font-weight="800" fill="%23000066">Cognizant</text></svg>`,
        "Byju's": `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><rect x="10" y="12" width="26" height="26" rx="6" fill="%23813588"/><text x="44" y="33" font-family="'Arial', sans-serif" font-size="22" font-weight="900" fill="%23813588">BYJU'S</text></svg>`,
        'Reliance': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><rect x="10" y="14" width="22" height="22" fill="%23E31837"/><text x="38" y="32" font-family="'Georgia', serif" font-size="20" font-weight="bold" fill="%23003366">Reliance</text></svg>`,
        'Reliance Industries': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><rect x="10" y="14" width="22" height="22" fill="%23E31837"/><text x="38" y="32" font-family="'Georgia', serif" font-size="20" font-weight="bold" fill="%23003366">Reliance</text></svg>`,
        'Coca-Cola': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="34" font-family="'Brush Script MT', cursive, sans-serif" font-size="28" font-weight="bold" fill="%23F40009">Coca-Cola</text></svg>`,
        'TCS': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="34" font-family="'Arial', sans-serif" font-size="28" font-weight="900" fill="%231C3F94" letter-spacing="1">TCS</text></svg>`,
        'Capgemini': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><path d="M20 15 C15 20 15 30 25 35 C35 30 35 20 30 15 Z" fill="%230070AD"/><text x="40" y="32" font-family="'Inter', sans-serif" font-size="20" font-weight="600" fill="%230070AD">Capgemini</text></svg>`,
        'Amazon': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><text x="10" y="30" font-family="'Arial', sans-serif" font-size="24" font-weight="bold" fill="%23232F3E">amazon</text><path d="M12 36 Q45 46 85 36" fill="none" stroke="%23FF9900" stroke-width="3"/></svg>`,
        'Zydus': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="33" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="%2300843D">zydus</text></svg>`,
        'Torrent': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><polygon points="10,35 25,12 40,35" fill="%2300A859"/><text x="48" y="32" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%23005A9C">torrent</text></svg>`,
        'Torrent Pharma': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><polygon points="10,35 25,12 40,35" fill="%2300A859"/><text x="48" y="32" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%23005A9C">torrent</text></svg>`,
        'L&T': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><rect x="10" y="10" width="120" height="30" fill="%2300549E"/><text x="70" y="31" dominant-baseline="middle" text-anchor="middle" font-family="'Arial Black', sans-serif" font-size="20" font-weight="900" fill="%23FFFFFF">L&amp;T</text></svg>`,
        'Sun Pharma': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><circle cx="22" cy="25" r="10" fill="%23FF6600"/><text x="40" y="31" font-family="'Arial', sans-serif" font-size="18" font-weight="bold" fill="%23333333">SUN PHARMA</text></svg>`,
        'Alembic': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><text x="10" y="32" font-family="'Georgia', serif" font-size="22" font-weight="bold" fill="%23004B87">Alembic</text></svg>`,
        'eClinicalWorks': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50" viewBox="0 0 180 50"><text x="10" y="32" font-family="'Inter', sans-serif" font-size="18" font-weight="800" fill="%23005B94">eClinicalWorks</text></svg>`,
        'Google': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="34" font-family="'Product Sans', Arial, sans-serif" font-size="26" font-weight="bold"><tspan fill="%234285F4">G</tspan><tspan fill="%23EA4335">o</tspan><tspan fill="%23FBBC05">o</tspan><tspan fill="%234285F4">g</tspan><tspan fill="%2334A853">l</tspan><tspan fill="%23EA4335">e</tspan></text></svg>`,
        'Microsoft': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><rect x="10" y="14" width="10" height="10" fill="%23F25022"/><rect x="22" y="14" width="10" height="10" fill="%237FBA00"/><rect x="10" y="26" width="10" height="10" fill="%2300A4EF"/><rect x="22" y="26" width="10" height="10" fill="%23FFB900"/><text x="40" y="31" font-family="'Segoe UI', sans-serif" font-size="20" font-weight="600" fill="%23737373">Microsoft</text></svg>`,
        'Accenture': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><text x="10" y="32" font-family="'Inter', sans-serif" font-size="22" font-weight="700" fill="%23000000">accenture<tspan fill="%23A100FF" font-size="26">></tspan></text></svg>`,
        'Intel': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="50" viewBox="0 0 130 50"><text x="10" y="34" font-family="'Inter', sans-serif" font-size="28" font-weight="800" fill="%230068B5">intel</text></svg>`,
        'Samsung': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><ellipse cx="80" cy="25" rx="70" ry="18" fill="%23034EA2"/><text x="80" y="31" dominant-baseline="middle" text-anchor="middle" font-family="'Arial', sans-serif" font-size="18" font-weight="bold" fill="%23FFFFFF" letter-spacing="2">SAMSUNG</text></svg>`,
        'Mahindra': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><path d="M10 25 L25 15 L40 25 L25 35 Z" fill="%23E2231A"/><text x="48" y="32" font-family="'Arial', sans-serif" font-size="18" font-weight="bold" fill="%23E2231A">Mahindra</text></svg>`,
        'Bosch': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><circle cx="20" cy="25" r="12" fill="none" stroke="%23EA1D25" stroke-width="4"/><text x="40" y="33" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%231D1D1B">BOSCH</text></svg>`,
        'Siemens': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><text x="10" y="33" font-family="'Arial', sans-serif" font-size="24" font-weight="bold" fill="%23009999" letter-spacing="2">SIEMENS</text></svg>`,
        'Ashok Leyland': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50" viewBox="0 0 180 50"><polygon points="10,35 25,15 40,35" fill="%23003399"/><text x="45" y="32" font-family="'Arial', sans-serif" font-size="16" font-weight="bold" fill="%23003399">ASHOK LEYLAND</text></svg>`,
        'DLF': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="50" viewBox="0 0 130 50"><rect x="10" y="12" width="24" height="26" fill="%23003366"/><text x="42" y="34" font-family="'Arial', sans-serif" font-size="26" font-weight="900" fill="%23003366">DLF</text></svg>`,
        'NTPC': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="34" font-family="'Arial', sans-serif" font-size="26" font-weight="900" fill="%23004B87" letter-spacing="1">NTPC</text></svg>`,
        'Power Grid': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><path d="M15 15 L25 35 L35 15" stroke="%230072CE" stroke-width="4" fill="none"/><text x="40" y="32" font-family="'Arial', sans-serif" font-size="16" font-weight="bold" fill="%230072CE">POWERGRID</text></svg>`,
        'Qualcomm': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="33" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%233253DC">Qualcomm</text></svg>`,
        'Texas Instruments': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50" viewBox="0 0 180 50"><polygon points="10,35 25,15 40,35" fill="%23CC0000"/><text x="45" y="32" font-family="'Arial', sans-serif" font-size="16" font-weight="bold" fill="%23CC0000">TEXAS INSTRUMENTS</text></svg>`,
        'Broadcom': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="33" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%23CC092F">BROADCOM</text></svg>`,
        'Analog Devices': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50" viewBox="0 0 180 50"><polygon points="10,35 25,15 40,35" fill="%23000000"/><text x="45" y="32" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" fill="%23000000">ANALOG DEVICES</text></svg>`,
        'McKinsey': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="32" font-family="'Georgia', serif" font-size="20" font-weight="bold" fill="%23051C2C">McKinsey&amp;Company</text></svg>`,
        'BCG': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="33" font-family="'Arial', sans-serif" font-size="26" font-weight="bold" fill="%2300805B">BCG</text></svg>`,
        'Bain': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="32" font-family="'Arial', sans-serif" font-size="20" font-weight="bold" fill="%23CC0000">BAIN &amp; COMPANY</text></svg>`,
        'Goldman Sachs': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><rect x="10" y="10" width="150" height="30" fill="%237399C6"/><text x="85" y="29" dominant-baseline="middle" text-anchor="middle" font-family="'Georgia', serif" font-size="13" font-weight="bold" fill="%23FFFFFF">Goldman Sachs</text></svg>`,
        'KPMG': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="34" font-family="'Arial', sans-serif" font-size="26" font-weight="900" fill="%2300338D" letter-spacing="1">KPMG</text></svg>`,
        'HDFC Bank': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><rect x="10" y="12" width="24" height="24" fill="%23004B87"/><rect x="16" y="18" width="12" height="12" fill="%23ED1C24"/><text x="40" y="31" font-family="'Arial', sans-serif" font-size="18" font-weight="bold" fill="%23004B87">HDFC BANK</text></svg>`,
        'Morgan Stanley': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50" viewBox="0 0 180 50"><text x="10" y="32" font-family="'Georgia', serif" font-size="18" font-weight="bold" fill="%23000000">Morgan Stanley</text></svg>`,
        'JP Morgan': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="32" font-family="'Georgia', serif" font-size="20" font-weight="bold" fill="%23111111">J.P. Morgan</text></svg>`,
        'Axis Bank': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><polygon points="10,35 22,12 34,35" fill="%2397144D"/><text x="40" y="32" font-family="'Arial', sans-serif" font-size="18" font-weight="bold" fill="%2397144D">AXIS BANK</text></svg>`,
        'Unilever': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><text x="10" y="34" font-family="'Arial', sans-serif" font-size="24" font-weight="bold" fill="%231F3683">Unilever</text></svg>`,
        'P&G': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="50" viewBox="0 0 130 50"><text x="10" y="34" font-family="'Arial', sans-serif" font-size="28" font-weight="900" fill="%2300205B">P&amp;G</text></svg>`,
        'Flipkart': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><rect x="10" y="12" width="24" height="24" rx="4" fill="%232874F0"/><text x="40" y="31" font-family="'Inter', sans-serif" font-size="20" font-style="italic" font-weight="bold" fill="%232874F0">Flipkart</text></svg>`,
        'Facebook': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><circle cx="25" cy="25" r="14" fill="%231877F2"/><text x="21" y="32" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%23FFFFFF">f</text><text x="46" y="32" font-family="'Inter', sans-serif" font-size="20" font-weight="bold" fill="%231877F2">facebook</text></svg>`,
        'ISRO': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><polygon points="20,10 10,38 30,38" fill="%23F37023"/><text x="38" y="32" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%23005A9C">ISRO</text></svg>`,
        'DRDO': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><circle cx="22" cy="25" r="12" fill="%23003366"/><text x="40" y="32" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%23003366">DRDO</text></svg>`,
        'Cipla': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="33" font-family="'Arial', sans-serif" font-size="26" font-weight="bold" fill="%2300549E">Cipla</text></svg>`,
        'Dr. Reddy\'s': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="170" height="50" viewBox="0 0 170 50"><text x="10" y="32" font-family="'Georgia', serif" font-size="20" font-weight="bold" fill="%235C2D91">Dr.Reddy's</text></svg>`,
        'Lupin': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><text x="10" y="33" font-family="'Arial', sans-serif" font-size="24" font-weight="bold" fill="%2300843D">LUPIN</text></svg>`,
        'Pfizer': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><ellipse cx="70" cy="25" rx="60" ry="18" fill="%23000099"/><text x="70" y="31" dominant-baseline="middle" text-anchor="middle" font-family="'Georgia', serif" font-size="20" font-weight="bold" font-style="italic" fill="%23FFFFFF">Pfizer</text></svg>`,
        'GlaxoSmithKline': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50"><text x="10" y="34" font-family="'Arial', sans-serif" font-size="26" font-weight="900" fill="%23F36633">GSK</text></svg>`,
        'SBI': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><circle cx="22" cy="25" r="12" fill="%232800A0"/><circle cx="22" cy="21" r="5" fill="%23FFFFFF"/><rect x="20" y="21" width="4" height="12" fill="%23FFFFFF"/><text x="40" y="32" font-family="'Arial', sans-serif" font-size="22" font-weight="bold" fill="%232800A0">SBI</text></svg>`,
        'Kotak Mahindra': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50" viewBox="0 0 180 50"><rect x="10" y="12" width="24" height="24" fill="%23ED1C24"/><text x="40" y="31" font-family="'Arial', sans-serif" font-size="18" font-weight="bold" fill="%23002B5E">kotak</text></svg>`,
        'Yes Bank': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50"><text x="10" y="32" font-family="'Arial', sans-serif" font-size="20" font-weight="bold" fill="%23005A9C">YES BANK</text></svg>`,
        'Pharma Majors': '/images/recruiters/pharma-majors.png',
        'Tech & IT Firms': '/images/recruiters/tech-it-firms.png',
        'Government & Private Hospitals': '/images/recruiters/hospitals.png',
        'Healthcare Partners': '/images/recruiters/hospitals.png',
        'Hospitals': '/images/recruiters/hospitals.png',
        'Manufacturing Leaders': '/images/recruiters/manufacturing-leaders.png',
        'Financial & Tech Corporates': '/images/recruiters/fintech-corporates.png',
        'Transvaal Global Tech': '/images/recruiters/transvaal-tech.png',
        'Corporate Firms': '/images/recruiters/fintech-corporates.png',
        'MNCs': '/images/recruiters/tech-it-firms.png',
        'Consulting Firms': '/images/recruiters/fintech-corporates.png',
        'Banks': '/images/recruiters/fintech-corporates.png',
        'Big 4 Firms': '/images/recruiters/fintech-corporates.png',
        'Audit Firms': '/images/recruiters/fintech-corporates.png',
        'Financial Institutions': '/images/recruiters/fintech-corporates.png'
    };

    const getCompanyLogo = (item) => {
        if (!item) return null;
        if (typeof item === 'object' && item.logo) return item.logo;
        const name = (typeof item === 'string' ? item : item.name || '').trim();
        if (!name) return null;

        if (companyLogoMap[name]) return companyLogoMap[name];

        const lower = name.toLowerCase();
        const foundKey = Object.keys(companyLogoMap).find(k => k.toLowerCase() === lower);
        if (foundKey) return companyLogoMap[foundKey];

        const partialKey = Object.keys(companyLogoMap).find(k => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower));
        if (partialKey) return companyLogoMap[partialKey];

        return null;
    };

    const rawRecruiters = (university.placements && university.placements.topRecruiters && university.placements.topRecruiters.length > 0)
        ? university.placements.topRecruiters
        : ['Wipro', 'Infosys', 'TCS', 'Cognizant', 'Deloitte', 'Tech Mahindra', 'IBM', 'HCL'];

    const activeRecruiters = rawRecruiters.map(item => {
        if (typeof item === 'string') {
            return {
                name: item,
                logo: getCompanyLogo(item)
            };
        }
        return {
            ...item,
            logo: item.logo || getCompanyLogo(item.name)
        };
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
            <div className="hero-type-badge" style={{
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
            <div className="univ-detail-grid" style={{ display: 'grid', gridTemplateColumns: '2.8fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Main Content Left */}
                <div className="univ-detail-left" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
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

                    {/* Graphical Representations & Metrics - Hiddem on Mobile */}
                    <div className="analytics-section" style={{ background: '#FFFFFF', padding: '30px', borderRadius: 0, border: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
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
                    <div className="univ-detail-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
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
                        {activeRecruiters.map((recruiter, idx) => {
                            const name = recruiter.name || 'Company';
                            const initials = name
                                .split(' ')
                                .map(w => w[0])
                                .filter(Boolean)
                                .join('')
                                .slice(0, 3)
                                .toUpperCase();
                            const fallbackSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
                                `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50">
                                    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#002B5E" font-family="'Inter', Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="-0.5">${name}</text>
                                </svg>`
                            )}`;
                            const logoSrc = recruiter.logo || getCompanyLogo(name) || fallbackSvg;

                            return (
                                <div key={idx} style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    padding: '14px 16px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '85px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                                }}>
                                    <img 
                                        src={logoSrc} 
                                        alt={name} 
                                        title={name}
                                        style={{ maxHeight: '55px', maxWidth: '120px', width: 'auto', height: 'auto', objectFit: 'contain' }} 
                                        onError={(e) => {
                                            e.target.src = fallbackSvg;
                                        }}
                                    />
                                </div>
                            );
                        })}
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

                    <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
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
                    
                    <div className="video-tour-container" style={{ width: '100%', height: '440px', background: '#000000', borderRadius: 0, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
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

                    <div className="location-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'stretch' }}>
                        
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
                    <div className="cta-button-group" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <Link 
                            to="/contact" 
                            style={{
                                padding: '12px 24px',
                                background: '#007BFF',
                                color: '#FFFFFF',
                                borderRadius: 0,
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                minWidth: '180px'
                            }}
                        >
                            <i className="fas fa-envelope"></i> Contact Admissions
                        </Link>
                        <a 
                            href="tel:+919160064204" 
                            style={{
                                padding: '12px 24px',
                                background: 'transparent',
                                border: '2px solid #007BFF',
                                color: '#007BFF',
                                borderRadius: 0,
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                minWidth: '180px'
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
