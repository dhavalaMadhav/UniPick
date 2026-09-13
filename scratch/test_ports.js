const http = require('http');

[3000, 5000, 5001, 8000].forEach(port => {
    http.get(`http://127.0.0.1:${port}/universities`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Port ${port} /universities SUCCESS: status ${res.statusCode}, length ${data.length}`);
        });
    }).on('error', err => {
        console.error(`Port ${port} /universities ERROR:`, err.message);
    });

    http.get(`http://127.0.0.1:${port}/api/universities`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Port ${port} /api/universities SUCCESS: status ${res.statusCode}, length ${data.length}`);
        });
    }).on('error', err => {
        console.error(`Port ${port} /api/universities ERROR:`, err.message);
    });
});
