<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Regular User
        User::create([
            'name' => 'Test User',
            'email' => 'user@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Seed Categories
        $hrCategory = \App\Models\Category::create([
            'name' => 'Human Resources',
            'slug' => 'human-resources',
            'description' => 'Templates related to HR',
        ]);

        $legalCategory = \App\Models\Category::create([
            'name' => 'Legal',
            'slug' => 'legal',
            'description' => 'Legal document templates',
        ]);

        // Seed Template: Employment Contract
        $contractTemplate = \App\Models\Template::create([
            'category_id' => $hrCategory->id,
            'title' => 'Hợp đồng lao động',
            'type' => 'document',
            'content' => '
                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="text-transform: uppercase; font-weight: bold; margin: 0;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p style="font-weight: bold; margin: 0;">Độc lập - Tự do - Hạnh phúc</p>
                    <p style="margin: 0;">-----o0o-----</p>
                </div>
                
                <h1 style="text-align: center; text-transform: uppercase;">HỢP ĐỒNG LAO ĐỘNG</h1>
                
                <p>Hôm nay, ngày {{ start_date }}, tại Văn phòng Công ty ABC, chúng tôi gồm:</p>
                
                <p><strong>BÊN A (Người sử dụng lao động): CÔNG TY ABC</strong></p>
                <p>Đại diện: Ông/Bà Giám đốc nhân sự</p>
                <p>Địa chỉ: Hà Nội, Việt Nam</p>
                
                <p><strong>BÊN B (Người lao động): {{ employee_name }}</strong></p>
                <p>Sinh ngày: {{ birth_date }} CMND/CCCD số: {{ id_number }}</p>
                <p>Địa chỉ thường trú: {{ address }}</p>
                
                <p>Thỏa thuận ký kết hợp đồng lao động và cam kết làm đúng những điều khoản sau đây:</p>
                
                <p><strong>Điều 1: Công việc và địa điểm làm việc</strong></p>
                <p>- Chức vụ (Vị trí chuyên môn): {{ position }}</p>
                <p>- Địa điểm làm việc: Trụ sở chính công ty ABC</p>
                
                <p><strong>Điều 2: Lương và phụ cấp</strong></p>
                <p>- Mức lương cơ bản: {{ salary }} VNĐ/tháng</p>
                <p>- Hình thức trả lương: Chuyển khoản hoặc tiền mặt</p>
                
                <p><strong>Điều 3: Thời hạn hợp đồng</strong></p>
                <p>- Ngày bắt đầu làm việc: {{ start_date }}</p>
                
                <p><strong>Điều 4: Thỏa thuận khác</strong></p>
                <p>{{ other_terms }}</p>
                
                <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                    <div style="text-align: center;">
                        <p><strong>NGƯỜI LAO ĐỘNG</strong></p>
                        <p>(Ký, ghi rõ họ tên)</p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>NGƯỜI SỬ DỤNG LAO ĐỘNG</strong></p>
                        <p>(Ký, đóng dấu)</p>
                    </div>
                </div>
            '
        ]);

        $fields = [
            ['key' => 'employee_name', 'label' => 'Họ và tên nhân viên', 'type' => 'text', 'required' => true],
            ['key' => 'birth_date', 'label' => 'Ngày sinh', 'type' => 'date', 'required' => true],
            ['key' => 'id_number', 'label' => 'Số CMND/CCCD', 'type' => 'text', 'required' => true],
            ['key' => 'address', 'label' => 'Địa chỉ thường trú', 'type' => 'text', 'required' => true],
            ['key' => 'position', 'label' => 'Chức vụ', 'type' => 'text', 'required' => true],
            ['key' => 'salary', 'label' => 'Mức lương cơ bản', 'type' => 'number', 'required' => true],
            ['key' => 'start_date', 'label' => 'Ngày bắt đầu', 'type' => 'date', 'required' => true],
            ['key' => 'other_terms', 'label' => 'Thỏa thuận khác (nếu có)', 'type' => 'textarea', 'required' => false],
        ];

        foreach ($fields as $field) {
            \App\Models\TemplateField::create([
                'template_id' => $contractTemplate->id,
                'field_key' => $field['key'],
                'label' => $field['label'],
                'input_type' => $field['type'],
                'is_required' => $field['required'],
            ]);
        }

        // Seed Template: Leave Request
        $leaveTemplate = \App\Models\Template::create([
            'category_id' => $hrCategory->id,
            'title' => 'Đơn xin nghỉ phép',
            'type' => 'document',
            'content' => '
                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="text-transform: uppercase; font-weight: bold; margin: 0;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p style="font-weight: bold; margin: 0;">Độc lập - Tự do - Hạnh phúc</p>
                    <p style="margin: 0;">-----o0o-----</p>
                </div>

                <h1 style="text-align: center; text-transform: uppercase;">ĐƠN XIN NGHỈ PHÉP</h1>
                
                <p><strong>Kính gửi:</strong> Ban Giám đốc Công ty ABC</p>
                <p><strong>Đồng kính gửi:</strong> Phòng Nhân sự</p>
                
                <p>Tôi tên là: {{ employee_name }}</p>
                <p>Chức vụ: Nhân viên</p>
                
                <p>Tôi làm đơn này xin phép được nghỉ nghỉ phép:</p>
                <p>- Từ ngày: {{ start_date }}</p>
                <p>- Đến ngày: {{ end_date }}</p>
                
                <p>Lý do xin nghỉ: {{ reason }}</p>
                
                <p>Tôi cam kết đã bàn giao công việc và giữ liên lạc trong thời gian nghỉ.</p>
                <p>Kính mong Ban Giám đốc xem xét và phê duyệt.</p>
                
                <div style="text-align: right; margin-top: 20px;">
                    <p>......., ngày ...... tháng ...... năm ......</p>
                    <p><strong>Người làm đơn</strong></p>
                    <p>(Ký tên)</p>
                </div>
            '
        ]);

        \App\Models\TemplateField::create([
            'template_id' => $leaveTemplate->id,
            'field_key' => 'employee_name',
            'label' => 'Họ tên',
            'input_type' => 'text',
        ]);
        \App\Models\TemplateField::create([
            'template_id' => $leaveTemplate->id,
            'field_key' => 'start_date',
            'label' => 'Từ ngày',
            'input_type' => 'date',
        ]);
        \App\Models\TemplateField::create([
            'template_id' => $leaveTemplate->id,
            'field_key' => 'end_date',
            'label' => 'Đến ngày',
            'input_type' => 'date',
        ]);
        \App\Models\TemplateField::create([
            'template_id' => $leaveTemplate->id,
            'field_key' => 'reason',
            'label' => 'Lý do',
            'input_type' => 'textarea',
        ]);
    }
}
