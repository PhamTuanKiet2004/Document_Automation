<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

if (!Schema::hasColumn('documents', 'custom_content')) {
    Schema::table('documents', function (Blueprint $table) {
        $table->longText('custom_content')->nullable()->after('content_data');
    });
    echo "Column 'custom_content' added successfully.";
} else {
    echo "Column already exists.";
}
