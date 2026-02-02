import { useState, useEffect } from 'react';
import { templateService, Template, Category, TemplateField } from '../../services/templates';
import { categoryService } from '../../services/templates';
import RichTextEditor from '../../components/RichTextEditor';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, FileText, Mail, Maximize, Minimize } from 'lucide-react';

export default function AdminTemplates() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        category_id: string;
        type: 'document' | 'email';
        fields: Partial<TemplateField>[];
    }>({
        title: '',
        content: '',
        category_id: '',
        type: 'document',
        fields: [],
    });
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [templatesData, categoriesData] = await Promise.all([
                templateService.getAll(),
                categoryService.getAll(),
            ]);

            const tData = templatesData.data || templatesData;
            setTemplates(Array.isArray(tData) ? tData : []);

            const cData = categoriesData.data || categoriesData;
            setCategories(Array.isArray(cData) ? cData : []);
        } catch (error: any) {
            console.error(error);
            toast.error('Không thể tải dữ liệu');
            setTemplates([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent, keepOpen = false) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                category_id: Number(formData.category_id),
            };

            if (editingTemplate) {
                await templateService.update(editingTemplate.id, payload as any);
                toast.success('Đã cập nhật mẫu');
                setShowModal(false);
                setEditingTemplate(null);
                setFormData({ title: '', content: '', category_id: '', type: 'document', fields: [] });
            } else {
                await templateService.create(payload as any);
                toast.success(keepOpen ? 'Đã tạo mẫu. Hãy nhập mẫu tiếp theo.' : 'Đã tạo mẫu mới');
                if (keepOpen) {
                    setFormData({
                        title: '',
                        content: '',
                        category_id: formData.category_id, // Keep category
                        type: formData.type, // Keep type
                        fields: []
                    });
                } else {
                    setShowModal(false);
                    setFormData({ title: '', content: '', category_id: '', type: 'document', fields: [] });
                }
            }
            loadData();
        } catch (error: any) {
            toast.error('Không thể lưu mẫu');
        }
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await templateService.delete(deleteId);
            toast.success('Đã xóa mẫu');
            loadData();
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (error: any) {
            toast.error('Không thể xóa mẫu');
        }
    };

    const handleEdit = (template: Template) => {
        setEditingTemplate(template);
        setFormData({
            title: template.title,
            content: template.content,
            category_id: String(template.category_id),
            type: template.type,
            fields: template.fields || [],
        });
        setShowModal(true);
    };

    const handleAddField = () => {
        setFormData({
            ...formData,
            fields: [
                ...formData.fields,
                { field_key: '', label: '', input_type: 'text', is_required: false, options: [] },
            ],
        });
    };

    const handleRemoveField = (index: number) => {
        const newFields = [...formData.fields];
        newFields.splice(index, 1);
        setFormData({ ...formData, fields: newFields });
    };

    const handleFieldChange = (index: number, key: keyof TemplateField, value: any) => {
        const newFields = [...formData.fields];
        newFields[index] = { ...newFields[index], [key]: value };

        // Auto-generate key from label if key is empty
        if (key === 'label' && !newFields[index].field_key) {
            const slug = value.toLowerCase()
                .replace(/đ/g, 'd')
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '_')
                .replace(/^-+|-+$/g, '');
            newFields[index].field_key = slug;
        }

        setFormData({ ...formData, fields: newFields });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Mẫu văn bản</h1>
                <button
                    onClick={() => {
                        setEditingTemplate(null);
                        setFormData({ title: '', content: '', category_id: '', type: 'document', fields: [] });
                        setShowModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Thêm mẫu mới
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tiêu đề
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Loại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {templates.map((template) => (
                                <tr key={template.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {template.type === 'email' ? (
                                                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                                            ) : (
                                                <FileText className="h-5 w-5 text-green-600 mr-2" />
                                            )}
                                            <span className="text-sm font-medium text-gray-900">
                                                {template.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">
                                            {template.type === 'email' ? 'Email' : 'Văn bản'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">
                                            {template.category?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(template)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-gray-100 flex flex-col' : 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50'}`}>
                    <div className={`${isFullScreen ? 'w-full h-full bg-white flex flex-col p-6 overflow-hidden' : 'bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'}`}>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-2xl font-bold">
                                {editingTemplate ? 'Chỉnh sửa mẫu' : 'Thêm mẫu mới'}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                                    title={isFullScreen ? "Thu nhỏ" : "Toàn màn hình"}
                                >
                                    {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                                </button>
                                {!isFullScreen && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingTemplate(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <span className="text-2xl">&times;</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className={`space-y-4 ${isFullScreen ? 'flex flex-row space-y-0 h-full overflow-hidden' : ''}`}>

                            {/* LEFT PANEL (Inputs & Variables) */}
                            <div className={`${isFullScreen ? 'w-96 flex-shrink-0 border-r border-gray-200 p-4 bg-white overflow-y-auto h-full flex flex-col gap-4' : 'space-y-4'}`}>
                                <div className={isFullScreen ? 'space-y-4' : 'grid grid-cols-12 gap-4'}>
                                    <div className={isFullScreen ? 'w-full' : 'col-span-4'}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tiêu đề
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className={isFullScreen ? 'w-full' : 'col-span-4'}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Danh mục
                                        </label>
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) =>
                                                setFormData({ ...formData, category_id: e.target.value })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={isFullScreen ? 'w-full' : 'col-span-4'}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Loại
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) =>
                                                setFormData({ ...formData, type: e.target.value as any })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="document">Văn bản</option>
                                            <option value="email">Email</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Field Manager Section */}
                                <div className={`border-t border-gray-200 pt-4 ${isFullScreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">Quản lý trường biến động</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddField}
                                            className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                        >
                                            + Thêm trường
                                        </button>
                                    </div>

                                    {formData.fields.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">Chưa có trường nào được định nghĩa.</p>
                                    )}

                                    {formData.fields.length > 0 && !isFullScreen && (
                                        <div className="grid grid-cols-12 gap-2 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <div className="col-span-4">Tên hiển thị</div>
                                            <div className="col-span-4">Mã biến (Key)</div>
                                            <div className="col-span-2">Loại</div>
                                            <div className="col-span-2 text-right">Tùy chọn</div>
                                        </div>
                                    )}

                                    <div className={`space-y-3 ${isFullScreen ? 'overflow-y-auto flex-1 pr-1' : 'max-h-60 overflow-y-auto pr-1 pb-2'}`}>
                                        {formData.fields.map((field, index) => (
                                            <div key={index} className={`gap-2 items-start bg-gray-50 p-2 rounded border border-gray-200 ${isFullScreen ? 'flex flex-col' : 'grid grid-cols-12'}`}>
                                                <div className={isFullScreen ? 'w-full' : 'col-span-4'}>
                                                    <input
                                                        type="text"
                                                        placeholder="Tên hiển thị (VD: Họ tên)"
                                                        value={field.label}
                                                        onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                                                        className="w-full text-sm px-2 py-1.5 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div className={isFullScreen ? 'w-full' : 'col-span-4'}>
                                                    <input
                                                        type="text"
                                                        placeholder="Mã biến (VD: ho_ten)"
                                                        value={field.field_key}
                                                        onChange={(e) => handleFieldChange(index, 'field_key', e.target.value)}
                                                        className="w-full text-sm px-2 py-1.5 border rounded bg-gray-100 font-mono text-gray-600"
                                                        required
                                                    />
                                                </div>
                                                <div className={isFullScreen ? 'flex gap-2' : 'col-span-4 contents'}>
                                                    {/* Note: 'contents' only works if parent is grid. If flex, we need wrapper. 
                                                       Let's simplify: in FullScreen, stick to simple stacking or flex row for type/options. 
                                                       Actually, let's keep it simple stack for sidebar.
                                                    */}
                                                    <div className={isFullScreen ? 'w-7/12' : 'col-span-2'}>
                                                        <select
                                                            value={field.input_type}
                                                            onChange={(e) => handleFieldChange(index, 'input_type', e.target.value)}
                                                            className="w-full text-sm px-2 py-1.5 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="text">Text</option>
                                                            <option value="textarea">Dài</option>
                                                            <option value="date">Ngày</option>
                                                            <option value="number">Số</option>
                                                            <option value="email">Email</option>
                                                            <option value="select">List</option>
                                                        </select>
                                                    </div>
                                                    <div className={isFullScreen ? 'w-5/12 flex items-center justify-end space-x-2' : 'col-span-2 flex items-center justify-end space-x-2 pt-1.5'}>
                                                        <label className="flex items-center space-x-1 cursor-pointer" title="Bắt buộc nhập">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.is_required}
                                                                onChange={(e) => handleFieldChange(index, 'is_required', e.target.checked)}
                                                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                            />
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveField(index)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                                            title="Xóa trường"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {field.input_type === 'select' && (
                                                    <div className={isFullScreen ? 'w-full mt-1' : 'col-span-12 mt-1'}>
                                                        <input
                                                            type="text"
                                                            placeholder="Các lựa chọn (cách nhau dấu phẩy)"
                                                            value={field.options?.join(', ') || ''}
                                                            onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                                                            className="w-full text-sm px-2 py-1 border rounded border-blue-200 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {isFullScreen && (
                                    <div className="pt-4 border-t sticky bottom-0 bg-white">
                                        <div className="flex space-x-3">
                                            <button
                                                type="submit"
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                            >
                                                {editingTemplate ? 'Cập nhật' : 'Lưu lại'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowModal(false);
                                                    setEditingTemplate(null);
                                                    setIsFullScreen(false);
                                                }}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT PANEL (RichTextEditor) */}
                            <div className={`${isFullScreen ? 'flex-1 flex flex-col bg-gray-100 overflow-hidden relative' : 'flex flex-col'}`}>
                                {!isFullScreen && (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nội dung
                                        </label>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Soạn thảo nội dung mẫu. Sử dụng các công cụ để định dạng và chèn biến tự động.
                                        </p>
                                    </>
                                )}
                                <div className={isFullScreen ? 'absolute inset-0 flex flex-col' : ''}>
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        variables={formData.fields
                                            .filter(f => f.field_key && f.label)
                                            .map(f => ({ key: f.field_key!, label: f.label! }))
                                        }
                                        height={isFullScreen ? 'auto' : '400px'}
                                        isFullScreen={isFullScreen}
                                        type={formData.type}
                                    />
                                </div>
                            </div>

                            {/* Footer Buttons (Only show here if NOT fullscreen, because fullscreen has them in sidebar) */}
                            {!isFullScreen && (
                                <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-4 flex space-x-3 z-10">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        {editingTemplate ? 'Cập nhật' : 'Lưu lại'}
                                    </button>
                                    {!editingTemplate && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleSubmit(e, true)}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                        >
                                            Lưu & Thêm tiếp
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingTemplate(null);
                                            setIsFullScreen(false);
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div >
            )
            }
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa mẫu này không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteId(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}



