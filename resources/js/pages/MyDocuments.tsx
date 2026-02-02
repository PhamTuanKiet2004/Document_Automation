import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentService, Document } from '../services/documents';
import toast from 'react-hot-toast';
import { FileText, Download, Mail, Eye, Trash2, Calendar } from 'lucide-react';

export default function MyDocuments() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'draft' | 'completed' | 'sent'>('all');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; docId: number | null }>({
        isOpen: false,
        docId: null,
    });

    useEffect(() => {
        loadDocuments();
    }, [filter]);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const data = await documentService.getAll();
            const docs = data.data || data;
            setDocuments(
                filter === 'all'
                    ? docs
                    : docs.filter((doc: Document) => doc.status === filter)
            );
        } catch (error: any) {
            toast.error('Không thể tải danh sách tài liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        setDeleteModal({ isOpen: true, docId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.docId) return;

        try {
            await documentService.delete(deleteModal.docId);
            toast.success('Đã xóa tài liệu');
            setDeleteModal({ isOpen: false, docId: null });
            loadDocuments();
        } catch (error: any) {
            toast.error('Không thể xóa tài liệu');
        }
    };

    const handleExportPDF = async (doc: Document) => {
        try {
            const blob = await documentService.exportPDF(doc.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${doc.template?.title || 'document'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Đã xuất PDF thành công');
        } catch (error: any) {
            toast.error('Không thể xuất PDF');
        }
    };

    const handleExportWord = async (doc: Document) => {
        try {
            const blob = await documentService.exportWord(doc.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${doc.template?.title || 'document'}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Đã xuất Word thành công');
        } catch (error: any) {
            toast.error('Không thể xuất Word');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            draft: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            sent: 'bg-blue-100 text-blue-800',
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status: string) => {
        const texts = {
            draft: 'Bản nháp',
            completed: 'Hoàn thành',
            sent: 'Đã gửi',
        };
        return texts[status as keyof typeof texts] || status;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tài liệu của tôi</h1>
                <Link
                    to="/templates"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Tạo mới
                </Link>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex space-x-2">
                    {(['all', 'draft', 'completed', 'sent'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg ${filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'Tất cả' : getStatusText(status)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Documents List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có tài liệu nào</p>
                    <Link
                        to="/templates"
                        className="text-blue-600 hover:underline mt-4 inline-block"
                    >
                        Tạo tài liệu mới
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {doc.template?.title || 'Tài liệu không có tiêu đề'}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                                                doc.status
                                            )}`}
                                        >
                                            {getStatusText(doc.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                        <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                        {doc.template && (
                                            <span>
                                                Loại: {doc.template.type === 'email' ? 'Email' : 'Văn bản'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/editor/document/${doc.id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Chỉnh sửa"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleExportPDF(doc)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Xuất PDF"
                                    >
                                        <Download className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleExportWord(doc)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Xuất Word"
                                    >
                                        <FileText className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Xóa"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa tài liệu?</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, docId: null })}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



