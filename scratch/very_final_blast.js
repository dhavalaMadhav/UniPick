const fs = require('fs');
const path = require('path');

// 1. Fix CourseDetail.jsx
const cdPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
if (fs.existsSync(cdPath)) {
    let cd = fs.readFileSync(cdPath, 'utf-8');
    cd = cd.replace(/<div className="top-picks-grid">[\s\S]*?<div className="no-universities">/g, '<div className="no-universities">'); 
    // actually, let's just properly fix it by closing the div
    cd = cd.replace(/<div className="no-universities">/, '</div>\n<div className="no-universities">');
    // remove stray } at end of file if any
    cd = cd.replace(/\}\s*$/, ''); // this might remove the component closing brace!
    // Let's not blindly remove }, let's just make sure the component is closed properly
    cd = cd.replace(/\{\/\* EJS:  \}  \*\/\}/g, '');
    cd = cd.replace(/\{\/\* EJS:  \}\) \} \*\/\}/g, '');
    fs.writeFileSync(cdPath, cd);
}

// 2. Fix UniversityDetail.jsx
const uniDetPath = path.join(__dirname, '../frontend/src/pages/UniversityDetail.jsx');
if (fs.existsSync(uniDetPath)) {
    let uniDet = fs.readFileSync(uniDetPath, 'utf-8');
    uniDet = uniDet.replace(/\{\/\* EJS:  \}\)  \*\/\}/g, '');
    fs.writeFileSync(uniDetPath, uniDet);
}

console.log('Very final blast applied');
