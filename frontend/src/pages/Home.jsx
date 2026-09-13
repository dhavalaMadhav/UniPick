import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [stats, setStats] = useState({ universities: 0, courses: 0, students: 0 });
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (idx) => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    const faqs = [
        {
            question: "How does UniPick help me choose the right university?",
            answer: "UniPick provides comprehensive university profiles, course comparisons, and expert counseling to help you align your academic choices with your career goals."
        },
        {
            question: "Are the partner universities verified?",
            answer: "Yes, all partner institutions on our platform are thoroughly vetted and verified to ensure high standards of academic excellence and student support."
        },
        {
            question: "How do I get personalized admission guidance?",
            answer: "You can easily connect with our expert advisors by clicking 'Talk to an Advisor' or booking a consultation session through our contact page."
        },
        {
            question: "Can I take a career quiz to find suitable courses?",
            answer: "Yes! Our interactive career quiz helps you identify your strengths and interests, recommending courses and universities that best match your profile."
        }
    ];

    useEffect(() => {
        document.title = "UniPick - Admissions, Courses & Universities";
        
        Promise.all([
            api.get('/api/stats').catch(() => api.get('/stats')),
            api.get('/api/testimonials').catch(() => api.get('/testimonials'))
        ]).then(([statsRes, testRes]) => {
            if (statsRes && statsRes.data) {
                setStats(statsRes.data);
            }
            if (testRes && testRes.data) {
                setTestimonials(Array.isArray(testRes.data) ? testRes.data : (testRes.data.testimonials || []));
            }
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching homepage data:", err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="home-wrapper">

    
    


    

    

    

    
    <section className="inst-hero-container">
        <div className="inst-hero-image">
            <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80" alt="Students walking on university campus" />
        </div>
        <div className="inst-hero-panel">
            <h1>Find the right university for your future</h1>
            <p>Explore universities, discover courses and get personalized admission guidance to make the right choice for your future.</p>
            <div className="inst-hero-buttons">
                <a href="/universities" className="inst-hero-cta">Explore Universities</a>
                <a href="/contact" className="inst-hero-secondary-link">Talk to an Advisor &rarr;</a>
            </div>
        </div>
    </section>

    
    <section className="inst-discovery-area">
        <h2>What Would You Like to Do?</h2>
        
        <div className="inst-quick-actions">
            <a href="/universities">Explore Universities</a>
            <a href="/courses">Browse Courses</a>
            <a href="/quiz">Take Career Quiz</a>
        </div>
    </section>

    
    <section className="stats-section">
        <div className="stats-grid">
            <div className="stat-item">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div className="stat-number" data-target="500">0</div>
                <div className="stat-plus">+</div>
                <div className="stat-label">Students Placed</div>
            </div>
            <div className="stat-item">
                <div className="stat-icon"><i className="fas fa-university"></i></div>
                <div className="stat-number" data-target="150">0</div>
                <div className="stat-plus">+</div>
                <div className="stat-label">Partner Universities</div>
            </div>
            <div className="stat-item">
                <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
                <div className="stat-number" data-target="95">0</div>
                <div className="stat-percent">%</div>
                <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
                <div className="stat-icon"><i className="fas fa-headset"></i></div>
                <div className="stat-number-text">24/7</div>
                <div className="stat-label">Support Available</div>
            </div>
        </div>
    </section>

    
    

    <section className="inst-why-choose">
        <div className="inst-why-choose-container">
            <div className="inst-why-choose-header">
                <h2>Why Choose UniPick</h2>
                <p>Expert guidance and trusted resources to help you make confident decisions about your education and career.</p>
            </div>

            <div className="inst-features-grid">
                
                <div className="inst-feature-item">
                    <div className="inst-feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="70" height="70" fill="none" stroke="#002b5e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="32" cy="20" r="12" stroke="#008FD3" stroke-width="1.5"/>
                          <path d="M10 54v-6a16 16 0 0 1 16-16h12a16 16 0 0 1 16 16v6" />
                          <circle cx="48" cy="14" r="4" fill="#38A169" stroke="none" />
                        </svg>
                    </div>
                    <h3>Expert Counselors</h3>
                    <p>Dedicated academic advisors with years of experience guiding students to their ideal universities.</p>
                    <a href="/contact" className="inst-feature-btn">Talk to an Advisor</a>
                </div>

                
                <div className="inst-feature-item">
                    <div className="inst-feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="70" height="70" fill="none" stroke="#002b5e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M32 4L6 18v38h52V18L32 4z" stroke="#008FD3" stroke-width="1.5"/>
                          <path d="M22 56V36h20v20" />
                          <path d="M14 28h8M42 28h8M14 40h4M46 40h4" />
                          <circle cx="32" cy="14" r="4" fill="#38A169" stroke="none" />
                        </svg>
                    </div>
                    <h3>Verified Universities</h3>
                    <p>Access to carefully vetted institutions known for academic excellence and student success.</p>
                    <a href="/universities" className="inst-feature-btn">Explore Universities</a>
                </div>

                
                <div className="inst-feature-item">
                    <div className="inst-feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="70" height="70" fill="none" stroke="#002b5e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="32" cy="32" r="26" stroke="#008FD3" stroke-width="1.5"/>
                          <circle cx="32" cy="32" r="12" />
                          <path d="M32 6v6M32 52v6M6 32h6M52 32h6" />
                          <circle cx="48" cy="16" r="4" fill="#38A169" stroke="none"/>
                        </svg>
                    </div>
                    <h3>Career-Focused Approach</h3>
                    <p>Programs aligned with industry demands ensuring strong placement opportunities.</p>
                    <a href="/quiz" className="inst-feature-btn">Take Career Quiz</a>
                </div>

                
                <div className="inst-feature-item">
                    <div className="inst-feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="70" height="70" fill="none" stroke="#002b5e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M32 10v44" stroke="#008FD3" stroke-width="1.5"/>
                          <path d="M12 24l20-10 20 10v20l-20 10-20-10V24z" />
                          <circle cx="32" cy="32" r="4" fill="#38A169" stroke="none" />
                        </svg>
                    </div>
                    <h3>End-to-End Support</h3>
                    <p>Comprehensive assistance from application to enrollment and beyond.</p>
                    <a href="/contact" className="inst-feature-btn">Get Admission Help</a>
                </div>
            </div>
        </div>
    </section>



    
    

    <section id="stories" className="inst-stories-section">
        <div className="inst-stories-container">
            <div className="inst-stories-header">
                <h2>Student Success Stories</h2>
                <p>Hear from students who achieved their dreams with our university admissions consultant services and career guidance.</p>
            </div>

            <div className="stories-carousel" id="testimonialsCarousel">
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading stories...</div>
                ) : testimonials.length > 0 ? (
                    testimonials.map((testimonial, idx) => (
                        <div className="inst-story-card" itemScope itemType="http://schema.org/Review" key={idx}>
                            <div className="inst-story-top">
                                <div className="inst-story-student-info">
                                    <div className="inst-story-name" itemProp="author">{ testimonial.name }</div>
                                    <div className="inst-story-course">{ testimonial.course }</div>
                                    <div className="inst-story-univ">{ testimonial.university }</div>
                                </div>
                                <div className="inst-story-img-container">
                                    <img src={ testimonial.image || "https://via.placeholder.com/70" } alt={"Student " + testimonial.name} loading="lazy" />
                                </div>
                            </div>
                            <div className="inst-story-review" itemProp="reviewBody">
                                "{ testimonial.review }"
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px' }}>No stories found.</div>
                )}

            </div>

            
            <div className="carousel-dots" id="testimonialDots"></div>
        </div>
    </section>

    
    

    <section className="inst-faq-section">
        <div className="inst-faq-container">
            <div className="inst-faq-header">
                <h2>Frequently Asked Questions</h2>
                <p>Find answers to common questions about our services and process.</p>
            </div>

            <div className="inst-faq-list">
                {faqs.map((faq, idx) => (
                    <div className={`inst-faq-item ${openFaq === idx ? 'active' : ''}`} key={idx} style={{ marginBottom: '12px', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', background: '#FFFFFF' }}>
                        <div 
                            className="inst-faq-question" 
                            onClick={() => toggleFaq(idx)}
                            style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                        >
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0F172A' }}>{faq.question}</h3>
                            <i className={`fas ${openFaq === idx ? 'fa-minus' : 'fa-plus'}`} style={{ color: '#007BFF', transition: 'transform 0.2s ease' }}></i>
                        </div>
                        {openFaq === idx && (
                            <div className="inst-faq-answer" style={{ padding: '0 24px 18px', color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid #F1F5F9' }}>
                                <p style={{ marginTop: '12px', marginBottom: 0 }}>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>

    



    

    
        </div>
    );
}
