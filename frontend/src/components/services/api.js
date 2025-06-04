// src/api/index.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Token expired or invalid.');
            localStorage.removeItem('token');
            // You might want to force a logout or redirect here
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; // IMPORTANT: export default the api instance
