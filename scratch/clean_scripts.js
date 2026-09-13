const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src');

function cleanScripts(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            cleanScripts(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            
            // Remove everything after the first wrapper.appendChild(slide) if it's the exposed script
            if (file === 'UniversityDetail.jsx') {
                content = content.replace(/wrapper\.appendChild\(slide\);[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<\/>\s*\);\s*\})/g, '{/* exposed script removed */}');
            }
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

cleanScripts(srcDir);
console.log('Clean scripts applied');
