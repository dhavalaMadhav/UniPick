const fs = require('fs');
const path = require('path');

const ejsPath = path.join(__dirname, '../views/universities.ejs');
const cssPath = path.join(__dirname, '../frontend/src/assets/universities.css');
const jsxPath = path.join(__dirname, '../frontend/src/pages/Universities.jsx');

let ejsContent = fs.readFileSync(ejsPath, 'utf-8');

// Extract CSS
const styleMatch = ejsContent.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });
    fs.writeFileSync(cssPath, styleMatch[1]);
    console.log('Extracted universities.css');
}

// Ensure Universities.jsx imports it
let jsxContent = fs.readFileSync(jsxPath, 'utf-8');
if (!jsxContent.includes("import '../assets/universities.css'")) {
    jsxContent = jsxContent.replace("import './Universities.css';", "import '../assets/universities.css';");
    if (!jsxContent.includes("import '../assets/universities.css'")) {
        jsxContent = jsxContent.replace("import api from '../services/api';", "import api from '../services/api';\nimport '../assets/universities.css';");
    }
}

fs.writeFileSync(jsxPath, jsxContent);
console.log('Updated Universities.jsx import');
