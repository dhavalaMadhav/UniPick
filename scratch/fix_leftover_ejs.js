const fs = require('fs');
const path = require('path');

const fixEJS = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Remove all <% ... %> tags that are left over
    content = content.replace(/<%.*?%>/g, '');
    
    // Sometimes there are multi-line EJS tags left
    content = content.replace(/<%\s*[\s\S]*?\s*%>/g, '');
    
    fs.writeFileSync(filePath, content);
};

fixEJS(path.join(__dirname, '../frontend/src/pages/Courses.jsx'));
fixEJS(path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx'));

console.log('Leftover EJS stripped.');
