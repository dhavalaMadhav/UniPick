const fs = require('fs');
const path = require('path');

const ejsPath = path.join(__dirname, '../views/course-detail.ejs');
const jsxPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');

let ejsContent = fs.readFileSync(ejsPath, 'utf-8');

// Replace EJS variable references with React state variables FIRST
ejsContent = ejsContent.replace(/<%=\s*course\.name\s*%>/g, '{course.name}');
ejsContent = ejsContent.replace(/<%=\s*categoryName\s*%>/g, '{categoryName}');
ejsContent = ejsContent.replace(/<%=\s*course\.description\s*%>/g, '{course.description}');
ejsContent = ejsContent.replace(/<%=\s*course\.icon\s*%>/g, '{course.icon}');
ejsContent = ejsContent.replace(/<%=\s*course\.fullDescription\s*%>/g, '{course.fullDescription}');
ejsContent = ejsContent.replace(/<%=\s*course\.duration\s*%>/g, '{course.duration}');
ejsContent = ejsContent.replace(/<%=\s*course\.degree\s*%>/g, '{course.degree}');
ejsContent = ejsContent.replace(/<%=\s*course\.eligibility\s*%>/g, '{course.eligibility}');
ejsContent = ejsContent.replace(/<%=\s*course\.averageFees\s*%>/g, '{course.averageFees}');
ejsContent = ejsContent.replace(/<%=\s*course\.slug\s*%>/g, '{course.slug}');

// Replace arrays like careerOptions
ejsContent = ejsContent.replace(/<%\s*course\.careerOptions\.forEach\(option => {\s*%>/g, '{course.careerOptions.map((option, i) => (');
ejsContent = ejsContent.replace(/<%=\s*option\s*%>/g, '{option}');
ejsContent = ejsContent.replace(/<%\s*}\)\s*%>/g, '))}');

ejsContent = ejsContent.replace(/<%\s*course\.topRecruiters\.forEach\(recruiter => {\s*%>/g, '{course.topRecruiters.map((recruiter, i) => (');
ejsContent = ejsContent.replace(/<%=\s*recruiter\s*%>/g, '{recruiter}');

ejsContent = ejsContent.replace(/<%\s*course\.skills\.forEach\(skill => {\s*%>/g, '{course.skills.map((skill, i) => (');
ejsContent = ejsContent.replace(/<%=\s*skill\s*%>/g, '{skill}');

// Custom replacement for featured
ejsContent = ejsContent.replace(/<%\s*if\s*\(university\.featured\)\s*{\s*%>/g, '{university.featured && (');
// Custom replacement for universities if
ejsContent = ejsContent.replace(/<%\s*if\s*\(universities\s*&&\s*universities\.length\s*>\s*0\)\s*{\s*%>/g, '{universities && universities.length > 0 ? (');
ejsContent = ejsContent.replace(/<%\s*}\s*else\s*{\s*%>/g, ') : (');

// Custom replacement for universities loop
ejsContent = ejsContent.replace(/<%\s*universities\.forEach\(university => {\s*%>/g, '{universities.map(university => (');
ejsContent = ejsContent.replace(/<%=\s*university\.name\s*%>/g, '{university.name}');
ejsContent = ejsContent.replace(/<%=\s*university\.location\s*%>/g, '{university.location}');
ejsContent = ejsContent.replace(/<%=\s*university\.state\s*%>/g, '{university.state}');
ejsContent = ejsContent.replace(/<%=\s*university\.rating\s*%>/g, '{university.rating}');
ejsContent = ejsContent.replace(/<%=\s*university\.slug\s*%>/g, '{university.slug}');

// Replace any remaining `<% } %>` properly.
// The first one is the end of `if (university.featured)`. We will replace it manually.
ejsContent = ejsContent.replace(/<%\s*}\s*%>/, ')}'); // End of featured
ejsContent = ejsContent.replace(/<%\s*}\s*%>/, ')}'); // End of universities else branch

// NOW strip out header, footer, scripts, styles, meta, EJS comments/tags safely
ejsContent = ejsContent.replace(/<%- include\('partials\/header'\) %>/g, '');
ejsContent = ejsContent.replace(/<%- include\('partials\/footer'\) %>/g, '');
ejsContent = ejsContent.replace(/<script[\s\S]*?<\/script>/g, '');
ejsContent = ejsContent.replace(/<style[\s\S]*?<\/style>/g, '');
ejsContent = ejsContent.replace(/<meta[^>]*>/g, '');
ejsContent = ejsContent.replace(/<!--[\s\S]*?-->/g, '');

// Strip remaining EJS tags entirely!
ejsContent = ejsContent.replace(/<%.*?%>/g, '');
ejsContent = ejsContent.replace(/<%\s*[\s\S]*?\s*%>/g, '');

// Basic HTML to JSX fixes
let jsxContent = ejsContent
    .replace(/class="/g, 'className="')
    .replace(/for="/g, 'htmlFor="')
    .replace(/<img(.*?)>/g, '<img$1 />')
    .replace(/<img([\s\S]*?)itemprop="image">/g, '<img$1itemprop="image" />') // Fix multi-line img
    .replace(/<input(.*?)>/g, '<input$1 />')
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />')
    .replace(/onclick="[^"]*"/gi, 'onClick={() => {}}');

// Clean up invalid attributes and dangling strings
jsxContent = jsxContent.replace(/style="[^"]*"/g, '');
jsxContent = jsxContent.replace(/^\s*">\s*$/gm, '');
jsxContent = jsxContent.replace(/^\s*\.jpg">\s*$/gm, '');
// Fix any broken navigation links for university cards
jsxContent = jsxContent.replace(/<div className="top-pick-card" onClick={\(\) => {}}/g, '<Link className="top-pick-card" to={`/university/${university.slug}`}');
jsxContent = jsxContent.replace(/<div className="top-pick-content">([\s\S]*?)<\/div>\s*<\/div>/g, '<div className="top-pick-content">$1</div></Link>');

const finalCode = `import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function CourseDetail() {
    const { category, slug } = useParams();
    const [course, setCourse] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(\`/courses/\${category}/\${slug}\`)
            .then(res => {
                if (res.data) {
                    setCourse(res.data.course);
                    setCategoryName(res.data.categoryName);
                    setUniversities(res.data.universities || []);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [category, slug]);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading course details...</div>;
    }

    if (!course) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Course not found</div>;
    }

    return (
        <div className="course-detail-wrapper">
            ${jsxContent}
        </div>
    );
}
`;

fs.writeFileSync(jsxPath, finalCode);
console.log('CourseDetail.jsx cleanly regenerated with precise replacements!');
