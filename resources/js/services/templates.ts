import api from './api';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface TemplateField {
    id: number;
    field_key: string;
    label: string;
    input_type: 'text' | 'textarea' | 'date' | 'select' | 'email' | 'number';
    is_required: boolean;
    options?: string[]; // For select type
}

export interface Template {
    id: number;
    category_id: number;
    category?: Category;
    title: string;
    content: string;
    type: 'document' | 'email';
    fields?: TemplateField[];
    created_at: string;
    updated_at: string;
}

export const templateService = {
    async getAll(params?: { category_id?: number; search?: string; type?: string }) {
        const response = await api.get('/templates', { params });
        return response.data;
    },

    async getById(id: number) {
        const response = await api.get(`/templates/${id}`);
        return response.data;
    },

    async create(data: Partial<Template>) {
        const response = await api.post('/templates', data);
        return response.data;
    },

    async update(id: number, data: Partial<Template>) {
        const response = await api.put(`/templates/${id}`, data);
        return response.data;
    },

    async delete(id: number) {
        const response = await api.delete(`/templates/${id}`);
        return response.data;
    },
};

export const categoryService = {
    async getAll() {
        const response = await api.get('/categories');
        return response.data;
    },

    async create(data: Partial<Category>) {
        const response = await api.post('/categories', data);
        return response.data;
    },

    async update(id: number, data: Partial<Category>) {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    async delete(id: number) {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};



