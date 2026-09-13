import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Courses() {
    const [activeTab, setActiveTab] = useState('engineering');
    const navigate = useNavigate();

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Courses', url: '' }
    ];

    return (
        <div className="courses-wrapper">
            <section className="courses-hero">
                <div className="courses-hero-content">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1>Explore Undergraduate & Postgraduate Courses in India</h1>
                </div>
            </section>

            <section className="category-tabs-section">
        <div className="category-tabs-container">
            <div className="category-tabs" role="tablist" aria-label="Course categories">
                <button className={`category-tab ${activeTab === "engineering" ? "active" : ""}`} onClick={() => setActiveTab("engineering")} role="tab" aria-selected="true"
                    aria-controls="engineering-courses" aria-label="Engineering courses in India">
                    <i className="fas fa-cogs"></i>
                    <span>Engineering</span>
                </button>
                <button className={`category-tab ${activeTab === "management" ? "active" : ""}`} onClick={() => setActiveTab("management")} role="tab" aria-selected="false"
                    aria-controls="management-courses" aria-label="MBA programs and management courses">
                    <i className="fas fa-briefcase"></i>
                    <span>Management</span>
                </button>
                <button className={`category-tab ${activeTab === "science-arts" ? "active" : ""}`} onClick={() => setActiveTab("science-arts")} role="tab" aria-selected="false"
                    aria-controls="science-arts-courses" aria-label="Science and arts courses in India">
                    <i className="fas fa-flask"></i>
                    <span>Science & Arts</span>
                </button>
                <button className={`category-tab ${activeTab === "health-commerce" ? "active" : ""}`} onClick={() => setActiveTab("health-commerce")} role="tab" aria-selected="false"
                    aria-controls="health-commerce-courses" aria-label="Medical and commerce courses">
                    <i className="fas fa-heartbeat"></i>
                    <span>Health & Commerce</span>
                </button>
            </div>
        </div>
    </section>


    
    <section className="courses-list-section" >
        
        

        <div className="courses-list-container">

            
            <div className={`courses-list ${activeTab === "engineering" ? "active" : ""}`} id="engineering-courses" role="tabpanel"
                aria-labelledby="engineering-tab">
                <h2 style={{ position: 'absolute', left: '-9999px' }}>Engineering Courses in India</h2>

                <div className="course-item" onClick={() => navigate("/courses/engineering/computer-science")}
                    >
                    <div className="course-item-title">
                        <h3 
                            >
                            Computer Science Engineering Course Details</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Master software development, artificial intelligence, and cutting-edge computing technologies
                        with expert admission guidance for computer science engineering courses in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/engineering/mechanical")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Mechanical Engineering</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Design, analyze, and manufacture mechanical systems and machinery with top mechanical
                        engineering programs in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/engineering/civil")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Civil Engineering</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Build infrastructure, roads, bridges, and shape the physical world around us with civil
                        engineering courses in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/engineering/electrical")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Electrical Engineering</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Power the future with electrical systems, circuits, and energy technology through leading
                        electrical engineering programs
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/engineering/electronics")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Electronics Engineering</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Innovate with electronic circuits, embedded systems, and communication technology in top
                        electronics engineering courses
                    </div>
                    
                    
                </div>
            </div>


            
            <div className={`courses-list ${activeTab === "management" ? "active" : ""}`} id="management-courses" role="tabpanel"
                aria-labelledby="management-tab">
                <h2 style={{ position: 'absolute', left: '-9999px' }}>MBA Programs and Management Courses in India</h2>

                <div className="course-item" onClick={() => navigate("/courses/management/mba")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            MBA Admission Guidance - Master of Business Administration</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Master business administration, strategic leadership, and advanced management principles with
                        top MBA programs in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/management/business-administration")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Business Administration</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Learn core business principles, operations management, and entrepreneurship with business
                        administration courses in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/management/finance")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Finance Management</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Master financial analysis, investment strategies, and wealth management with finance management
                        courses and admission guidance
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/management/marketing")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Marketing Management</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Create impactful marketing campaigns and drive business growth through strategic marketing
                        management courses in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/management/human-resources")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Human Resources Management</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Build strong teams, manage organizational talent, and develop workplace culture with HR
                        management courses and admission guidance
                    </div>
                    
                    
                </div>
            </div>


            
            <div className={`courses-list ${activeTab === "science-arts" ? "active" : ""}`} id="science-arts-courses" role="tabpanel"
                aria-labelledby="science-arts-tab">
                <h2 style={{ position: 'absolute', left: '-9999px' }}>Science and Arts Courses in India</h2>

                <div className="course-item" onClick={() => navigate("/courses/science/computer-applications")}
                    >
                    <div className="course-item-title">
                        <h3 
                            >
                            Computer Applications</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Apply computing solutions to solve real-world problems and business challenges with computer
                        applications courses in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/arts/literature")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Literature</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Explore the world of language, creative writing, and literary analysis with arts and literature
                        courses
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/arts/psychology")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Psychology</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Understand human behavior, mental processes, and cognitive science with psychology courses and
                        admission guidance
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/science/mathematics")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Mathematics</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Master mathematical theory, analytical thinking, and problem-solving with science and
                        mathematics courses in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/science/physics")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Physics</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Explore the fundamental laws of nature, matter, energy, and the universe with science courses
                        and physics programs
                    </div>
                    
                    
                </div>
            </div>


            
            <div className={`courses-list ${activeTab === "health-commerce" ? "active" : ""}`} id="health-commerce-courses" role="tabpanel"
                aria-labelledby="health-commerce-tab">
                <h2 style={{ position: 'absolute', left: '-9999px' }}>Medical and Commerce Courses in India</h2>

                <div className="course-item" onClick={() => navigate("/courses/health/medicine")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Medicine (MBBS)</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Train to become a healthcare professional, diagnose diseases, and save lives with medical
                        courses and MBBS admission guidance in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/health/pharmacy")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Pharmacy</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Study pharmaceuticals, drug development, and medication management with pharmacy courses and
                        admission guidance
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/commerce/accounting")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Accounting</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Master financial reporting, auditing practices, and taxation with commerce courses and
                        accounting programs in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/commerce/banking-finance")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Banking & Finance</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Learn banking operations, financial services, and investment management with commerce and
                        banking courses in India
                    </div>
                    
                    
                </div>


                <div className="course-item" onClick={() => navigate("/courses/diploma/certificate")} 
                    itemtype="https://schema.org/Course">
                    <div className="course-item-title">
                        <h3 
                            >
                            Diploma Programs</h3>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="course-item-description" >
                        Short-term specialized certification and professional development programs with admission
                        guidance for courses in India
                    </div>
                    
                    
                </div>
            </div>


        </div>
    </section>


    


    
        </div>
    );
}

