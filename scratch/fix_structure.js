const fs = require('fs');
const path = require('path');

const cdPath = path.join(__dirname, '../frontend/src/pages/CourseDetail.jsx');
if (fs.existsSync(cdPath)) {
    let cd = fs.readFileSync(cdPath, 'utf-8');
    // Replace everything inside universities-section
    cd = cd.replace(/<section className="universities-section">[\s\S]*?<\/section>/, `<section className="universities-section">
        <h2 className="section-title">Top Universities</h2>
        <div className="no-universities">
            <h3>No Universities Available</h3>
        </div>
    </section>`);
    fs.writeFileSync(cdPath, cd);
}

const udPath = path.join(__dirname, '../frontend/src/pages/UniversityDetail.jsx');
if (fs.existsSync(udPath)) {
    let ud = fs.readFileSync(udPath, 'utf-8');
    // For UniversityDetail, the issue is a lingering const programDetails = {
    // Just replace it with a comment
    ud = ud.replace(/const programDetails = {[\s\S]*?};/g, '{/* programDetails removed */}');
    fs.writeFileSync(udPath, ud);
}

console.log('Final structure fix applied');
