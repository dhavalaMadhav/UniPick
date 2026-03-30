require('dotenv').config();
const mongoose = require('mongoose');
const University = require('./models/University');

async function checkSlugs() {
    await mongoose.connect(process.env.MONGODB_URI);
    const universities = await University.find({}, 'name slug');
    console.log('--- University Slugs ---');
    universities.forEach(u => {
        console.log(`${u.name}: "${u.slug}"`);
    });
    process.exit(0);
}

checkSlugs();
