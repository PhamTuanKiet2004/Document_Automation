<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Template;

// Content for Employment Contract
$contractContent = '
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
    <p>Sinh ngày: .................... CMND/CCCD số: ....................</p>
    <p>Địa chỉ thường trú: ....................</p>
    
    <p>Thỏa thuận ký kết hợp đồng lao động và cam kết làm đúng những điều khoản sau đây:</p>
    
    <p><strong>Điều 1: Công việc và địa điểm làm việc</strong></p>
    <p>- Chức vụ (Vị trí chuyên môn): {{ position }}</p>
    <p>- Địa điểm làm việc: Trụ sở chính công ty ABC</p>
    
    <p><strong>Điều 2: Lương và phụ cấp</strong></p>
    <p>- Mức lương cơ bản: {{ salary }} VNĐ/tháng</p>
    <p>- Hình thức trả lương: Chuyển khoản hoặc tiền mặt</p>
    
    <p><strong>Điều 3: Thời hạn hợp đồng</strong></p>
    <p>- Ngày bắt đầu làm việc: {{ start_date }}</p>
    
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

Template::where('title', 'Hợp đồng lao động')->update(['content' => $contractContent]);

// Content for Leave Request
$leaveContent = '
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
';

Template::where('title', 'Đơn xin nghỉ phép')->update(['content' => $leaveContent]);

echo "Templates updated successfully.";
