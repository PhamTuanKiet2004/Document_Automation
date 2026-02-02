import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templateService, Template, Category } from '../services/templates';
import { categoryService } from '../services/templates';
import { Search, FileText, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Templates() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<'document' | 'email' | 'all'>('all');

    useEffect(() => {
        loadData();
    }, [selectedCategory, selectedType]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [templatesData, categoriesData] = await Promise.all([
                templateService.getAll({
                    category_id: selectedCategory || undefined,
                    type: selectedType !== 'all' ? selectedType : undefined,
                    search: searchTerm || undefined,
                }),
                categoryService.getAll(),
            ]);
            setTemplates(templatesData.data || templatesData);
            setCategories(categoriesData.data || categoriesData);
        } catch (error: any) {
            toast.error('Không thể tải danh sách mẫu');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadData();
    };

    const filteredTemplates = templates.filter((template) => {
        if (searchTerm && !template.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Kho mẫu văn bản</h1>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm mẫu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="document">Văn bản</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Không tìm thấy mẫu nào</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <Link
                            key={template.id}
                            to={`/templates/${template.id}`}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center mb-4">
                                {template.type === 'email' ? (
                                    <Mail className="h-8 w-8 text-blue-600" />
                                ) : (
                                    <FileText className="h-8 w-8 text-green-600" />
                                )}
                                <span className="ml-2 text-sm text-gray-500">
                                    {template.type === 'email' ? 'Email' : 'Văn bản'}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.title}</h3>
                            {template.category && (
                                <p className="text-sm text-gray-500 mb-2">
                                    Danh mục: {template.category.name}
                                </p>
                            )}
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {template.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}



