const axios = require('axios');

axios.get('http://localhost:3000/api/universities')
    .then(res => {
        console.log('API /api/universities Status:', res.status);
        console.log('Success:', res.data.success);
        console.log('Universities count:', res.data.universities ? res.data.universities.length : 0);
        res.data.universities.forEach((u, i) => console.log(`  ${i+1}. ${u.name} (${u.slug})`));
    })
    .catch(err => console.error('Error:', err.message));
