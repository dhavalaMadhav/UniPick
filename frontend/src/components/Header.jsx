import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
    const [mobileCategory, setMobileCategory] = useState(null);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }
        return () => {
            document.body.classList.remove('mobile-menu-open');
        };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setMobileCoursesOpen(false);
        setMobileCategory(null);
    };

    return (
        <header className="inst-header">
            {/* Top Navy Brand Bar */}
            <div className="inst-top-bar">
                <div className="inst-top-bar-inner">
                    <div className="inst-brand-left">
                        <Link to="/" className="inst-logo-link" onClick={closeMobileMenu}>
                            <img src="/images/unipick-logo.png" alt="UniPick Logo" className="inst-logo-img" />
                        </Link>
                        <div className="inst-tagline">YOUR PARTNER IN UNIVERSITY ADMISSIONS</div>
                    </div>
                    <div className="inst-brand-right">
                        <div className="inst-audience">Info for: <span>Students & Parents <i className="fas fa-caret-down"></i></span></div>
                        <Link to="/contact" className="inst-talk-btn">TALK TO AN ADVISOR</Link>
                        <Link to="/universities" className="inst-search-btn" aria-label="Search Universities"><i className="fas fa-search"></i></Link>
                        
                        {/* Hamburger Menu Toggle for Small Screens / Mobile */}
                        <button 
                            className="inst-mobile-toggle" 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            aria-label="Toggle navigation menu"
                        >
                            <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar (Desktop) */}
            <div className="inst-nav-bar">
                <nav className="inst-main-nav">
                    <ul>
                        <li className="dropdown">
                            <Link to="/courses" className="dropdown-toggle">Courses</Link>
                            {/* Mega Menu */}
                            <div className="dropdown-menu">
                                <div className="dropdown-grid">
                                    <div className="dropdown-column">
                                        <h4>Engineering</h4>
                                        <Link to="/courses/engineering/computer-science">Computer Science</Link>
                                        <Link to="/courses/engineering/mechanical">Mechanical</Link>
                                        <Link to="/courses/engineering/civil">Civil</Link>
                                        <Link to="/courses/engineering/electrical">Electrical</Link>
                                        <Link to="/courses/engineering/electronics">Electronics</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <h4>Management</h4>
                                        <Link to="/courses/management/mba">MBA</Link>
                                        <Link to="/courses/management/business-administration">Business Administration</Link>
                                        <Link to="/courses/management/finance">Finance</Link>
                                        <Link to="/courses/management/marketing">Marketing</Link>
                                        <Link to="/courses/management/human-resources">Human Resources</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <h4>Science & Arts</h4>
                                        <Link to="/courses/science/computer-applications">Computer Applications</Link>
                                        <Link to="/courses/arts/literature">Literature</Link>
                                        <Link to="/courses/arts/psychology">Psychology</Link>
                                        <Link to="/courses/science/mathematics">Mathematics</Link>
                                        <Link to="/courses/science/physics">Physics</Link>
                                    </div>
                                    <div className="dropdown-column">
                                        <h4>Health & Commerce</h4>
                                        <Link to="/courses/health/medicine">Medicine</Link>
                                        <Link to="/courses/health/pharmacy">Pharmacy</Link>
                                        <Link to="/courses/commerce/accounting">Accounting</Link>
                                        <Link to="/courses/commerce/banking-finance">Banking & Finance</Link>
                                        <Link to="/courses/diploma/certificate">Diploma Programs</Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li><Link to="/universities">Universities</Link></li>
                        <li><Link to="/quiz">Career Quiz</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </div>

            {/* Mobile Menu Backdrop Overlay */}
            <div 
                className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
                onClick={closeMobileMenu}
            />

            {/* Mobile Navigation Drawer */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <button 
                    className="mobile-menu-close" 
                    onClick={closeMobileMenu} 
                    aria-label="Close mobile menu"
                >
                    <i className="fas fa-times"></i>
                </button>

                <ul>
                    <li style={{ '--index': 0 }}>
                        <Link to="/" onClick={closeMobileMenu}>Home</Link>
                    </li>

                    {/* Courses Dropdown */}
                    <li className="has-dropdown" style={{ '--index': 1 }}>
                        <button 
                            className={`mobile-dropdown-toggle ${mobileCoursesOpen ? 'active' : ''}`}
                            onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                        >
                            <span>Courses</span>
                            <i className={`fas ${mobileCoursesOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </button>

                        <div className={`mobile-dropdown-content ${mobileCoursesOpen ? 'show' : ''}`}>
                            {/* Engineering Category */}
                            <div className="mobile-category">
                                <button 
                                    className={`mobile-category-toggle ${mobileCategory === 'engineering' ? 'active' : ''}`}
                                    onClick={() => setMobileCategory(mobileCategory === 'engineering' ? null : 'engineering')}
                                >
                                    <span>Engineering</span>
                                    <i className={`fas ${mobileCategory === 'engineering' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </button>
                                <div className={`mobile-programs-content ${mobileCategory === 'engineering' ? 'show' : ''}`}>
                                    <Link to="/courses/engineering/computer-science" onClick={closeMobileMenu}>Computer Science</Link>
                                    <Link to="/courses/engineering/mechanical" onClick={closeMobileMenu}>Mechanical</Link>
                                    <Link to="/courses/engineering/civil" onClick={closeMobileMenu}>Civil</Link>
                                    <Link to="/courses/engineering/electrical" onClick={closeMobileMenu}>Electrical</Link>
                                    <Link to="/courses/engineering/electronics" onClick={closeMobileMenu}>Electronics</Link>
                                </div>
                            </div>

                            {/* Management Category */}
                            <div className="mobile-category">
                                <button 
                                    className={`mobile-category-toggle ${mobileCategory === 'management' ? 'active' : ''}`}
                                    onClick={() => setMobileCategory(mobileCategory === 'management' ? null : 'management')}
                                >
                                    <span>Management</span>
                                    <i className={`fas ${mobileCategory === 'management' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </button>
                                <div className={`mobile-programs-content ${mobileCategory === 'management' ? 'show' : ''}`}>
                                    <Link to="/courses/management/mba" onClick={closeMobileMenu}>MBA</Link>
                                    <Link to="/courses/management/business-administration" onClick={closeMobileMenu}>Business Administration</Link>
                                    <Link to="/courses/management/finance" onClick={closeMobileMenu}>Finance</Link>
                                    <Link to="/courses/management/marketing" onClick={closeMobileMenu}>Marketing</Link>
                                    <Link to="/courses/management/human-resources" onClick={closeMobileMenu}>Human Resources</Link>
                                </div>
                            </div>

                            {/* Science & Arts Category */}
                            <div className="mobile-category">
                                <button 
                                    className={`mobile-category-toggle ${mobileCategory === 'science' ? 'active' : ''}`}
                                    onClick={() => setMobileCategory(mobileCategory === 'science' ? null : 'science')}
                                >
                                    <span>Science & Arts</span>
                                    <i className={`fas ${mobileCategory === 'science' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </button>
                                <div className={`mobile-programs-content ${mobileCategory === 'science' ? 'show' : ''}`}>
                                    <Link to="/courses/science/computer-applications" onClick={closeMobileMenu}>Computer Applications</Link>
                                    <Link to="/courses/arts/literature" onClick={closeMobileMenu}>Literature</Link>
                                    <Link to="/courses/arts/psychology" onClick={closeMobileMenu}>Psychology</Link>
                                    <Link to="/courses/science/mathematics" onClick={closeMobileMenu}>Mathematics</Link>
                                    <Link to="/courses/science/physics" onClick={closeMobileMenu}>Physics</Link>
                                </div>
                            </div>

                            {/* Health & Commerce Category */}
                            <div className="mobile-category">
                                <button 
                                    className={`mobile-category-toggle ${mobileCategory === 'health' ? 'active' : ''}`}
                                    onClick={() => setMobileCategory(mobileCategory === 'health' ? null : 'health')}
                                >
                                    <span>Health & Commerce</span>
                                    <i className={`fas ${mobileCategory === 'health' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </button>
                                <div className={`mobile-programs-content ${mobileCategory === 'health' ? 'show' : ''}`}>
                                    <Link to="/courses/health/medicine" onClick={closeMobileMenu}>Medicine</Link>
                                    <Link to="/courses/health/pharmacy" onClick={closeMobileMenu}>Pharmacy</Link>
                                    <Link to="/courses/commerce/accounting" onClick={closeMobileMenu}>Accounting</Link>
                                    <Link to="/courses/commerce/banking-finance" onClick={closeMobileMenu}>Banking & Finance</Link>
                                    <Link to="/courses/diploma/certificate" onClick={closeMobileMenu}>Diploma Programs</Link>
                                </div>
                            </div>

                            {/* View All Courses Link */}
                            <div className="mobile-view-all-container">
                                <Link to="/courses" className="mobile-view-all-btn" onClick={closeMobileMenu}>
                                    <i className="fas fa-graduation-cap"></i> View All Courses
                                </Link>
                            </div>
                        </div>
                    </li>

                    <li style={{ '--index': 2 }}>
                        <Link to="/universities" onClick={closeMobileMenu}>Universities</Link>
                    </li>
                    <li style={{ '--index': 3 }}>
                        <Link to="/quiz" onClick={closeMobileMenu}>Career Quiz</Link>
                    </li>
                    <li style={{ '--index': 4 }}>
                        <Link to="/about" onClick={closeMobileMenu}>About</Link>
                    </li>
                    <li style={{ '--index': 5 }}>
                        <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}

