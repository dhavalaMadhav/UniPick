import axios from 'axios';

const isProduction = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (isProduction ? 'https://unipick-backend.onrender.com' : 'http://localhost:5000');

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to attach Bearer token if present
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to fall back between ports 3000 and 5000 in local dev mode
api.interceptors.response.use(
    response => response,
    async error => {
        if (!isProduction && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response)) {
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

