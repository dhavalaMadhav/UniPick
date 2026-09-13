import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="inst-header">
            {/* Top Navy Brand Bar */}
            <div className="inst-top-bar">
                <div className="inst-top-bar-inner">
                    <div className="inst-brand-left">
                        <Link to="/" className="inst-logo-link">
                            <img src="/images/unipick-logo.png" alt="UniPick Logo" className="inst-logo-img" />
                        </Link>
                        <div className="inst-tagline">YOUR PARTNER IN UNIVERSITY ADMISSIONS</div>
                    </div>
                    <div className="inst-brand-right">
                        <div className="inst-audience">Info for: <span>Students & Parents <i className="fas fa-caret-down"></i></span></div>
                        <Link to="/contact" className="inst-talk-btn">TALK TO AN ADVISOR</Link>
                        <Link to="/universities" className="inst-search-btn" aria-label="Search Universities"><i className="fas fa-search"></i></Link>
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
        </header>
    );
}
