<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Document;
use App\Models\Template;
use App\Models\User;
use App\Mail\AccountLocked;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'templates' => Template::count(),
            'categories' => Category::count(),
            'users' => User::count(),
            'documents' => Document::count(),
            'documents_sent' => Document::where('status', 'sent')->count(),
            'documents_draft' => Document::where('status', 'draft')->count(),
        ]);
    }

    public function getUsers()
    {
        return User::latest()->get();
    }

    public function toggleUserStatus(User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();

        if (!$user->is_active) {
            Mail::to($user->email)->send(new AccountLocked($user));
        }

        return response()->json(['message' => 'Status updated', 'user' => $user]);
    }
}
