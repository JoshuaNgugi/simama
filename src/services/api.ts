import axios from 'axios';
import Cookies from 'js-cookie';

// Take note: in production this should be an env variable
const API_URL = 'http://localhost:5281';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to automatically add the Authorization header
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = Cookies.get('token');

        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default api;