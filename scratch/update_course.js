const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
let content = fs.readFileSync(jsxPath, 'utf-8');

// Remove career prospects section
const careerRegex = /<section className="career-prospects-section"[\s\S]*?<\/section>/;
content = content.replace(careerRegex, '');

// Update onError image fallback
content = content.replace(/\/images\/placeholder\.png/g, '/images/unipick-logo.png');

fs.writeFileSync(jsxPath, content);
console.log('Course pages updated');
