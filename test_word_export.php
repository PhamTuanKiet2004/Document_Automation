<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// We need to simulate a request or just call the logic
// Let's create a minimal script that uses the models directly
use App\Models\User;
use App\Models\Template;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;

// Create a dummy user and login
$user = User::first();
if (!$user) {
    $user = User::factory()->create();
}
Auth::login($user);

// Create a dummy template & document
$template = Template::create([
    'title' => 'Test Template',
    'content' => 'Hello World',
    'type' => 'document'
]);

$document = Document::create([
    'user_id' => $user->id,
    'template_id' => $template->id,
    'content_data' => [],
    'custom_content' => '<h1>Hello World</h1><p>This is a test.</p>',
    'status' => 'draft'
]);

echo "Testing Word Export for Doc ID: " . $document->id . "\n";

try {
    $controller = new \App\Http\Controllers\DocumentController();
    $response = $controller->exportWord($document);
    echo "Success! Response content type: " . $response->headers->get('content-type') . "\n";
    // We can delete the temp file if created, but for test we just want to see if it crashes.
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
