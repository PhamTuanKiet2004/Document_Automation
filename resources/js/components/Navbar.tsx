import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileText, Home, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Document Automation</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!user ? (
                            // Guest Menu
                            <>
                                <Link
                                    to="/"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    <Home className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/templates"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    Mẫu văn bản
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        ) : isAdmin ? (
                            // Admin Menu
                            <>
                                <Link
                                    to="/admin"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    title="Bảng điều khiển"
                                >
                                    <Home className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/admin/templates"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    Quản lý Mẫu
                                </Link>
                                <Link
                                    to="/admin/categories"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    Danh mục
                                </Link>
                                <Link
                                    to="/admin/users"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    Người dùng
                                </Link>
                            </>
                        ) : (
                            // Regular User Menu
                            <>
                                <Link
                                    to="/"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    <Home className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/templates"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    Mẫu văn bản
                                </Link>
                                <Link
                                    to="/my-documents"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                >
                                    Tài liệu của tôi
                                </Link>
                            </>
                        )}

                        {user && (
                            <div className="flex items-center space-x-2 ml-4">
                                <div className="flex items-center space-x-2 px-3 py-2">
                                    <User className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm text-gray-700">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        {!user ? (
                            <>
                                <Link
                                    to="/"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    to="/templates"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Mẫu văn bản
                                </Link>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Đăng ký
                                </Link>
                            </>
                        ) : isAdmin ? (
                            <>
                                <Link
                                    to="/admin"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Bảng điều khiển
                                </Link>
                                <Link
                                    to="/admin/templates"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Quản lý Mẫu
                                </Link>
                                <Link
                                    to="/admin/categories"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Danh mục
                                </Link>
                                <Link
                                    to="/admin/users"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Quản lý Người dùng
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    to="/templates"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Mẫu văn bản
                                </Link>
                                <Link
                                    to="/my-documents"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Tài liệu của tôi
                                </Link>
                            </>
                        )}

                        {user && (
                            <div className="border-t border-gray-200 mt-2 pt-2">
                                <div className="px-3 py-2 text-base font-medium text-gray-700">
                                    {user.name}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
