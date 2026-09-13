import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Response interceptor to fall back between ports 3000 and 5000 if server port changes
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
            const originalConfig = error.config;
            if (!originalConfig._retry) {
                originalConfig._retry = true;
                const currentBase = originalConfig.baseURL || API_BASE_URL;
                const altPort = currentBase.includes('3000') ? '5000' : '3000';
                originalConfig.baseURL = currentBase.replace(/3000|5000/, altPort);
                try {
                    return await axios(originalConfig);
                } catch (retryErr) {
                    return Promise.reject(retryErr);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
