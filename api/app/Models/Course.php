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

    public function quiz() {
        return $this->hasOne(Quiz::class);
    }

    public function ratings() {
        return $this->hasMany(CourseRating::class);
    }

    public function getAverageRatingAttribute() {
        return round($this->ratings()->avg('rating'), 1) ?: 0;
    }

    public function getRatingsCountAttribute() {
        return $this->ratings()->count();
    }
}
