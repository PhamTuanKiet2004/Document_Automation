<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Categories
Route::apiResource('categories', \App\Http\Controllers\CategoryController::class);

// Templates
Route::apiResource('templates', \App\Http\Controllers\TemplateController::class);

// Documents
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('documents', \App\Http\Controllers\DocumentController::class);
    Route::get('/documents/{document}/export/pdf', [\App\Http\Controllers\DocumentController::class, 'exportPDF']);
    Route::get('/documents/{document}/export/word', [\App\Http\Controllers\DocumentController::class, 'exportWord']);
    Route::post('/documents/{document}/send-email', [\App\Http\Controllers\DocumentController::class, 'sendEmail']);
    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\AdminController::class, 'stats']);
        Route::get('/users', [\App\Http\Controllers\AdminController::class, 'getUsers']);
        Route::post('/users/{user}/toggle-status', [\App\Http\Controllers\AdminController::class, 'toggleUserStatus']);
    });
});
