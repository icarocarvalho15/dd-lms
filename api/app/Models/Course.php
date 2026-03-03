<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    
    protected $guarded = [];

    public function modules()
    {
        return $this->hasMany(Module::class);
    }
    
    public function instructor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
