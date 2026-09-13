const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
let content = fs.readFileSync(jsxPath, 'utf-8');

// Fix unclosed img tag that spans multiple lines
content = content.replace(/<img([\s\S]*?)itemprop="image">/g, '<img$1itemprop="image" />');

// Fix stray )} 
content = content.replace('<div className="featured-badge">Featured</div>\n                                )}', '<div className="featured-badge">Featured</div>');

// Fix stray )} if there are any others
content = content.replace(/}\)\s*}\s*\)\}/g, '})}\n');

fs.writeFileSync(jsxPath, content);
console.log('Syntax perfectly fixed!');
