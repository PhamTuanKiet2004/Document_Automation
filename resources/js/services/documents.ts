import api from './api';

export interface Document {
    id: number;
    user_id: number;
    template_id: number;
    template?: {
        id: number;
        title: string;
        type: 'document' | 'email';
    };
    content_data: Record<string, any>;
    custom_content?: string;
    file_path?: string;
    status: 'draft' | 'completed' | 'sent';
    created_at: string;
    updated_at: string;
}

export interface DocumentCreateData {
    template_id: number;
    content_data: Record<string, any>;
    custom_content?: string;
    status?: 'draft' | 'completed' | 'sent';
}

export const documentService = {
    async getAll() {
        const response = await api.get('/documents');
        return response.data;
    },

    async getById(id: number) {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },

    async create(data: DocumentCreateData) {
        const response = await api.post('/documents', data);
        return response.data;
    },

    async update(id: number, data: Partial<DocumentCreateData>) {
        const response = await api.put(`/documents/${id}`, data);
        return response.data;
    },

    async delete(id: number) {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },

    async exportPDF(documentId: number) {
        const response = await api.get(`/documents/${documentId}/export/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },

    async exportWord(documentId: number) {
        const response = await api.get(`/documents/${documentId}/export/word`, {
            responseType: 'blob',
        });
        return response.data;
    },

    async sendEmail(documentId: number, recipientEmail: string, subject?: string, cc?: string[], bcc?: string[], attachments?: File[]) {
        const formData = new FormData();
        formData.append('recipient_email', recipientEmail);
        if (subject) formData.append('subject', subject);

        if (cc && cc.length > 0) {
            cc.forEach(email => formData.append('cc[]', email));
        }

        if (bcc && bcc.length > 0) {
            bcc.forEach(email => formData.append('bcc[]', email));
        }

        if (attachments && attachments.length > 0) {
            attachments.forEach(file => formData.append('attachments[]', file));
        }

        const response = await api.post(`/documents/${documentId}/send-email`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};



