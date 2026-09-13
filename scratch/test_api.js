const axios = require('axios');

axios.get('http://localhost:3000/api/universities')
    .then(res => {
        console.log('Status:', res.status);
        console.log('Res data keys:', Object.keys(res.data));
        console.log('Universities count:', res.data.universities ? res.data.universities.length : 'none');
        if (res.data.universities && res.data.universities.length > 0) {
            console.log('First uni sample:', res.data.universities[0]);
        }
    })
    .catch(err => console.error(err.message));
