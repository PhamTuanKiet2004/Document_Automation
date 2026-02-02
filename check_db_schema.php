<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$columns = Schema::getColumnListing('documents');
print_r($columns);

if (in_array('custom_content', $columns)) {
    echo "Column 'custom_content' EXISTS.";
} else {
    echo "Column 'custom_content' DOES NOT EXIST.";
}
