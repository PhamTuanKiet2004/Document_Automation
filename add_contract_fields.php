<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Template;
use App\Models\TemplateField;

$contract = Template::where('title', 'Hợp đồng lao động')->first();

if ($contract) {
    // 1. Update Content
    $newContent = '
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
    ';
    $contract->update(['content' => $newContent]);

    // 2. Add New Fields (checking existence to avoid duplicates if run multiple times)
    $fields = [
        ['key' => 'birth_date', 'label' => 'Ngày sinh', 'type' => 'date', 'required' => true],
        ['key' => 'id_number', 'label' => 'Số CMND/CCCD', 'type' => 'text', 'required' => true],
        ['key' => 'address', 'label' => 'Địa chỉ thường trú', 'type' => 'text', 'required' => true],
        ['key' => 'other_terms', 'label' => 'Thỏa thuận khác (nếu có)', 'type' => 'textarea', 'required' => false],
    ];

    foreach ($fields as $field) {
        TemplateField::firstOrCreate(
            [
                'template_id' => $contract->id,
                'field_key' => $field['key']
            ],
            [
                'label' => $field['label'],
                'input_type' => $field['type'],
                'is_required' => $field['required']
            ]
        );
    }

    echo "Contract fields updated.";
} else {
    echo "Contract template not found.";
}
