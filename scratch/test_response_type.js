const axios = require('axios');

axios.get('http://localhost:3000/universities', { headers: { 'Accept': 'application/json' } })
    .then(res => {
        console.log('Type of res.data:', typeof res.data);
        console.log('Is res.data object?', typeof res.data === 'object');
        console.log('Keys of res.data:', Object.keys(res.data));
        console.log('Universities length:', res.data.universities ? res.data.universities.length : 'NO UNIVERSITIES KEY');
    })
    .catch(err => console.error(err.message));

axios.get('http://localhost:3000/api/universities', { headers: { 'Accept': 'application/json' } })
    .then(res => {
        console.log('API /api/universities length:', res.data.universities ? res.data.universities.length : 'NO UNIVERSITIES KEY');
    })
    .catch(err => console.error(err.message));
