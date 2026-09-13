const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../frontend/src/pages/Home.jsx');
if (fs.existsSync(homePath)) {
    let content = fs.readFileSync(homePath, 'utf-8');
    const dummy = `
    const testimonial = { name: 'John Doe', course: 'B.Tech', university: 'Test Univ', image: '', review: 'Test review' };
    `;
    content = content.replace('export default function Home() {', 'export default function Home() {\n' + dummy);
    fs.writeFileSync(homePath, content);
}

const uniPath = path.join(__dirname, '../frontend/src/pages/Universities.jsx');
if (fs.existsSync(uniPath)) {
    let content = fs.readFileSync(uniPath, 'utf-8');
    const dummy = `
    const university = { name: 'Test Univ', slug: 'test', location: 'City', state: 'State', type: 'Private', globalRanking: 1, rating: 5, fee: 100000, bannerImage: '' };
    `;
    content = content.replace('export default function Universities() {', 'export default function Universities() {\n' + dummy);
    fs.writeFileSync(uniPath, content);
}

const coursePath = path.join(__dirname, '../frontend/src/pages/Courses.jsx');
if (fs.existsSync(coursePath)) {
    let content = fs.readFileSync(coursePath, 'utf-8');
    const dummy = `
    const categoryName = 'Category';
    const category = 'category';
    const course = { name: 'Test Course', slug: 'test', description: 'Desc', icon: 'fas fa-book', duration: '4 Years', degree: 'Bachelors' };
    const courseType = 'Type';
    const courseTypeTitle = 'Title';
    `;
    content = content.replace('export default function Courses() {', 'export default function Courses() {\n' + dummy);
    fs.writeFileSync(coursePath, content);
}

console.log('Dummy variables injected to prevent crashes.');
