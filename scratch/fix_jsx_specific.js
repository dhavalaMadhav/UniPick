const fs = require('fs');
const path = require('path');

// 1. Fix CourseDetail.jsx
const cdPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
if (fs.existsSync(cdPath)) {
    let cd = fs.readFileSync(cdPath, 'utf-8');
    cd = cd.replace(/<% const breadcrumbs = [\s\S]*?\];\s*}/, '{/* EJS LOGIC: breadcrumbs */}');
    cd = cd.replace(/% \/>/g, '}');
    cd = cd.replace(/\{ course.name }/g, '{ course?.name }');
    cd = cd.replace(/\{ course.description }/g, '{ course?.description }');
    fs.writeFileSync(cdPath, cd);
}

// 2. Fix Home.jsx
const homePath = path.join(__dirname, '../frontend/src/pages/Home.jsx');
if (fs.existsSync(homePath)) {
    let home = fs.readFileSync(homePath, 'utf-8');
    home = home.replace(/% \/>/g, '}');
    home = home.replace(/"\{ testimonial\.image \|\| 'https:\/\/via\.placeholder\.com\/70' \}"/, '{ testimonial.image || "https://via.placeholder.com/70" }');
    home = home.replace(/alt="Student \{\/\* EJS: = testimonial\.name \}/, 'alt={"Student " + testimonial.name}');
    home = home.replace(/"https:\/\/schema\.org"/, '"https://schema.org"}'); // fix missing closing brace if any
    fs.writeFileSync(homePath, home);
}

// 3. Fix Header.jsx
const headerPath = path.join(__dirname, '../frontend/src/components/Header.jsx');
if (fs.existsSync(headerPath)) {
    let header = fs.readFileSync(headerPath, 'utf-8');
    header = header.replace(/\{-Index:/g, "{'--index':");
    fs.writeFileSync(headerPath, header);
}

// 4. Fix Universities.jsx
const uniPath = path.join(__dirname, '../frontend/src/pages/Universities.jsx');
if (fs.existsSync(uniPath)) {
    let uni = fs.readFileSync(uniPath, 'utf-8');
    // If there is an unclosed string or object property
    uni = uni.replace(/% \/>/g, '}');
    // comment out state: (university.state... if it's inside JSX text by accident
    uni = uni.replace(/state: \(university\.state \|\| ''\)\.toLowerCase\(\),/g, "{/* state: (university.state || '').toLowerCase(), */}");
    fs.writeFileSync(uniPath, uni);
}

// 5. Fix UniversityDetail.jsx
const uniDetPath = path.join(__dirname, '../frontend/src/pages/UniversityDetail.jsx');
if (fs.existsSync(uniDetPath)) {
    let uniDet = fs.readFileSync(uniDetPath, 'utf-8');
    uniDet = uniDet.replace(/% \/>/g, '}');
    uniDet = uniDet.replace(/const programCounts = \{\};/g, '{/* const programCounts = {}; */}');
    // Also remove unclosed script tags if any
    fs.writeFileSync(uniDetPath, uniDet);
}

// 6. Fix Footer.jsx
const footerPath = path.join(__dirname, '../frontend/src/components/Footer.jsx');
if (fs.existsSync(footerPath)) {
    let footer = fs.readFileSync(footerPath, 'utf-8');
    footer = footer.replace(/--footer-deep-navy:/g, "'--footer-deep-navy':");
    fs.writeFileSync(footerPath, footer);
}

console.log('Fixed specific JSX errors');
