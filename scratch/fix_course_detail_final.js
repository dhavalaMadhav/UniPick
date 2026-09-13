const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
let content = fs.readFileSync(jsxPath, 'utf-8');

// The fuzzy matcher broke lines 80-100, deleting the universities-section header.
// I will just regenerate it completely using my robust script to be 100% safe.
