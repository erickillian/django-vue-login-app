import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

let BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const USE_HTTPS = import.meta.env.VITE_USE_HTTPS === "true";

if (USE_HTTPS) {
    if (!BACKEND_URL.startsWith('http://') && !BACKEND_URL.startsWith('https://')) {
        BACKEND_URL = 'https://' + BACKEND_URL;
    } else {
        BACKEND_URL = BACKEND_URL.replace('http://', 'https://');
    }
}

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

// Add request interceptor to attach CSRF token
api.interceptors.request.use(
    config => {
        // Get csrftoken from cookies
        const match = document.cookie.match(/(^|;) ?csrftoken=([^;]*)(;|$)/);
        if (match) {
            (config.headers as Record<string, string>) = config.headers || {};
            config.headers['X-CSRFToken'] = match[2];
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 403 &&
            !originalRequest._retriedCSRF
        ) {
            originalRequest._retriedCSRF = true;
            try {
                await api.get('/csrf');
            } catch (e) {
                // Ignore CSRF refresh errors
            }
            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default api;