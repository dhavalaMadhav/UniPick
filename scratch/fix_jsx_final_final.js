const fs = require('fs');
const path = require('path');

// 1. Fix CSS
const cssPath = path.join(__dirname, '../frontend/src/index.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf-8');
    // Find all url(...) and if they contain <%=, change them to something valid like /placeholder.png
    css = css.replace(/url\([^)]*<%=([^)]*)\)/g, 'url(/images/placeholder.png)');
    fs.writeFileSync(cssPath, css);
}

// 2. Fix Home.jsx
const homePath = path.join(__dirname, '../frontend/src/pages/Home.jsx');
if (fs.existsSync(homePath)) {
    let home = fs.readFileSync(homePath, 'utf-8');
    home = home.replace(/<img src=\{ testimonial\.image \|\| 'https:\/\/via\.placeholder\.com\/70' \}"/, '<img src={ testimonial.image || "https://via.placeholder.com/70" }');
    fs.writeFileSync(homePath, home);
}

// 3. Fix CourseDetail.jsx
const cdPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
if (fs.existsSync(cdPath)) {
    let cd = fs.readFileSync(cdPath, 'utf-8');
    cd = cd.replace(/\/ \/>/g, '/>'); // Fix <meta ... / />
    fs.writeFileSync(cdPath, cd);
}

// 4. Fix Universities.jsx
const uniPath = path.join(__dirname, '../frontend/src/pages/Universities.jsx');
if (fs.existsSync(uniPath)) {
    let uni = fs.readFileSync(uniPath, 'utf-8');
    uni = uni.replace(/' private'/g, "'private'"); 
    // And comment out the whole university filtering script if it broke
    uni = uni.replace(/type: university\.type \? university\.type\.toLowerCase\(\) : 'private', fee: university\.fee \|\|/g, "{/* type: university.type */}");
    fs.writeFileSync(uniPath, uni);
}

// 5. Fix UniversityDetail.jsx
const uniDetPath = path.join(__dirname, '../frontend/src/pages/UniversityDetail.jsx');
if (fs.existsSync(uniDetPath)) {
    let uniDet = fs.readFileSync(uniDetPath, 'utf-8');
    uniDet = uniDet.replace(/\{\/\* EJS:  university\.programmes\.forEach\(program => \{  \*\/\}/g, '');
    uniDet = uniDet.replace(/\{\/\* EJS:  \}\);  \*\/\}/g, '');
    fs.writeFileSync(uniDetPath, uniDet);
}

console.log('Final final JSX fixes applied');
