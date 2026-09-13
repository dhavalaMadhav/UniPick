const fs = require('fs');
const path = require('path');

const ejsPath = path.join(__dirname, '../views/courses.ejs');
const jsxPath = path.join(__dirname, '../frontend/src/pages/Courses.jsx');

let ejsContent = fs.readFileSync(ejsPath, 'utf-8');

// Strip out header, footer, scripts, styles
ejsContent = ejsContent.replace(/<%- include\('partials\/header'\) %>/g, '');
ejsContent = ejsContent.replace(/<%- include\('partials\/footer'\) %>/g, '');
ejsContent = ejsContent.replace(/<script[\s\S]*?<\/script>/g, '');
ejsContent = ejsContent.replace(/<style[\s\S]*?<\/style>/g, '');
ejsContent = ejsContent.replace(/<meta[^>]*>/g, '');
ejsContent = ejsContent.replace(/<!--[\s\S]*?-->/g, '');

// Fix HTML attributes for JSX
let jsxContent = ejsContent
    .replace(/class="/g, 'className="')
    .replace(/for="/g, 'htmlFor="')
    .replace(/<img(.*?)>/g, '<img$1 />')
    .replace(/<input(.*?)>/g, '<input$1 />')
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />');

// Replace onclick navigation with Link wrapper
jsxContent = jsxContent.replace(/<div className="course-item" onclick="window\.location\.href='([^']+)'"([^>]*)>([\s\S]*?)<\/div>/g, 
    '<Link to="$1" className="course-item" $2>$3</Link>');

// Now we need to handle the tabs logic.
// The EJS has:
// <div className="courses-list active" data-category="engineering" ...>
// <button className="category-tab active" data-category="engineering" ...>
// We'll replace the static active class with a dynamic one based on state.

jsxContent = jsxContent.replace(/className="category-tab active" data-category="engineering"/g, 
    'className={`category-tab ${activeTab === "engineering" ? "active" : ""}`} onClick={() => setActiveTab("engineering")}');
jsxContent = jsxContent.replace(/className="category-tab" data-category="management"/g, 
    'className={`category-tab ${activeTab === "management" ? "active" : ""}`} onClick={() => setActiveTab("management")}');
jsxContent = jsxContent.replace(/className="category-tab" data-category="science-arts"/g, 
    'className={`category-tab ${activeTab === "science-arts" ? "active" : ""}`} onClick={() => setActiveTab("science-arts")}');
jsxContent = jsxContent.replace(/className="category-tab" data-category="health-commerce"/g, 
    'className={`category-tab ${activeTab === "health-commerce" ? "active" : ""}`} onClick={() => setActiveTab("health-commerce")}');

jsxContent = jsxContent.replace(/className="courses-list active" data-category="engineering"/g, 
    'className={`courses-list ${activeTab === "engineering" ? "active" : ""}`}');
jsxContent = jsxContent.replace(/className="courses-list" data-category="management"/g, 
    'className={`courses-list ${activeTab === "management" ? "active" : ""}`}');
jsxContent = jsxContent.replace(/className="courses-list" data-category="science-arts"/g, 
    'className={`courses-list ${activeTab === "science-arts" ? "active" : ""}`}');
jsxContent = jsxContent.replace(/className="courses-list" data-category="health-commerce"/g, 
    'className={`courses-list ${activeTab === "health-commerce" ? "active" : ""}`}');

// Strip remaining style="..." to avoid React object issues
jsxContent = jsxContent.replace(/style="[^"]*"/g, '');
jsxContent = jsxContent.replace(/itemscope itemtype="[^"]*"/g, '');
jsxContent = jsxContent.replace(/itemprop="[^"]*"/g, '');
jsxContent = jsxContent.replace(/itemscope/g, '');

const finalCode = `import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Courses() {
    const [activeTab, setActiveTab] = useState('engineering');

    return (
        <div className="courses-wrapper">
            ${jsxContent}
        </div>
    );
}
`;

fs.writeFileSync(jsxPath, finalCode);
console.log('Courses.jsx fully recreated with working tabs and links!');
