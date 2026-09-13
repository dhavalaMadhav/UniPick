import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CourseDetail() {
    const { category, slug } = useParams();
    const [course, setCourse] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchUrl = category ? `/courses/${category}/${slug || category}` : `/courses/${slug}`;
        
        api.get(fetchUrl)
            .then(res => {
                if (res.data && res.data.course) {
                    setCourse(res.data.course);
                    setCategoryName(res.data.categoryName || res.data.category || category || 'Courses');
                    setUniversities(res.data.universities || []);
                    setLoading(false);
                } else {
                    // Fallback to slug search
                    const targetSlug = slug || category;
                    api.get(`/courses/${targetSlug}`)
                        .then(fallbackRes => {
                            if (fallbackRes.data && fallbackRes.data.course) {
                                setCourse(fallbackRes.data.course);
                                setCategoryName(fallbackRes.data.categoryName || fallbackRes.data.category || 'Courses');
                                setUniversities(fallbackRes.data.universities || []);
                            }
                            setLoading(false);
                        })
                        .catch(() => setLoading(false));
                }
            })
            .catch(err => {
                console.error("Error fetching course detail, attempting fallback:", err);
                const targetSlug = slug || category;
                api.get(`/courses/${targetSlug}`)
                    .then(fallbackRes => {
                        if (fallbackRes.data && fallbackRes.data.course) {
                            setCourse(fallbackRes.data.course);
                            setCategoryName(fallbackRes.data.categoryName || fallbackRes.data.category || 'Courses');
                            setUniversities(fallbackRes.data.universities || []);
                        }
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
            });
    }, [category, slug]);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading course details...</div>;
    }

    if (!course) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Course not found</div>;
    }

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Courses', url: '/courses' },
        { name: categoryName, url: `/courses/${category}` },
        { name: course.name, url: '' }
    ];

    return (
        <div className="course-detail-wrapper">
            <section className="course-hero" itemScope itemType="http://schema.org/Course">
                <div className="course-hero-content">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1 itemProp="name">{course.name}</h1>
                    <p itemProp="description">{course.description}</p>

                    <div className="course-meta">
                        <div className="course-meta-item">
                            <i className="fas fa-clock"></i>
                            <span itemProp="timeRequired">{course.duration}</span>
                        </div>
                        <div className="course-meta-item">
                            <i className="fas fa-graduation-cap"></i>
                            <span itemProp="educationalCredentialAwarded">{course.degree}</span>
                        </div>
                        <div className="course-meta-item">
                            <i className="fas fa-university"></i>
                            <span>{universities.length}+ Universities</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="course-overview-section" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="course-overview-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                    <div className="course-description">
                        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#1a1a1a' }}>About the Program</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}>{course.fullDescription}</p>
                        
                        <div className="eligibility-box" style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', marginTop: '30px', borderLeft: '4px solid var(--primary-color)' }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#1a1a1a' }}><i className="fas fa-check-circle" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i> Eligibility Criteria</h3>
                            <p style={{ margin: 0, color: '#444' }}>{course.eligibility}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="universities-section">
                <h2 className="section-title">Top Universities for {course.name}</h2>

                {universities && universities.length > 0 ? (
                    <div className="top-picks-grid">
                        {universities.map((university, index) => (
                            <Link to={`/university/${university.slug}`} className="top-pick-card" key={index} itemScope itemType="http://schema.org/EducationalOrganization">
                                <div className="top-pick-image">
                                    <img src={university.bannerImage || university.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&auto=format'} 
                                        alt={`${university.name} Campus`} 
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&auto=format' }}
                                        itemProp="image" />
                                    {university.featured && (
                                        <div className="featured-badge">Featured</div>
                                    )}
                                </div>

                                <div className="top-pick-content">
                                    <div className="top-pick-rank-number">{index + 1}</div>
                                    <h3 className="top-pick-name" itemProp="name">{university.name}</h3>
                                    <div className="top-pick-location" itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span itemProp="addressLocality">{university.location}</span>, <span itemProp="addressRegion">{university.state}</span>
                                    </div>

                                    <div className="top-pick-highlight">
                                        <i className="fas fa-university"></i>
                                        {university.type || 'Private'} University
                                    </div>
                                    
                                    <div className="top-pick-stats">
                                        <div className="top-pick-stat">
                                            <i className="fas fa-globe-asia top-pick-stat-icon"></i>
                                            <div className="top-pick-stat-value">#{university.globalRanking || (index + 1) * 15}</div>
                                            <div className="top-pick-stat-label">Global Rank</div>
                                        </div>

                                        <div className="top-pick-stat">
                                            <i className="fas fa-star top-pick-stat-icon"></i>
                                            <div className="top-pick-stat-value">{university.rating || 4.0}</div>
                                            <div className="top-pick-stat-label">Rating</div>
                                        </div>

                                        <div className="top-pick-stat">
                                            <i className="fas fa-rupee-sign top-pick-stat-icon"></i>
                                            <div className="top-pick-stat-value">
                                                {university.fee ? `₹${(university.fee/100000).toFixed(1)}L` : (university.feeRange ? university.feeRange.split('-')[0] : '₹2L')}
                                            </div>
                                            <div className="top-pick-stat-label">Fees</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-universities">
                        <i className="fas fa-university"></i>
                        <h3>No Partner Universities Found</h3>
                        <p>We are currently updating our partner list for this course.</p>
                        <Link to="/contact" className="btn-primary" style={{ display: 'inline-block', marginTop: '15px', textDecoration: 'none' }}>Get Admission Help</Link>
                    </div>
                )}
            </section>
        </div>
    );
}
