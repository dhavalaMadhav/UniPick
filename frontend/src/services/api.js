import axios from 'axios';

const isProduction = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (isProduction ? 'https://unipick-backend.onrender.com' : 'http://localhost:5000');

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60s timeout for Render cold-starts
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to attach Bearer token and log requests
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log(`📡 [API Request]: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    error => {
        console.error('❌ [API Request Error]:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with automatic retries for Render cold starts
api.interceptors.response.use(
    response => {
        console.log(`✅ [API Response Success]: ${response.config.url}`, response.status);
        return response;
    },
    async error => {
        const config = error.config || {};
        
        console.error(`❌ [API Response Error]: ${config.url || 'Unknown'}`, {
            status: error.response?.status,
            message: error.message,
            code: error.code
        });

        // Retry logic for Render cold starts (Network errors, timeouts, 502, 503, 504)
        const isServerColdStarting = !error.response || [502, 503, 504].includes(error.response?.status) || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
        
        if (isServerColdStarting && (!config._retryCount || config._retryCount < 3)) {
            config._retryCount = (config._retryCount || 0) + 1;
            console.warn(`🔄 Render cold-start retry attempt ${config._retryCount}/3 for ${config.url}... Waiting 2.5s`);
            
            await new Promise(resolve => setTimeout(resolve, 2500));
            return api(config);
        }

        // Local dev port fallback (3000 <-> 5000)
        if (!isProduction && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response)) {
            if (!config._portRetry) {
                config._portRetry = true;
                const currentBase = config.baseURL || API_BASE_URL;
                const altPort = currentBase.includes('3000') ? '5000' : '3000';
                config.baseURL = currentBase.replace(/3000|5000/, altPort);
                console.warn(`🔄 Retrying dev API on alt port: ${config.baseURL}${config.url}`);
                try {
                    return await axios(config);
                } catch (retryErr) {
                    return Promise.reject(retryErr);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;


