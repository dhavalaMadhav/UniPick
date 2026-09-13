const fs = require('fs');
const path = require('path');

const ejsPath = path.join(__dirname, '../views/index.ejs');
const jsxPath = path.join(__dirname, '../frontend/src/pages/Home.jsx');

let ejsContent = fs.readFileSync(ejsPath, 'utf-8');

// Strip out the `<%- include('partials/header') %>` and footer
ejsContent = ejsContent.replace(/<%- include\('partials\/header'\) %>/g, '');
ejsContent = ejsContent.replace(/<%- include\('partials\/footer'\) %>/g, '');

// Convert to JSX
let jsxContent = ejsContent
    .replace(/class="/g, 'className="')
    .replace(/for="/g, 'htmlFor="')
    .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
    .replace(/<script[\s\S]*?<\/script>/g, '') // remove scripts completely
    .replace(/<style[\s\S]*?<\/style>/g, '') // remove style tags completely
    .replace(/<meta[^>]*>/g, '') // remove meta tags completely
    .replace(/onclick="[^"]*"/gi, 'onClick={() => {}}')
    .replace(/<img(.*?)>/g, '<img$1 />')
    .replace(/<input(.*?)>/g, '<input$1 />')
    .replace(/<meta(.*?)>/g, '<meta$1 />')
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />');

// Now, handle the EJS dynamic block for testimonials
const testimonialRegex = /<% testimonials\.forEach.*?%>[\s\S]*?<% }.*?>/g;
const reactTestimonials = `
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
`;

jsxContent = jsxContent.replace(testimonialRegex, reactTestimonials);

// Wrap in React component
const finalCode = `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [testimonials, setTestimonials] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/')
            .then(res => {
                if (res.data) {
                    setTestimonials(res.data.testimonials || []);
                    setUniversities(res.data.universities || []);
                }
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="home-wrapper">
            ${jsxContent}
        </div>
    );
}
`;

fs.writeFileSync(jsxPath, finalCode);
console.log('Home.jsx fully recreated!');
