const fs = require('fs');
const path = require('path');

const udPath = path.join(__dirname, '../frontend/src/pages/UniversityDetail.jsx');
if (fs.existsSync(udPath)) {
    let ud = fs.readFileSync(udPath, 'utf-8');
    ud = ud.replace(/const program = programDetails\[programCode\] \|\| \{ name: programCode, type: 'Program', duration: 'Varies', seats: 'Available', icon: 'fas fa-graduation-cap' \};\s*\}/, '{/* program block removed */}');
    fs.writeFileSync(udPath, ud);
}

console.log('Fixed UniversityDetail.jsx');
