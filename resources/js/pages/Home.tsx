import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileText, Mail, FileCheck, Search } from 'lucide-react';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Hệ thống Soạn thảo Văn bản Hành chính
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Tạo văn bản và email chuyên nghiệp một cách nhanh chóng và dễ dàng
                </p>
                {!user && (
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/register"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Bắt đầu ngay
                        </Link>
                        <Link
                            to="/templates"
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                        >
                            Xem mẫu
                        </Link>
                    </div>
                )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                        <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Kho mẫu phong phú</h3>
                    <p className="text-gray-600">
                        Hàng trăm mẫu văn bản hành chính, hợp đồng, email được cập nhật thường xuyên
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                        <Search className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Tìm kiếm thông minh</h3>
                    <p className="text-gray-600">
                        Tìm kiếm và lọc mẫu theo danh mục, từ khóa một cách nhanh chóng
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                        <FileCheck className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Soạn thảo tự động</h3>
                    <p className="text-gray-600">
                        Điền thông tin vào form, hệ thống tự động tạo văn bản hoàn chỉnh
                    </p>
                </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-8">Cách sử dụng</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 text-xl font-bold">
                            1
                        </div>
                        <h4 className="font-semibold mb-2">Chọn mẫu</h4>
                        <p className="text-sm text-gray-600">Tìm và chọn mẫu văn bản phù hợp</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 text-xl font-bold">
                            2
                        </div>
                        <h4 className="font-semibold mb-2">Điền thông tin</h4>
                        <p className="text-sm text-gray-600">Điền các thông tin vào form</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 text-xl font-bold">
                            3
                        </div>
                        <h4 className="font-semibold mb-2">Xem trước</h4>
                        <p className="text-sm text-gray-600">Kiểm tra nội dung trước khi xuất</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 text-xl font-bold">
                            4
                        </div>
                        <h4 className="font-semibold mb-2">Xuất bản</h4>
                        <p className="text-sm text-gray-600">Tải về PDF/Word hoặc gửi email</p>
                    </div>
                </div>
            </div>
        </div>
    );
}



