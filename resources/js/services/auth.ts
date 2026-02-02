import api from './api';

export interface User {
    id: number;
    name: string;
    email: string;
    department?: string;
    role: 'admin' | 'user';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    department?: string;
}

export const authService = {
    async login(credentials: LoginCredentials) {
        const response = await api.post('/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    async register(data: RegisterData) {
        const response = await api.post('/register', data);
        // Note: We removed auto-login, so we don't store token here unless we want to. 
        // But backend sends it. Let's store it just in case, OR since we redirect to login, 
        // maybe we shouldn't? 
        // Actually, the user requirement is "redirect to login", so we should NOT store token here 
        // to force them to login. 
        // However, the previous step removed auto-login from useAuth but AuthController still returns token.
        // Let's NOT store token on register to be consistent with "please login again".
        return response.data;
    },

    async logout() {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('token');
        }
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await api.get('/user');
            return response.data;
        } catch (error) {
            return null;
        }
    },
};



