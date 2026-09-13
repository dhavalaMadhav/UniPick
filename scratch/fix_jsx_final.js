const fs = require('fs');
const path = require('path');

// 1. Fix CourseDetail.jsx
const cdPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
if (fs.existsSync(cdPath)) {
    let cd = fs.readFileSync(cdPath, 'utf-8');
    cd = cd.replace(/<%=/g, '{');
    cd = cd.replace(/<meta([^>]+?)>/g, '<meta$1 />'); // auto close metas
    cd = cd.replace(/<link([^>]+?)>/g, '<link$1 />'); // auto close links
    fs.writeFileSync(cdPath, cd);
}

// 2. Fix Header.jsx (Header fragment wrapper)
const headerPath = path.join(__dirname, '../frontend/src/components/Header.jsx');
if (fs.existsSync(headerPath)) {
    let header = fs.readFileSync(headerPath, 'utf-8');
    // Ensure we only have one top-level <> and </>
    // Let's just find the last </>, if there's multiple, let React handle it or we can just replace everything after </header> with </>
    const headerEndIdx = header.lastIndexOf('</header>');
    if (headerEndIdx !== -1) {
        header = header.substring(0, headerEndIdx + 9) + '\n        </>\n    );\n}\n';
    }
    fs.writeFileSync(headerPath, header);
}

// 3. Fix Universities.jsx string
const uniPath = path.join(__dirname, '../frontend/src/pages/Universities.jsx');
if (fs.existsSync(uniPath)) {
    let uni = fs.readFileSync(uniPath, 'utf-8');
    uni = uni.replace(/\{\/\* state: \(university\.state \|\| ''\)\.toLowerCase\(\), \*\/\}/g, '');
    fs.writeFileSync(uniPath, uni);
}

// 4. Any other file with <%=
const filesToCheck = ['Home.jsx', 'About.jsx', 'Contact.jsx', 'Courses.jsx', 'Universities.jsx', 'UniversityDetail.jsx', 'Quiz.jsx', 'QuizResults.jsx'];
for (const file of filesToCheck) {
    const p = path.join(__dirname, '../frontend/src/pages', file);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf-8');
        content = content.replace(/<%=/g, '{');
        content = content.replace(/<meta([^>]+?)(?<!\/)>/g, '<meta$1 />');
        content = content.replace(/<link([^>]+?)(?<!\/)>/g, '<link$1 />');
        // Fix the `/> />` if any
        content = content.replace(/\/> \/>/g, '/>');
        content = content.replace(/\/>\/>/g, '/>');
        fs.writeFileSync(p, content);
    }
}

console.log('Final JSX fixes applied');
