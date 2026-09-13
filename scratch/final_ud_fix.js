const fs = require('fs');
const path = require('path');

const udPath = path.join(__dirname, '../frontend/src/pages/UniversityDetail.jsx');
if (fs.existsSync(udPath)) {
    let ud = fs.readFileSync(udPath, 'utf-8');
    
    // Replace the problematic program iteration block
    ud = ud.replace(/university\.programmes\.forEach\(programCode => \{[\s\S]*?\}\);/g, '{/* program iteration removed */}');
    
    fs.writeFileSync(udPath, ud);
}

console.log('Final UniversityDetail fix applied');
