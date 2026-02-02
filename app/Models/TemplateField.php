<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateField extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'field_key',
        'label',
        'input_type',
        'is_required',
        'options'
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'options' => 'array',
    ];

    public function template()
    {
        return $this->belongsTo(Template::class);
    }
}
