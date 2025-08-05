import axios from 'axios';

// Take note: in production this should be an env variable
const API_URL = 'http://localhost:5281/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;