<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = Template::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:document,email',
            'fields' => 'nullable|array',
            'fields.*.field_key' => 'required|string',
            'fields.*.label' => 'required|string',
            'fields.*.input_type' => 'required|string',
            'fields.*.is_required' => 'boolean',
            'fields.*.options' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($validated) {
            $template = Template::create([
                'category_id' => $validated['category_id'] ?? null,
                'title' => $validated['title'],
                'content' => $validated['content'],
                'type' => $validated['type'],
            ]);

            if (isset($validated['fields'])) {
                foreach ($validated['fields'] as $field) {
                    $template->fields()->create($field);
                }
            }

            return $template->load('fields', 'category');
        });
    }

    public function show(Template $template)
    {
        return $template->load('fields', 'category');
    }

    public function update(Request $request, Template $template)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'title' => 'string|max:255',
            'content' => 'string',
            'type' => 'in:document,email',
            'fields' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($request, $template, $validated) {
            $template->update($request->only(['category_id', 'title', 'content', 'type']));

            if ($request->has('fields')) {
                // Determine which fields to keep, update, or create
                // Simplified approach: Delete all and recreate (or user smart sync if IDs provided)
                // For now, let's delete existing and recreate
                $template->fields()->delete();
                foreach ($validated['fields'] as $field) {
                    $template->fields()->create($field);
                }
            }

            return $template->load('fields', 'category');
        });
    }

    public function destroy(Template $template)
    {
        $template->delete();
        return response()->noContent();
    }
}
