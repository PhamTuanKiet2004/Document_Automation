# Frontend - Document Automation System

Frontend của hệ thống được xây dựng bằng React + TypeScript với Vite và Tailwind CSS.

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy trên port mặc định của Vite (thường là 5173) và sẽ tự động kết nối với Laravel backend.

### 3. Build cho production

```bash
npm run build
```

## Cấu trúc thư mục

```
resources/js/
├── app.tsx              # Entry point
├── App.tsx              # Main App component với routing
├── components/          # Các component tái sử dụng
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProtectedRoute.tsx
│   └── AdminRoute.tsx
├── pages/               # Các trang
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Templates.tsx
│   ├── TemplateDetail.tsx
│   ├── Editor.tsx
│   ├── MyDocuments.tsx
│   └── admin/
│       ├── Dashboard.tsx
│       ├── Templates.tsx
│       ├── Categories.tsx
│       └── Users.tsx
├── services/            # API services
│   ├── api.ts
│   ├── auth.ts
│   ├── templates.ts
│   ├── documents.ts
│   └── users.ts
└── hooks/               # Custom hooks
    └── useAuth.tsx
```

## Tính năng

### Cho Guest (Khách)
- Xem trang chủ
- Xem danh sách mẫu văn bản công khai
- Đăng ký/Đăng nhập

### Cho User (Người dùng)
- Tất cả tính năng của Guest
- Soạn thảo văn bản với Dynamic Form Rendering
- Xem trước văn bản
- Xuất PDF/Word
- Gửi email trực tiếp
- Quản lý lịch sử văn bản (My Documents)

### Cho Admin (Quản trị viên)
- Tất cả tính năng của User
- Quản lý mẫu văn bản (CRUD)
- Quản lý danh mục (CRUD)
- Quản lý người dùng (Xem, Khóa/Mở khóa)

## API Endpoints

Frontend gọi các API endpoints sau (cần được implement ở backend):

### Authentication
- `POST /api/login` - Đăng nhập
- `POST /api/register` - Đăng ký
- `POST /api/logout` - Đăng xuất
- `GET /api/user` - Lấy thông tin user hiện tại

### Templates
- `GET /api/templates` - Lấy danh sách mẫu
- `GET /api/templates/:id` - Lấy chi tiết mẫu
- `POST /api/templates` - Tạo mẫu mới (Admin)
- `PUT /api/templates/:id` - Cập nhật mẫu (Admin)
- `DELETE /api/templates/:id` - Xóa mẫu (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Tạo danh mục mới (Admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin)

### Documents
- `GET /api/documents` - Lấy danh sách tài liệu của user
- `GET /api/documents/:id` - Lấy chi tiết tài liệu
- `POST /api/documents` - Tạo tài liệu mới
- `PUT /api/documents/:id` - Cập nhật tài liệu
- `DELETE /api/documents/:id` - Xóa tài liệu
- `GET /api/documents/:id/export/pdf` - Xuất PDF
- `GET /api/documents/:id/export/word` - Xuất Word
- `POST /api/documents/:id/send-email` - Gửi email

### Users (Admin only)
- `GET /api/admin/users` - Lấy danh sách users
- `GET /api/admin/users/:id` - Lấy chi tiết user
- `POST /api/admin/users/:id/toggle-status` - Khóa/Mở khóa user

## Lưu ý

1. **CSRF Token**: Frontend tự động lấy CSRF token từ meta tag và gửi kèm trong các request.

2. **Authentication**: Sử dụng Laravel session-based authentication. Cookies được tự động gửi kèm với mỗi request.

3. **Routing**: Sử dụng React Router cho client-side routing. Laravel route catch-all (`/{any?}`) sẽ trả về React app để React Router xử lý.

4. **Dynamic Form Rendering**: Form được tự động sinh dựa trên `template_fields` của mẫu. Hỗ trợ các loại input:
   - text
   - textarea
   - date
   - email
   - number
   - select (với options)

5. **Template Variables**: Trong nội dung mẫu, sử dụng cú pháp `{{variable_name}}` để đánh dấu các biến sẽ được thay thế.

## Development

Khi phát triển, đảm bảo:
- Laravel backend đang chạy
- Vite dev server đang chạy (`npm run dev`)
- CORS được cấu hình đúng trong Laravel (nếu cần)

## Production Build

Sau khi build, các file sẽ được tạo trong `public/build/`. Laravel sẽ tự động phục vụ các file này.



