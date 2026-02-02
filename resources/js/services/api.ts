import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor để thêm CSRF token
api.interceptors.request.use(
    (config) => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }

        const bearerToken = localStorage.getItem('token');
        if (bearerToken) {
            config.headers.Authorization = `Bearer ${bearerToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Unauthorized - để các component tự xử lý redirect (ví dụ ProtectedRoute)
        // window.location.href = '/login';
        return Promise.reject(error);
    }
);

export default api;



