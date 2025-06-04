// src/api/index.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // YOUR BACKEND API BASE URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token from localStorage
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

// Add a response interceptor to handle token expiration/invalidity
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Token expired or invalid.');
            localStorage.removeItem('token');
            // In a real app, you might want to force a redirect to login here
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// IMPORTANT: Default export the api instance
export default api;
