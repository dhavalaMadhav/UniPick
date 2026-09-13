const fs = require('fs');
const path = require('path');

const ejsPath = path.join(__dirname, '../views/course-detail.ejs');
const jsxPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');

let ejsContent = fs.readFileSync(ejsPath, 'utf-8');

// Strip out header, footer, scripts, styles
ejsContent = ejsContent.replace(/<%- include\('partials\/header'\) %>/g, '');
ejsContent = ejsContent.replace(/<%- include\('partials\/footer'\) %>/g, '');
ejsContent = ejsContent.replace(/<script[\s\S]*?<\/script>/g, '');
ejsContent = ejsContent.replace(/<style[\s\S]*?<\/style>/g, '');
ejsContent = ejsContent.replace(/<meta[^>]*>/g, '');
ejsContent = ejsContent.replace(/<!--[\s\S]*?-->/g, '');

// Basic HTML to JSX fixes
let jsxContent = ejsContent
    .replace(/class="/g, 'className="')
    .replace(/for="/g, 'htmlFor="')
    .replace(/<img(.*?)>/g, '<img$1 />')
    .replace(/<input(.*?)>/g, '<input$1 />')
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />')
    .replace(/onclick="[^"]*"/gi, 'onClick={() => {}}');

// Replace EJS variable references with React state variables
// ejs format is <%= variable %> or <%- variable %>
jsxContent = jsxContent.replace(/<%=\s*course\.name\s*%>/g, '{course.name}');
jsxContent = jsxContent.replace(/<%=\s*categoryName\s*%>/g, '{categoryName}');
jsxContent = jsxContent.replace(/<%=\s*course\.description\s*%>/g, '{course.description}');
jsxContent = jsxContent.replace(/<%=\s*course\.icon\s*%>/g, '{course.icon}');
jsxContent = jsxContent.replace(/<%=\s*course\.fullDescription\s*%>/g, '{course.fullDescription}');
jsxContent = jsxContent.replace(/<%=\s*course\.duration\s*%>/g, '{course.duration}');
jsxContent = jsxContent.replace(/<%=\s*course\.degree\s*%>/g, '{course.degree}');
jsxContent = jsxContent.replace(/<%=\s*course\.eligibility\s*%>/g, '{course.eligibility}');
jsxContent = jsxContent.replace(/<%=\s*course\.averageFees\s*%>/g, '{course.averageFees}');

// Replace arrays like careerOptions
jsxContent = jsxContent.replace(/<%\s*course\.careerOptions\.forEach\(option => {\s*%>/g, '{course.careerOptions.map((option, i) => (');
jsxContent = jsxContent.replace(/<%=\s*option\s*%>/g, '{option}');
jsxContent = jsxContent.replace(/<%\s*}\)\s*%>/g, '))}');

jsxContent = jsxContent.replace(/<%\s*course\.topRecruiters\.forEach\(recruiter => {\s*%>/g, '{course.topRecruiters.map((recruiter, i) => (');
jsxContent = jsxContent.replace(/<%=\s*recruiter\s*%>/g, '{recruiter}');

jsxContent = jsxContent.replace(/<%\s*course\.skills\.forEach\(skill => {\s*%>/g, '{course.skills.map((skill, i) => (');
jsxContent = jsxContent.replace(/<%=\s*skill\s*%>/g, '{skill}');

// Replace university loop
// <% if (universities && universities.length > 0) { %>
jsxContent = jsxContent.replace(/<%\s*if\s*\(universities\s*&&\s*universities\.length\s*>\s*0\)\s*{\s*%>/g, '{universities && universities.length > 0 ? (');
jsxContent = jsxContent.replace(/<%\s*}\s*else\s*{\s*%>/g, ') : (');
jsxContent = jsxContent.replace(/<%\s*}\s*%>/g, ')}');

jsxContent = jsxContent.replace(/<%\s*universities\.forEach\(university => {\s*%>/g, '{universities.map(university => (');
jsxContent = jsxContent.replace(/<%=\s*university\.name\s*%>/g, '{university.name}');
jsxContent = jsxContent.replace(/<%=\s*university\.location\s*%>/g, '{university.location}');
jsxContent = jsxContent.replace(/<%=\s*university\.state\s*%>/g, '{university.state}');
jsxContent = jsxContent.replace(/<%=\s*university\.rating\s*%>/g, '{university.rating}');
jsxContent = jsxContent.replace(/<%=\s*university\.slug\s*%>/g, '{university.slug}');

// Remove leftover EJS blocks that might cause syntax errors
jsxContent = jsxContent.replace(/<%.*?%>/g, '');

// Clean up invalid attributes
jsxContent = jsxContent.replace(/style="[^"]*"/g, '');

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
console.log('CourseDetail.jsx fully recreated!');
