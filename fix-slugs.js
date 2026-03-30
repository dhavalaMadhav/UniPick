require('dotenv').config();
const mongoose = require('mongoose');
const University = require('./models/University');
const slugify = require('slugify');

async function fixSlugs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const universities = await University.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
        console.log(`🔍 Found ${universities.length} universities without slugs`);

        for (const uni of universities) {
            uni.slug = slugify(uni.name, { lower: true, strict: true });
            await uni.save();
            console.log(`✨ Updated slug for: ${uni.name} -> ${uni.slug}`);
        }

        const all = await University.find({}, 'name slug');
        console.log('📊 Current Universities in DB:');
        console.table(all.map(u => ({ name: u.name, slug: u.slug })));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing slugs:', error);
        process.exit(1);
    }
}

fixSlugs();
