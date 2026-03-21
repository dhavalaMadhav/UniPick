const mongoose = require('mongoose');
const dotenv = require('dotenv');
const University = require('./models/University');
const slugify = require('slugify');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const universities = await University.find({ slug: { $exists: false } });
        console.log(`Found ${universities.length} universities without slugs`);

        for (const uni of universities) {
            uni.slug = slugify(uni.name, { lower: true, strict: true });
            await uni.save();
            console.log(`Updated slug for ${uni.name}: ${uni.slug}`);
        }

        console.log('Migration complete');
        process.exit(0);
    })
    .catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
