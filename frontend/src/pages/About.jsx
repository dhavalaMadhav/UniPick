import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
    const [activeSection, setActiveSection] = useState('mission');
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        document.title = 'About Us | UniPick - University Admissions Consultant';
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '' }
    ];


    const navItems = [
        { id: 'mission', label: "UniPick's Mission" },
        { id: 'consultant', label: "Education Consultant" },
        { id: 'impact', label: "Impact in Numbers" },
        { id: 'values', label: "Our Core Values" },
        { id: 'journey', label: "Professional Journey" },
        { id: 'network', label: "University Network" },
        { id: 'cta', label: "Begin Your Journey" }
    ];

    const handleNavClick = (e, id) => {
        e.preventDefault();
        setActiveSection(id);
        
        // On smaller screens, scroll to the top of content area when switching sections
        if (window.innerWidth <= 1024) {
            const contentEl = document.querySelector('.about-content');
            if (contentEl) {
                const topPos = contentEl.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="about-container">
            {/* Embedded Breadcrumb & Sidebar CSS override */}
            <style>{`
                .about-container > .breadcrumb {
                    background: transparent;
                    padding: 0;
                    margin-bottom: 30px;
                    box-shadow: none;
                    border: none;
                    font-size: 0.9rem;
                }
                .about-container > .breadcrumb a {
                    color: #002b5e !important;
                }
                .about-container > .breadcrumb span {
                    color: #4B5563 !important;
                    font-weight: 500 !important;
                }
                .about-container > .breadcrumb a:hover {
                    color: #007BFF !important;
                }
                .about-sidebar {
                    width: 25%;
                    flex-shrink: 0;
                    position: sticky;
                    top: 100px;
                    background: #FFFFFF;
                    padding-right: 20px;
                }
                .sidebar-title {
                    font-family: 'Inter', sans-serif;
                    font-size: 2rem;
                    font-weight: 300;
                    color: #002b5e;
                    margin-bottom: 24px;
                    letter-spacing: -0.02em;
                }
                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-link {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    min-height: 56px;
                    color: #002b5e;
                    text-decoration: none;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem;
                    font-weight: 500;
                    border-bottom: 1px solid #e5e7eb;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                .sidebar-link i {
                    font-size: 0.8rem;
                    color: #002b5e;
                    transition: all 0.2s ease;
                    opacity: 0.5;
                }
                .sidebar-link:hover {
                    background: #F7FAFC;
                    color: #007BFF;
                }
                .sidebar-link:hover i {
                    color: #007BFF;
                    opacity: 1;
                    transform: translateX(4px);
                }
                .sidebar-link.active {
                    background: #007BFF !important;
                    color: #FFFFFF !important;
                    border-bottom-color: #007BFF !important;
                    font-weight: 600 !important;
                }
                .cta-buttons {
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                    margin-top: 30px;
                }
                .cta-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 14px 28px;
                    background: #007BFF !important;
                    color: #FFFFFF !important;
                    border: 2px solid #007BFF !important;
                    font-family: 'Inter', sans-serif;
                    font-size: 1rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                .cta-btn-primary:hover {
                    background: #0056b3 !important;
                    border-color: #0056b3 !important;
                }
                .cta-btn-primary i {
                    margin-right: 10px;
                }
                .explore-unis-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 14px 28px;
                    background: #FFFFFF !important;
                    color: #007BFF !important;
                    border: 2px solid #007BFF !important;
                    font-family: 'Inter', sans-serif;
                    font-size: 1rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                .explore-unis-btn:hover {
                    background: #007BFF !important;
                    color: #FFFFFF !important;
                }
                @media (max-width: 768px) {
                    .cta-buttons {
                        flex-direction: column !important;
                        width: 100% !important;
                        gap: 12px !important;
                    }
                    .cta-buttons .cta-btn-primary,
                    .cta-buttons .explore-unis-btn {
                        width: 100% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        text-align: center !important;
                        box-sizing: border-box !important;
                        padding: 14px 20px !important;
                        font-size: 1rem !important;
                        min-height: 52px !important;
                        flex: 1 1 100% !important;
                    }
                }
            `}</style>

            <Breadcrumbs items={breadcrumbs} />

            <div className="about-layout">
                {/* Sidebar Navigation - Sticky on left */}
                <aside className="about-sidebar">
                    <h2 className="sidebar-title">About Us</h2>
                    <nav className="sidebar-nav" id="about-nav">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                >
                                    <span>{item.label}</span>
                                    <i className="fas fa-chevron-right"></i>
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content - Dynamically displays selected section on desktop or all sections sequentially on mobile */}
                <main className="about-content">
                    {/* Mission Section */}
                    {(isMobile || activeSection === 'mission') && (
                        <section id="mission" className="content-block active-block" itemScope itemType="http://schema.org/AboutPage">
                            <h2 className="section-title" itemProp="name">UniPick's Mission - Connecting Students with Best-Fit Universities</h2>
                            <p className="section-subtitle" itemProp="description">Transforming how students discover and choose their ideal universities through expert university admissions guidance</p>

                            <p className="body-text" itemProp="about">
                                UniPick is India's most comprehensive and transparent university selection platform, designed to empower students and parents with the information and guidance needed to make confident higher education decisions. We bridge the gap between aspirations and opportunities through verified data, expert insights, and personalized university admissions help.
                            </p>
                            <p className="body-text">
                                Unlike traditional admission consultancies, we prioritize long-term student success over commissions, providing unbiased recommendations based on academic fit, career prospects, and individual goals with our expert education consultant team.
                            </p>

                            <div className="platform-highlights">
                                <div className="platform-highlight">
                                    <i className="fas fa-database highlight-icon"></i>
                                    <div>
                                        <h4 className="highlight-title">Data-Driven Decisions</h4>
                                        <p className="highlight-text">Compare universities using verified placement records, ROI analysis, and real student outcomes.</p>
                                    </div>
                                </div>
                                <div className="platform-highlight">
                                    <i className="fas fa-user-check highlight-icon"></i>
                                    <div>
                                        <h4 className="highlight-title">Expert Verification</h4>
                                        <p className="highlight-text">Every university listing verified by experienced education consultants and industry professionals.</p>
                                    </div>
                                </div>
                                <div className="platform-highlight">
                                    <i className="fas fa-chart-line highlight-icon"></i>
                                    <div>
                                        <h4 className="highlight-title">Career-Focused Approach</h4>
                                        <p className="highlight-text">We evaluate programs based on future employability and industry alignment, not just rankings.</p>
                                    </div>
                                </div>
                                <div className="platform-highlight">
                                    <i className="fas fa-handshake highlight-icon"></i>
                                    <div>
                                        <h4 className="highlight-title">Direct University Access</h4>
                                        <p className="highlight-text">Connect directly with verified university representatives through our trusted network.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Education Consultant Section */}
                    {(isMobile || activeSection === 'consultant') && (
                        <section id="consultant" className="content-block active-block" itemScope itemType="http://schema.org/Person">
                            <h2 className="section-title">Meet Our Education Consultant - Your Expert Guide</h2>
                            
                            <div className="consultant-layout">
                                <div className="consultant-image">
                                    <img 
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop"
                                        alt="Ravi Vajendla, UniPick Founder and Lead University Admissions Consultant" 
                                        itemProp="image"
                                        loading="lazy" 
                                    />
                                </div>
                                <div className="consultant-info">
                                    <h3 itemProp="name">Ravi Vajendla</h3>
                                    <p className="consultant-job-title" itemProp="jobTitle">Chartered Accountant & Senior University Admissions Consultant</p>
                                    
                                    <p className="body-text" itemProp="description">
                                        With over 15 years of experience spanning finance and education consulting, Ravi brings a unique analytical lens to university admissions. As a qualified Chartered Accountant, he understands the financial implications and return on investment of education decisions—ensuring families make choices that are both academically sound and financially sustainable through expert university admissions help.
                                    </p>
                                    <p className="body-text">
                                        His transition from corporate finance to education consulting was driven by witnessing the impact of ill-informed admission decisions on students' careers. Having personally guided over 800 students with a 97% success rate, Ravi specializes in matching student profiles with institutions where they can genuinely thrive—considering academic excellence, cultural fit, and long-term career trajectories.
                                    </p>

                                    <div className="expertise-tags">
                                        <span className="expertise-tag">University Selection Strategy</span>
                                        <span className="expertise-tag">ROI & Financial Analysis</span>
                                        <span className="expertise-tag">Career Path Planning</span>
                                        <span className="expertise-tag">Education Financing</span>
                                        <span className="expertise-tag">Admission Process Management</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Metrics Section */}
                    {(isMobile || activeSection === 'impact') && (
                        <section id="impact" className="content-block active-block">
                            <h2 className="section-title">Our Impact in Numbers</h2>
                            <p className="section-subtitle">Measurable success built on trust and expert university admissions guidance</p>

                            <div className="metrics-grid">
                                <div className="metric-box">
                                    <div className="metric-number">800+</div>
                                    <div className="metric-label">Students Guided</div>
                                </div>
                                <div className="metric-box">
                                    <div className="metric-number">97%</div>
                                    <div className="metric-label">Success Rate</div>
                                </div>
                                <div className="metric-box">
                                    <div className="metric-number">15+</div>
                                    <div className="metric-label">Years Experience</div>
                                </div>
                                <div className="metric-box">
                                    <div className="metric-number">50+</div>
                                    <div className="metric-label">Partner Universities</div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Core Values */}
                    {(isMobile || activeSection === 'values') && (
                        <section id="values" className="content-block active-block">
                            <h2 className="section-title">Our Core Values</h2>
                            <p className="section-subtitle">The principles that guide every student interaction at our university admissions consultant practice</p>

                            <div className="values-grid">
                                <div className="value-item">
                                    <i className="fas fa-balance-scale value-icon"></i>
                                    <div>
                                        <h4 className="value-title">Transparency First</h4>
                                        <p className="value-description">Complete disclosure of all university metrics and performance data</p>
                                    </div>
                                </div>
                                <div className="value-item">
                                    <i className="fas fa-graduation-cap value-icon"></i>
                                    <div>
                                        <h4 className="value-title">Student-Centric</h4>
                                        <p className="value-description">Recommendations tailored to individual goals and circumstances</p>
                                    </div>
                                </div>
                                <div className="value-item">
                                    <i className="fas fa-chart-pie value-icon"></i>
                                    <div>
                                        <h4 className="value-title">Data-Driven Insights</h4>
                                        <p className="value-description">Decisions based on verified statistics and ROI analysis</p>
                                    </div>
                                </div>
                                <div className="value-item">
                                    <i className="fas fa-shield-alt value-icon"></i>
                                    <div>
                                        <h4 className="value-title">Ethical Practice</h4>
                                        <p className="value-description">Zero commission-based recommendations, only merit-based guidance</p>
                                    </div>
                                </div>
                                <div className="value-item">
                                    <i className="fas fa-award value-icon"></i>
                                    <div>
                                        <h4 className="value-title">Quality Excellence</h4>
                                        <p className="value-description">Partnerships only with verified, high-performing institutions</p>
                                    </div>
                                </div>
                                <div className="value-item">
                                    <i className="fas fa-lightbulb value-icon"></i>
                                    <div>
                                        <h4 className="value-title">Innovation Focus</h4>
                                        <p className="value-description">Technology-enabled matching and personalized counseling</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Professional Journey */}
                    {(isMobile || activeSection === 'journey') && (
                        <section id="journey" className="content-block active-block">
                            <h2 className="section-title">Professional Journey</h2>
                            <p className="section-subtitle">From Chartered Accountant to Education Innovation Leader</p>

                            <div className="timeline-container">
                                <div className="timeline-item">
                                    <div className="timeline-date">2005-2009</div>
                                    <h3 className="timeline-title">CA Qualification & Early Career</h3>
                                    <p className="body-text">
                                        Qualified as Chartered Accountant from ICAI with distinction, developing strong analytical foundations and financial assessment expertise through rigorous training.
                                    </p>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-date">2010-2015</div>
                                    <h3 className="timeline-title">Corporate Finance & Audit</h3>
                                    <p className="body-text">
                                        5+ years in corporate finance and institutional audit for leading educational organizations, gaining deep insights into university operations, financial sustainability, and quality metrics.
                                    </p>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-date">2016-2017</div>
                                    <h3 className="timeline-title">Transition to Education Consulting</h3>
                                    <p className="body-text">
                                        Recognized critical gaps in transparent admission guidance. Began consulting part-time while maintaining CA practice, helping students make data-informed university choices.
                                    </p>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-date">2018-Present</div>
                                    <h3 className="timeline-title">UniPick Platform Launch</h3>
                                    <p className="body-text">
                                        Founded UniPick to democratize access to quality admission guidance at scale. Platform now serves hundreds of students annually with technology-enabled personalized counseling and verified university data.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Partner Universities */}
                    {(isMobile || activeSection === 'network') && (
                        <section id="network" className="content-block active-block">
                            <h2 className="section-title">Our University Network</h2>
                            <p className="body-text">
                                We maintain strategic partnerships with carefully vetted universities across India that meet rigorous standards for academic quality, faculty credentials, infrastructure excellence, and documented student success.
                            </p>

                            <div className="partner-logos">
                                <div className="partner-logo">Swarrnim Startup & Innovation University</div>
                                <div className="partner-logo">Swaminarayan University</div>
                                <div className="partner-logo">Sankalchand Patel University</div>
                                <div className="partner-logo">Uka Tarsadia University</div>
                                <div className="partner-logo">Ajeenkya D Y Patil University</div>
                                <div className="partner-logo">Karpaga Vinayaga CET</div>
                            </div>
                        </section>
                    )}

                    {/* CTA Section */}
                    {(isMobile || activeSection === 'cta') && (
                        <section id="cta" className="content-block active-block">
                            <div className="editorial-quote">
                                <blockquote className="quote-text">
                                    "Education is an investment, not an expense. Our role is to help you make the smartest investment decision that will yield returns throughout your lifetime—academically, professionally, and personally."
                                </blockquote>
                                <div className="quote-author">
                                    — Ravi Vajendla, CA & Founder, UniPick
                                </div>
                            </div>

                            <h2 className="section-title" style={{ marginTop: '40px' }}>Ready to Begin Your Journey?</h2>
                            <p className="body-text">Schedule a personalized consultation with Ravi Vajendla, our lead education consultant, and discover the universities that align perfectly with your academic goals and career aspirations.</p>
                            <div className="cta-buttons" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}>
                                <a href="/contact" className="cta-btn-primary">
                                    <i className="fas fa-calendar-check"></i> Book Your Consultation
                                </a>
                                <a href="/universities" className="explore-unis-btn">
                                    <i className="fas fa-university" style={{ marginRight: '10px' }}></i> Explore Universities
                                </a>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
