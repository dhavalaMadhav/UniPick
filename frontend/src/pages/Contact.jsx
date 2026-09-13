import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Contact() {
    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Contact Us', url: '' }
    ];

    return (
        <>
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <Breadcrumbs items={breadcrumbs} />
                    <h1>Contact Us</h1>
                    <p className="contact-hero-subtitle">Have questions about university admissions? Our expert team is here to provide guidance and support.</p>
                </div>
            </section>


    {/*  Main Contact Section  */}
    <section className="contact-main">
        <div className="contact-container">
            {/*  Contact Information (Hidden on Mobile) - WITH SCHEMA.ORG MARKUP  */}
            <div className="contact-info-section" itemscope itemtype="http://schema.org/LocalBusiness">
                <h2 className="contact-info-title" itemprop="name">UniPick Education Consultancy</h2>
                <p className="contact-info-text">Reach out to UniPick for expert university admissions help through any of
                    these channels. We're here to help you make informed decisions about your future.</p>

                <div className="contact-info-item">
                    <div className="contact-info-icon">
                        <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="contact-info-details">
                        <h4>Phone</h4>
                        <p><a href="tel:+919160064204" itemprop="telephone">+91 9160064204</a></p>
                    </div>
                </div>

                <div className="contact-info-item">
                    <div className="contact-info-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-info-details">
                        <h4>Email</h4>
                        <p><a href="mailto:unipick.org@gmail.com" itemprop="email">unipick.org@gmail.com</a></p>
                    </div>
                </div>

                <div className="contact-info-item">
                    <div className="contact-info-icon">
                        <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-info-details">
                        <h4>Office Address</h4>
                        <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                            <p>
                                <span itemprop="name">UniPick Education Consultancy</span><br />
                                <span itemprop="streetAddress">2-88, Balijepalli, Vemuru Mandal</span><br />
                                <span itemprop="addressLocality">Bapatla</span>,
                                <span itemprop="addressRegion">AP</span>
                                <span itemprop="postalCode">522261</span><br />
                                <span itemprop="addressCountry">India</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="contact-info-item">
                    <div className="contact-info-icon">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="contact-info-details">
                        <h4>Working Hours</h4>
                        <div itemprop="openingHours" content="Mo-Fr 09:00-18:00">
                            <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                                Saturday: 10:00 AM - 4:00 PM<br />
                                Sunday: Closed</p>
                        </div>
                    </div>
                </div>

                <div className="social-links">
                    <a href="https://www.facebook.com/profile.php?id=61587079312741" className="social-link"
                        aria-label="Facebook" itemprop="sameAs">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://x.com/ravi_vejendla2" className="social-link" aria-label="Twitter" itemprop="sameAs">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/unipick/" className="social-link" aria-label="LinkedIn"
                        itemprop="sameAs">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://www.instagram.com/ravivajendhla/" className="social-link" aria-label="Instagram"
                        itemprop="sameAs">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>

                {/*  Hidden Schema.org properties  */}
                <meta itemprop="image" content="https://unipick.org/logo.png" />
                <meta itemprop="priceRange" content="Contact for pricing" />
            </div>

            {/*  Contact Form  */}
            <div className="contact-form-section">
                <h2 className="form-title">Send Us a Message to Get University Admissions Help</h2>
                <p className="form-subtitle">Fill out the form below to reach out to UniPick and we'll provide expert
                    university admissions guidance within 24 hours</p>

                <form className="contact-form" id="contactForm">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name <span>*</span></label>
                            <input type="text" id="firstName" name="firstName" required aria-label="First Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name <span>*</span></label>
                            <input type="text" id="lastName" name="lastName" required aria-label="Last Name" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email Address <span>*</span></label>
                            <input type="email" id="email" name="email" required aria-label="Email Address" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number <span>*</span></label>
                            <input type="tel" id="phone" name="phone" required aria-label="Phone Number" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="course">Interested Course</label>
                            <select id="course" name="course" aria-label="Interested Course">
                                <option value="">Select a course</option>
                                <option value="btech">B.Tech</option>
                                <option value="mba">MBA</option>
                                <option value="bba">BBA</option>
                                <option value="bca">BCA</option>
                                <option value="mca">MCA</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject <span>*</span></label>
                            <input type="text" id="subject" name="subject" required aria-label="Subject" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message <span>*</span></label>
                        <textarea id="message" name="message" required aria-label="Your Message"
                            placeholder="Tell us how we can help with your university admissions"></textarea>
                    </div>

                    <button type="submit" className="form-submit-btn">
                        <i className="fas fa-paper-plane"></i>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>


    {/* SCRIPT REMOVED: 

        // Form Submission Handler
        document.getElementById('contactForm').addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                course: document.getElementById('course').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Here you would typically send the data to your backend
            console.log('Form submitted:', formData);

            // Show success message (you can customize this)
            alert('Thank you for contacting UniPick! Our university admissions consultants will get back to you within 24 hours.');

            // Reset form
            this.reset();
        });
    
*/}


    
        </>
    );
}
