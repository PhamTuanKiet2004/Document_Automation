import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Folder, Mail } from 'lucide-react';
import { templateService } from '../../services/templates';
import { documentService } from '../../services/documents';
import { userService } from '../../services/users';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        templates: 0,
        documents: 0,
        users: 0,
        categories: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            // Load statistics - adjust based on your API
            // This is a placeholder - you'll need to implement actual API endpoints
            setStats({
                templates: 0,
                documents: 0,
                users: 0,
                categories: 0,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Bảng điều khiển Quản trị</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                    to="/admin/templates"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Mẫu văn bản</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.templates}</p>
                        </div>
                        <FileText className="h-12 w-12 text-blue-600" />
                    </div>
                </Link>

                <Link
                    to="/admin/categories"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Danh mục</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                        </div>
                        <Folder className="h-12 w-12 text-green-600" />
                    </div>
                </Link>

                <Link
                    to="/admin/users"
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Người dùng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                        </div>
                        <Users className="h-12 w-12 text-purple-600" />
                    </div>
                </Link>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tài liệu</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
                        </div>
                        <Mail className="h-12 w-12 text-orange-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Quản lý nhanh</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/templates"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <h3 className="font-medium mb-2">Quản lý Mẫu văn bản</h3>
                        <p className="text-sm text-gray-600">Thêm, sửa, xóa mẫu văn bản</p>
                    </Link>
                    <Link
                        to="/admin/categories"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <h3 className="font-medium mb-2">Quản lý Danh mục</h3>
                        <p className="text-sm text-gray-600">Quản lý các danh mục mẫu</p>
                    </Link>
                    <Link
                        to="/admin/users"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <h3 className="font-medium mb-2">Quản lý Người dùng</h3>
                        <p className="text-sm text-gray-600">Xem và quản lý người dùng</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}



