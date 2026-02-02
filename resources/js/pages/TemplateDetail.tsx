import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { templateService, Template } from '../services/templates';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FileText, Mail, ArrowLeft } from 'lucide-react';

export default function TemplateDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadTemplate();
        }
    }, [id]);

    const loadTemplate = async () => {
        try {
            setLoading(true);
            const data = await templateService.getById(Number(id));
            setTemplate(data.data || data);
        } catch (error: any) {
            toast.error('Không thể tải thông tin mẫu');
        } finally {
            setLoading(false);
        }
    };

    const handleStartEditing = () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
            navigate('/login');
            return;
        }
        navigate(`/editor/${id}`);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <p className="text-gray-500">Không tìm thấy mẫu</p>
                    <Link to="/templates" className="text-blue-600 hover:underline mt-4 inline-block">
                        Quay lại danh sách mẫu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
                to="/templates"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại danh sách mẫu
            </Link>

            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                    {template.type === 'email' ? (
                        <Mail className="h-10 w-10 text-blue-600" />
                    ) : (
                        <FileText className="h-10 w-10 text-green-600" />
                    )}
                    <div className="ml-4">
                        <h1 className="text-3xl font-bold text-gray-900">{template.title}</h1>
                        {template.category && (
                            <p className="text-gray-500 mt-1">Danh mục: {template.category.name}</p>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Nội dung mẫu:</h2>
                    <div className="mb-6 flex justify-center bg-gray-100 p-8 rounded-lg overflow-auto">
                        <div
                            className="prose max-w-none bg-white shadow-lg mx-auto"
                            style={{
                                width: '210mm',
                                minHeight: '297mm',
                                padding: '20mm 20mm', // 2cm margins
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '12pt',
                                lineHeight: '1.5'
                            }}
                            dangerouslySetInnerHTML={{
                                __html: template.content.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
                                    const field = template.fields?.find(f => f.field_key === key);
                                    const label = field ? field.label : key;
                                    return `<span class="inline-block px-2 py-0.5 mx-1 bg-blue-100 text-blue-800 rounded font-medium text-sm border border-blue-200" title="${key}">[${label}]</span>`;
                                })
                            }}
                        />
                    </div>
                </div>

                {template.fields && template.fields.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Các trường cần điền:</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {template.fields.map((field) => (
                                <div key={field.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center justify-between hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{field.label}</span>
                                        <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{field.input_type}</span>
                                    </div>
                                    {field.is_required && (
                                        <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                            Bắt buộc
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleStartEditing}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Bắt đầu soạn thảo
                    </button>
                </div>
            </div>
        </div>
    );
}



