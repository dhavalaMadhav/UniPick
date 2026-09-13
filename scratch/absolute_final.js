const fs = require('fs');
const path = require('path');

// 1. Fix CourseDetail.jsx EOF
const cdPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
if (fs.existsSync(cdPath)) {
    let cd = fs.readFileSync(cdPath, 'utf-8');
    cd += '\n}';
    fs.writeFileSync(cdPath, cd);
}

// 2. Fix UniversityDetail.jsx programCode => {
const udPath = path.join(__dirname, '../frontend/src/pages/UniversityDetail.jsx');
if (fs.existsSync(udPath)) {
    let ud = fs.readFileSync(udPath, 'utf-8');
    ud = ud.replace(/university\.programmes\.forEach\(programCode => \{/g, '{/* university.programmes.forEach(programCode => { */}');
    fs.writeFileSync(udPath, ud);
}

console.log('Absolute final fix');
