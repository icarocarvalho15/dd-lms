<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'user_id',
        'is_published',
        'duration_minutes',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'is_published' => 'boolean',
    ];

    public function modules()
    {
        return $this->hasMany(Module::class);
    }
    
    public function instructor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }
}
