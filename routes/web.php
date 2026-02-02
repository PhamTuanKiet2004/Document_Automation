<?php

use Illuminate\Support\Facades\Route;

// React SPA route - catch all routes and return the app view
Route::get('/update-templates', function () {
    $template = \App\Models\Template::where('title', 'Hợp đồng lao động')->first();
    if (!$template)
        return 'Template not found';

    // Update Content
    $template->content = '
<div style="font-family: \'Times New Roman\', Times, serif; font-size: 12pt; line-height: 1.5;">
    <div style="text-align: center; margin-bottom: 20px;">
        <p style="text-transform: uppercase; font-weight: bold; margin: 0;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p style="font-weight: bold; margin: 0; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</p>
    </div>
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="text-transform: uppercase; font-weight: bold; font-size: 16pt; margin-bottom: 5px;">HỢP ĐỒNG LAO ĐỘNG</h1>
        <p style="font-style: italic;">(Số: ............/HĐLĐ)</p>
    </div>
    <p>Hôm nay, ngày ...... tháng ...... năm 20...., tại Văn phòng Công ty ABC...</p>
    <div style="margin-bottom: 15px;">
        <p><strong>BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</strong></p>
        <p>CÔNG TY CỔ PHẦN ABC</p>
    </div>
    <div style="margin-bottom: 15px;">
        <p><strong>BÊN B: NGƯỜI LAO ĐỘNG</strong></p>
        <p>Ông/Bà: <strong>{{ employee_name }}</strong> &nbsp;&nbsp; Giới tính: {{ gender }}</p>
        <p>Sinh ngày: {{ birth_date }}</p>
        <p>Số CMND/CCCD: {{ id_number }} &nbsp; Ngày cấp: {{ id_issue_date }} &nbsp; Nơi cấp: {{ id_issue_place }}</p>
        <p>Địa chỉ thường trú: {{ address }}</p>
        <p>Chỗ ở hiện nay: {{ current_address }}</p>
    </div>
    <p><strong>Điều 1: Công việc và địa điểm</strong></p>
    <p>1. Vị trí: {{ position }}</p>
    <p>2. Địa điểm: Trụ sở công ty.</p>
    <p>3. Thời hạn: Từ {{ start_date }} đến {{ end_date }}</p>
    <p><strong>Điều 2: Lương và phụ cấp</strong></p>
    <p>1. Lương: {{ salary }} VNĐ/tháng.</p>
    <p><strong>Điều 3: Thời giờ làm việc</strong></p>
    <p>8 giờ/ngày, nghỉ Chủ nhật.</p>
    <p><strong>Điều 4: Quyền lợi và Nghĩa vụ</strong></p>
    <p>Được đóng BHXH, BHYT theo quy định.</p>
    <p><strong>Điều 5: Thỏa thuận khác</strong></p>
    <p>{{ other_terms }}</p>
    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="text-align: center; width: 45%;">
            <p><strong>NGƯỜI LAO ĐỘNG</strong></p>
            <br><br><br>
            <p>{{ employee_name }}</p>
        </div>
        <div style="text-align: center; width: 45%;">
            <p><strong>GIÁM ĐỐC</strong></p>
            <br><br><br>
            <p>Nguyễn Văn A</p>
        </div>
    </div>
</div>';
    $template->save();

    // Update Fields
    \App\Models\TemplateField::where('template_id', $template->id)->delete();
    $fields = [
        ['employee_name', 'Họ và tên', 'text', true],
        ['gender', 'Giới tính', 'select', true, ['Nam', 'Nữ']],
        ['birth_date', 'Ngày sinh', 'date', true],
        ['id_number', 'Số CCCD', 'text', true],
        ['id_issue_date', 'Ngày cấp CCCD', 'date', true],
        ['id_issue_place', 'Nơi cấp', 'text', true],
        ['address', 'Hộ khẩu thường trú', 'text', true],
        ['current_address', 'Chỗ ở hiện nay', 'text', true],
        ['position', 'Vị trí công việc', 'text', true],
        ['start_date', 'Ngày bắt đầu', 'date', true],
        ['end_date', 'Ngày kết thúc', 'date', false],
        ['salary', 'Mức lương cơ bản', 'number', true],
        ['other_terms', 'Thỏa thuận khác', 'textarea', false],
    ];
    foreach ($fields as $f) {
        \App\Models\TemplateField::create([
            'template_id' => $template->id,
            'field_key' => $f[0],
            'label' => $f[1],
            'input_type' => $f[2],
            'is_required' => $f[3],
            'options' => $f[4] ?? null,
        ]);
    }
    return "Cập nhật Mẫu Hợp đồng chuẩn thành công! Bạn có thể quay lại trang chủ.";
});

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
