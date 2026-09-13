const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src');

function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            
            // Blast away any remaining <% and %>
            content = content.replace(/<%[\s\S]*?%>/g, '');
            content = content.replace(/<%.*/g, '');
            
            // Fix unclosed img tags
            content = content.replace(/<img([^>]+?)(?<!\/)>/gi, '<img$1 />');
            
            // Fix unclosed hr, br, input
            content = content.replace(/<hr([^>]*?)(?<!\/)>/gi, '<hr$1 />');
            content = content.replace(/<br([^>]*?)(?<!\/)>/gi, '<br$1 />');
            content = content.replace(/<input([^>]+?)(?<!\/)>/gi, '<input$1 />');
            
            // Fix specific script line in UniversityDetail
            content = content.replace(/programCounts\['\{ program \}'\] = \(programCounts\['\{ program \}'\] \|\| 0\) \+ 1;/g, '');
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

fixFiles(srcDir);
console.log('Final blast applied');
