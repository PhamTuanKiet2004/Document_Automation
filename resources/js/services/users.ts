import api from './api';

export interface User {
    id: number;
    name: string;
    email: string;
    department?: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

export const userService = {
    async getAll() {
        const response = await api.get('/admin/users');
        return response.data;
    },

    async getById(id: number) {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    async toggleStatus(id: number) {
        const response = await api.post(`/admin/users/${id}/toggle-status`);
        return response.data;
    },
};



