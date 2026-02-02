<!DOCTYPE html>
<html>

<head>
    <title>Tài liệu của bạn</title>
</head>

<body>
    @if(isset($isEmailMode) && $isEmailMode && !empty($htmlContent))
        <div style="font-family: inherit; line-height: 1.5;">
            {!! $htmlContent !!}
        </div>
        <br>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999; margin-top: 10px;">
            Email này được gửi qua hệ thống Tự động hóa Văn bản.
        </p>
    @else
        <h1>Xin chào,</h1>
        <p>Bạn nhận được email này vì một tài liệu đã được gửi đến bạn từ hệ thống Tự động hóa Văn bản.</p>
        <p>Tiêu đề: <strong>{{ $documentTitle }}</strong></p>
        <p>Vui lòng xem file đính kèm.</p>
        <br>
        <p>Trân trọng,</p>
        <p>Document Automation System</p>
    @endif
</body>

</html>