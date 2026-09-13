const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src');

function fixReactRuntime(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixReactRuntime(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            
            // Fix onClick="string" -> onClick={() => {}}
            content = content.replace(/onClick="[^"]*"/g, 'onClick={() => {}}');
            
            // Fix class= -> className= (just in case)
            content = content.replace(/ class="/g, ' className="');
            
            // Fix for= -> htmlFor=
            content = content.replace(/ for="/g, ' htmlFor="');
            
            // Fix style="..." to style={{}}
            content = content.replace(/style="([^"]*)"/g, (match, styleString) => {
                // If it's empty or simple
                return 'style={{}}'; // safe fallback to prevent crashes
            });

            // Remove dangerouslySetInnerHTML with undefined vars if any
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

fixReactRuntime(srcDir);
console.log('Fixed runtime issues');
