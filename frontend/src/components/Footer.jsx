import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    // TODO: Add state and data fetching logic here

    return (
        <>
            {/*  partials/footer.ejs  */}


<footer className="inst-footer">
    {/*  Top Utility Bar  */}
    <div className="inst-footer-top">
        <div className="inst-footer-container">
            <h3 className="inst-footer-utils">Ready to start your academic journey?</h3>
            <a href="/contact" className="inst-footer-btn">Schedule Free Consultation</a>
        </div>
    </div>

    {/*  Main Footer Body  */}
    <div className="inst-footer-main">
        <div className="inst-footer-container">
            <div className="inst-footer-grid">
                
                {/*  Column 1: Brand  */}
                <div className="inst-footer-col">
                    <img src="/images/unipick-logo.png" alt="UniPick Logo" style={{height: '45px', marginBottom: '25px', filter: 'brightness(0) invert(1)'}} />
                    <p className="inst-footer-brand-desc">
                        Your trusted partner in making informed university admission decisions. Expert guidance backed by data and transparency.
                    </p>
                    <address className="inst-footer-address">
                        Vijayawada, Andhra Pradesh<br />
                        India
                    </address>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122550.00757367375!2d80.56942944641974!3d16.510372864387825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d944b%3A0x939b7e84ab4a0265!2sVijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1709230000000!5m2!1sen!2sin" width="100%" height="150" style={{border: '0', borderRadius: '4px', marginBottom: '30px'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>

                {/*  Column 2: Contact Us  */}
                <div className="inst-footer-col">
                    <h3>Contact Us</h3>
                    <ul className="inst-footer-list">
                        <li><a href="/#faq"><i className="fas fa-question-circle"></i> Frequently Asked Questions</a></li>
                        <li><a href="/contact"><i className="fas fa-comments"></i> Talk to an Advisor</a></li>
                        <li><a href="/contact"><i className="fas fa-envelope"></i> Contact Us</a></li>
                        <li><a href="mailto:unipick.org@gmail.com"><i className="fas fa-at"></i> Email UniPick</a></li>
                        <li><a href="tel:+919160064204"><i className="fas fa-phone-alt"></i> Call Us</a></li>
                    </ul>
                </div>

                {/*  Column 3: Connect With Us  */}
                <div className="inst-footer-col">
                    <h3>Connect With Us</h3>
                    <ul className="inst-footer-list">
                        <li><a href="https://www.instagram.com/ravivajendhla/" target="_blank"><i className="fab fa-instagram"></i> Instagram</a></li>
                        <li><a href="https://www.facebook.com/profile.php?id=61587079312741" target="_blank"><i className="fab fa-facebook-f"></i> Facebook</a></li>
                        <li><a href="https://www.linkedin.com/in/unipick/" target="_blank"><i className="fab fa-linkedin-in"></i> LinkedIn</a></li>
                        <li><a href="https://x.com/ravi_vejendla2" target="_blank"><i className="fab fa-twitter"></i> Twitter</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    {/*  Bottom Legal Bar  */}
    <div className="inst-footer-bottom">
        <div className="inst-footer-container">
            <div className="inst-footer-legal">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Cookie Policy</a>
                <a href="/contact">Contact</a>
            </div>
            <p className="inst-footer-copyright">
                &copy; 2026 UniPick. All rights reserved.
            </p>
        </div>
    </div>
</footer>
        </>
    );
}
