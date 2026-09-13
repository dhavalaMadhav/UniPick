const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.code === 'ERR_NETWORK' || !error.response || error.code === 'ECONNREFUSED') {
            const originalConfig = error.config;
            if (!originalConfig._retry) {
                originalConfig._retry = true;
                const altPort = originalConfig.baseURL.includes('3000') ? '5000' : '3000';
                originalConfig.baseURL = originalConfig.baseURL.replace(/3000|5000/, altPort);
                console.log(`Retrying request on ${originalConfig.baseURL}${originalConfig.url}...`);
                return axios(originalConfig);
            }
        }
        return Promise.reject(error);
    }
);

api.get('/universities')
    .then(res => {
        console.log('SUCCESS! Status:', res.status);
        console.log('Universities count:', (res.data.universities || res.data).length);
    })
    .catch(err => {
        console.error('FAILED:', err.message);
    });
