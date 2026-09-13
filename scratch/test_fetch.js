const http = require('http');

http.get('http://127.0.0.1:5000/universities', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('STATUS 127.0.0.1 /universities:', res.statusCode);
        console.log('DATA 127.0.0.1 /universities length:', data.length);
        console.log('DATA snippet:', data.substring(0, 300));
    });
}).on('error', err => {
    console.error('ERROR 127.0.0.1 /universities:', err.message);
});

http.get('http://127.0.0.1:5000/api/universities', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('STATUS 127.0.0.1 /api/universities:', res.statusCode);
        console.log('DATA 127.0.0.1 /api/universities length:', data.length);
    });
}).on('error', err => {
    console.error('ERROR 127.0.0.1 /api/universities:', err.message);
});
